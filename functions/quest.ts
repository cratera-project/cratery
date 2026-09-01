import { createSupabaseClient, type Env } from './lib/supabase'
import { getSessionUser } from './lib/session'
import { isReservedUsername } from '../src/lib/reserved'
import { sanitizeAvatarConfig } from '../src/lib/avatar'
import { BUILTIN_ANSWERS } from './lib/builtinCorrect'
import { isKnownContestId } from '../src/data/contestIds'
import { rankForXp } from '../src/lib/ranks'
import { corsHeaders } from './lib/cors'
import { consumeRateLimit } from './lib/rateLimit'
import { requireTurnstile } from './lib/turnstile'
import {
    createGuestClearanceToken,
    guestClearanceSetCookieHeader,
    hasValidGuestClearance,
} from './lib/guestClearance'
import { loadPublicProfile } from './lib/profileData'
import { awardAuthorXp, insertNotification, loadTotalXp, PUBLISH_XP, SOLVE_DRIP_XP } from './lib/xp'
import { syncCustomerioAfterAnswer } from './lib/customerio-sync'
import { incrementQuestAnswerStats } from './lib/questStats'

type AnswerBody = {
    question_id?: string
    selected_index?: number
    'cf-turnstile-response'?: string
}

type RatingBody = {
    question_id?: string
    rating?: number
}

function jsonResponse(data: unknown, status = 200, env?: Env, request?: Request, extraHeaders?: HeadersInit): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...(env ? corsHeaders(env, request) : { 'Content-Type': 'application/json' }),
            ...extraHeaders,
        },
    })
}

function errorResponse(message: string, status = 400, env?: Env, request?: Request): Response {
    return jsonResponse({ status: 'error', error: message }, status, env, request)
}

async function resolveAnswerKey(
    supabase: ReturnType<typeof createSupabaseClient>,
    questionId: string
): Promise<{ correctIndex: number; explanation: string | null; categorySlug: string } | null> {
    if (questionId.startsWith('uq:')) {
        const id = questionId.slice(3)
        const { data, error } = await supabase
            .from('user_quests')
            .select('correct_index, explanation')
            .eq('id', id)
            .maybeSingle()
        if (error || !data) return null
        const correctIndex = Number(data.correct_index)
        if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) return null
        return {
            correctIndex,
            explanation: (data.explanation as string) ?? null,
            categorySlug: 'community',
        }
    }
    const meta = BUILTIN_ANSWERS[questionId]
    if (!meta) return null
    return {
        correctIndex: meta.correctIndex,
        explanation: meta.explanation || null,
        categorySlug: meta.categorySlug,
    }
}


async function bumpGuestAnswerStats(
    supabase: ReturnType<typeof createSupabaseClient>,
    questionId: string,
    isCorrect: boolean
): Promise<void> {
    const GUEST_STATS_RPC_NAME = 'increment_quest_answer_stats'
    void GUEST_STATS_RPC_NAME
    await incrementQuestAnswerStats(supabase, questionId, isCorrect)
}

export async function handleSubmitQuestAnswer(
    request: Request,
    env: Env,
    ctx?: ExecutionContext
): Promise<Response> {
    let body: AnswerBody
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const questionId = body.question_id?.trim()
    const selectedIndex = body.selected_index

    if (!questionId) {
        return errorResponse('question_id required', 400, env, request)
    }
    const selected = Number(selectedIndex)
    if (!Number.isInteger(selected) || selected < 0 || selected > 3) {
        return errorResponse('selected_index must be 0-3', 400, env, request)
    }

    const authUser = await getSessionUser(request, env)
    const userId = authUser?.sub ?? null

    if (userId && !(await consumeRateLimit(env, `answer:user:${userId}`, 500, 3600))) {
        return errorResponse('Too many answers. Please try again later.', 429, env, request)
    }

    const supabase = createSupabaseClient(env)
    const key = await resolveAnswerKey(supabase, questionId)
    if (!key) return errorResponse('Unknown question', 404, env, request)

    const categorySlug = key.categorySlug
    const isCorrect = selected === key.correctIndex
    const xpEarned = userId && isCorrect ? 10 : 0
    const reveal = {
        is_correct: isCorrect,
        correct_index: key.correctIndex,
        explanation: key.explanation,
        xp_earned: xpEarned,
    }

    
    if (!userId) {
        const cleared = await hasValidGuestClearance(request, env)
        if (!cleared) {
            const ok = await requireTurnstile(env, request, body['cf-turnstile-response'])
            if (!ok) return errorResponse('forbidden', 403, env, request)
        }

        await bumpGuestAnswerStats(supabase, questionId, isCorrect)

        
        const headers: Record<string, string> = {}
        if (env.JWT_SECRET) {
            const clearance = await createGuestClearanceToken(env.JWT_SECRET)
            headers['Set-Cookie'] = guestClearanceSetCookieHeader(clearance, env)
        }
        return jsonResponse({ status: 'ok', answer: reveal }, 200, env, request, headers)
    }

    const { data: existing } = await supabase
        .from('quest_answers')
        .select('id, is_correct, xp_earned')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle()

    if (existing) {
        if (!existing.is_correct && isCorrect) {
            
            await supabase
                .from('quest_answers')
                .update({
                    selected_index: selected,
                    is_correct: true,
                    xp_earned: xpEarned,
                    answered_at: new Date().toISOString(),
                })
                .eq('id', existing.id)

            if (questionId.startsWith('uq:')) {
                const questUuid = questionId.slice(3)
                const { data: authored } = await supabase
                    .from('user_quests')
                    .select('id, title, slug, author_id')
                    .eq('id', questUuid)
                    .maybeSingle()
                if (authored && authored.author_id && authored.author_id !== userId) {
                    await awardAuthorXp(supabase, authored.author_id, SOLVE_DRIP_XP)
                    await insertNotification(supabase, authored.author_id, 'quest_solved', {
                        quest_id: authored.id,
                        quest_title: authored.title,
                        quest_slug: authored.slug,
                        solver_id: userId,
                        solver_username: authUser?.username || 'Anonymous',
                        xp_awarded: SOLVE_DRIP_XP,
                    })
                }
            }

            const totalXp = await loadTotalXp(supabase, userId)
            return jsonResponse(
                {
                    status: 'ok',
                    answer: {
                        id: existing.id,
                        is_correct: true,
                        correct_index: key.correctIndex,
                        explanation: key.explanation,
                        xp_earned: xpEarned,
                        total_xp: totalXp,
                        rank: rankForXp(totalXp).name,
                    },
                },
                200,
                env,
                request
            )
        }

        const totalXp = await loadTotalXp(supabase, userId)
        return jsonResponse(
            {
                status: 'already_answered',
                answer: {
                    id: existing.id,
                    is_correct: existing.is_correct,
                    correct_index: key.correctIndex,
                    explanation: key.explanation,
                    xp_earned: existing.is_correct ? (existing.xp_earned || xpEarned) : 0,
                    total_xp: totalXp,
                    rank: rankForXp(totalXp).name,
                },
            },
            200,
            env,
            request
        )
    }

    const { data, error } = await supabase
        .from('quest_answers')
        .insert({
            user_id: userId,
            question_id: questionId,
            category_slug: categorySlug,
            selected_index: selected,
            is_correct: isCorrect,
            xp_earned: xpEarned,
            answered_at: new Date().toISOString(),
        })
        .select('id')
        .single()

    if (error) {
        if (error.code === '23505') {
            const { data: race } = await supabase
                .from('quest_answers')
                .select('id, is_correct, xp_earned')
                .eq('user_id', userId)
                .eq('question_id', questionId)
                .maybeSingle()

            if (race && !race.is_correct && isCorrect) {
                await supabase
                    .from('quest_answers')
                    .update({
                        selected_index: selected,
                        is_correct: true,
                        xp_earned: xpEarned,
                        answered_at: new Date().toISOString(),
                    })
                    .eq('id', race.id)
            }

            const totalXp = await loadTotalXp(supabase, userId)
            return jsonResponse(
                {
                    status: (race && !race.is_correct && isCorrect) ? 'ok' : 'already_answered',
                    answer: {
                        id: race?.id,
                        is_correct: race?.is_correct || isCorrect,
                        correct_index: key.correctIndex,
                        explanation: key.explanation,
                        xp_earned: (race?.is_correct || isCorrect) ? xpEarned : 0,
                        total_xp: totalXp,
                        rank: rankForXp(totalXp).name,
                    },
                },
                200,
                env,
                request
            )
        }
        console.error('submit_quest_answer insert failed:', error)
        return errorResponse('Failed to save answer', 500, env, request)
    }

    if (isCorrect && questionId.startsWith('uq:')) {
        const questUuid = questionId.slice(3)
        const { data: authored } = await supabase
            .from('user_quests')
            .select('id, title, slug, author_id')
            .eq('id', questUuid)
            .maybeSingle()
        if (authored && authored.author_id && authored.author_id !== userId) {
            const dripAmount = SOLVE_DRIP_XP
            await awardAuthorXp(supabase, authored.author_id as string, dripAmount)
            const solverName = authUser?.username ?? 'a rustacean'
            await insertNotification(supabase, authored.author_id as string, 'quest_solved', {
                username: solverName,
                quest_title: authored.title,
                quest_slug: authored.slug,
            })
        }
    }

    const totalXp = await loadTotalXp(supabase, userId)

    const syncAnswer = () =>
        syncCustomerioAfterAnswer(env, userId, {
            isCorrect,
            xpEarned,
            categorySlug,
            prevTotalXp: isCorrect ? totalXp - xpEarned : totalXp,
            newTotalXp: totalXp,
        })
    if (ctx) ctx.waitUntil(syncAnswer())
    else void syncAnswer()

    return jsonResponse(
        {
            status: 'ok',
            answer: {
                id: data.id,
                ...reveal,
                total_xp: totalXp,
                rank: rankForXp(totalXp).name,
            },
        },
        200,
        env,
        request
    )
}

export async function handleGetMyProgress(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    const supabase = createSupabaseClient(env)
    const [answersRes, ratingsRes, contestScoresRes] = await Promise.all([
        supabase
            .from('quest_answers')
            .select('question_id, selected_index, is_correct, answered_at')
            .eq('user_id', authUser.sub),
        supabase
            .from('quest_ratings')
            .select('question_id, rating')
            .eq('user_id', authUser.sub),
        supabase
            .from('contest_scores')
            .select('contest_id, updated_at')
            .eq('user_id', authUser.sub),
    ])

    if (answersRes.error) {
        console.error('my_progress answers failed:', answersRes.error)
        return errorResponse('Failed to load progress', 500, env, request)
    }
    if (ratingsRes.error) {
        console.error('my_progress ratings failed:', ratingsRes.error)
        return errorResponse('Failed to load progress', 500, env, request)
    }

    const answers = [...(answersRes.data ?? [])]
    const answeredMap = new Set(answers.map((a) => a.question_id))
    for (const cs of contestScoresRes.data ?? []) {
        if (!answeredMap.has(cs.contest_id)) {
            answers.push({
                question_id: cs.contest_id,
                selected_index: 0,
                is_correct: true,
                answered_at: cs.updated_at || new Date().toISOString(),
            })
            answeredMap.add(cs.contest_id)
        }
    }

    return jsonResponse(
        {
            status: 'ok',
            answers,
            ratings: ratingsRes.data ?? [],
        },
        200,
        env,
        request
    )
}

export async function handleSyncLocalProgress(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    const userId = authUser.sub
    if (!(await consumeRateLimit(env, `sync:user:${userId}`, 10, 3600))) {
        return errorResponse('Too many sync requests. Please try again later.', 429, env, request)
    }

    let body: { answers?: Array<{ question_id?: string; selected_index?: number; answered_at?: number | string }> }
    try {
        body = (await request.json()) as typeof body
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const rawAnswers = Array.isArray(body.answers) ? body.answers.slice(0, 250) : []
    const supabase = createSupabaseClient(env)

    if (rawAnswers.length === 0) {
        const totalXp = await loadTotalXp(supabase, userId)
        return jsonResponse(
            {
                status: 'ok',
                syncedCount: 0,
                totalXp,
                rank: rankForXp(totalXp).name,
            },
            200,
            env,
            request
        )
    }

    
    const { data: existingRows } = await supabase
        .from('quest_answers')
        .select('question_id, is_correct')
        .eq('user_id', userId)

    const existingMap = new Map((existingRows ?? []).map((r) => [r.question_id, r.is_correct]))

    const toInsert: Array<{
        user_id: string
        question_id: string
        category_slug: string
        selected_index: number
        is_correct: boolean
        xp_earned: number
        answered_at: string
    }> = []

    const standardXp = 10

    for (const item of rawAnswers) {
        const qid = typeof item.question_id === 'string' ? item.question_id.trim() : ''
        const selected = Number(item.selected_index)
        if (!qid || !Number.isInteger(selected) || selected < 0 || selected > 3) continue

        
        if (existingMap.get(qid) === true) continue

        
        const key = await resolveAnswerKey(supabase, qid)
        if (!key) continue

        
        if (selected !== key.correctIndex) continue

        toInsert.push({
            user_id: userId,
            question_id: qid,
            category_slug: key.categorySlug,
            selected_index: selected,
            is_correct: true,
            xp_earned: standardXp,
            answered_at:
                typeof item.answered_at === 'number'
                    ? new Date(item.answered_at).toISOString()
                    : typeof item.answered_at === 'string'
                      ? item.answered_at
                      : new Date().toISOString(),
        })
    }

    if (toInsert.length > 0) {
        const { error } = await supabase
            .from('quest_answers')
            .upsert(toInsert, { onConflict: 'user_id,question_id' })
        if (error) {
            console.error('handleSyncLocalProgress upsert failed:', error)
        }
    }

    const totalXp = await loadTotalXp(supabase, userId)
    return jsonResponse(
        {
            status: 'ok',
            syncedCount: toInsert.length,
            totalXp,
            rank: rankForXp(totalXp).name,
        },
        200,
        env,
        request
    )
}

export async function handleSubmitQuestRating(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) {
        return errorResponse('Unauthorized', 401, env, request)
    }
    if (!(await consumeRateLimit(env, `rating:user:${authUser.sub}`, 60, 3600))) {
        return errorResponse('Too many ratings. Please try again later.', 429, env, request)
    }

    let body: RatingBody
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const questionId = body.question_id?.trim()
    const rating = body.rating

    if (!questionId) {
        return errorResponse('question_id required', 400, env, request)
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return errorResponse('rating must be 1-5', 400, env, request)
    }

    const supabase = createSupabaseClient(env)

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.sub)
        .maybeSingle()

    if (!profile) {
        return errorResponse('User not found', 404, env, request)
    }

    const { error } = await supabase.from('quest_ratings').upsert(
        {
            user_id: authUser.sub,
            question_id: questionId,
            rating,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,question_id' }
    )

    if (error) {
        console.error('submit_quest_rating upsert failed:', error)
        return errorResponse('Failed to save rating', 500, env, request)
    }

    return jsonResponse({ status: 'ok' }, 200, env, request)
}





type QuestKind = 'mcq' | 'coding'

type UserQuestBody = {
    id?: string
    kind?: string
    title?: string
    prompt?: string
    code?: string | null
    test_harness?: string | null
    options?: unknown
    correct_index?: number
    hint?: string | null
    explanation?: string
    difficulty?: number
}

const MAX_QUESTS_PER_USER = 50

const CODING_OPTIONS = ['(coding)', '(coding)', '(coding)', '(coding)'] as const

const RUST_SHAPE =
    /\b(fn|let|use|impl|struct|enum|match|mod|trait|type|const|static|pub)\b|::|->|#!\[|println!|Result|Option|Vec|String|i32|u32|&str/


const ABUSE_PATTERNS =
    /\b(std::(process|net|fs)|Command|TcpStream|UdpSocket|File::|std::os|include(?:_str|_bytes)?!|reqwest|ureq|hyper|tokio::net)\b/

function looksLikeRust(code: string): boolean {
    return RUST_SHAPE.test(code)
}

function hasAbusePatterns(code: string): boolean {
    return ABUSE_PATTERNS.test(code)
}

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60)
}

function validateQuestBody(body: UserQuestBody): { error?: string; value?: Record<string, unknown> } {
    const kindRaw = (body.kind ?? 'mcq').trim().toLowerCase()
    if (kindRaw !== 'mcq' && kindRaw !== 'coding') {
        return { error: 'kind must be mcq or coding' }
    }
    const kind = kindRaw as QuestKind

    const title = body.title?.trim() ?? ''
    const prompt = body.prompt?.trim() ?? ''
    const explanation = body.explanation?.trim() ?? ''
    const hint = body.hint?.trim() || null
    const code = body.code?.trim() || null
    const testHarness = body.test_harness?.trim() || null
    const difficulty = body.difficulty

    if (title.length < 5 || title.length > 120) return { error: 'Title must be 5-120 characters' }
    if (prompt.length < 10 || prompt.length > 2000) return { error: 'Prompt must be 10-2000 characters' }
    if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 3) {
        return { error: 'difficulty must be 1-3' }
    }
    if (hint && hint.length > 300) return { error: 'Hint must be at most 300 characters' }
    if (!code || code.length < 10) {
        return { error: 'Starter / code snippet is required (at least 10 characters)' }
    }
    if (code.length > 8000) return { error: 'Code must be at most 8000 characters' }
    if (!looksLikeRust(code)) {
        return { error: 'Code should look like Rust (include a snippet, not plain prose)' }
    }
    if (hasAbusePatterns(code)) {
        return { error: 'Code cannot use process, filesystem, network, or include! APIs' }
    }

    if (kind === 'coding') {
        if (!testHarness || testHarness.length < 20) {
            return { error: 'Test harness is required (at least 20 characters)' }
        }
        if (testHarness.length > 16000) {
            return { error: 'Test harness must be at most 16000 characters' }
        }
        if (!testHarness.includes('{{SOLUTION}}')) {
            return { error: 'Test harness must include {{SOLUTION}} where the starter code is inserted' }
        }
        if ((testHarness.match(/\{\{SOLUTION\}\}/g) ?? []).length !== 1) {
            return { error: 'Test harness must contain exactly one {{SOLUTION}} marker' }
        }
        if (!looksLikeRust(testHarness)) {
            return { error: 'Test harness should look like Rust' }
        }
        if (hasAbusePatterns(testHarness)) {
            return { error: 'Test harness cannot use process, filesystem, network, or include! APIs' }
        }
        if (!/\bassert(?:_eq|_ne)?!/.test(testHarness)) {
            return { error: 'Test harness must include at least one assert!, assert_eq!, or assert_ne!' }
        }
        if (!/\bfn\s+main\s*\(/.test(testHarness)) {
            return { error: 'Test harness must define fn main() so the Playground can run it' }
        }
        if (explanation.length > 4000) {
            return { error: 'Notes must be at most 4000 characters' }
        }

        return {
            value: {
                kind,
                title,
                prompt,
                explanation,
                hint,
                code,
                test_harness: testHarness,
                difficulty: Math.floor(difficulty),
                correct_index: 0,
                options: [...CODING_OPTIONS],
            },
        }
    }

    
    if (explanation.length < 10 || explanation.length > 4000) {
        return { error: 'Explanation must be 10-4000 characters' }
    }
    const options = Array.isArray(body.options)
        ? body.options.map((o) => (typeof o === 'string' ? o.trim() : ''))
        : null
    const correctIndex = body.correct_index
    if (!options || options.length !== 4 || options.some((o) => o.length === 0 || o.length > 300)) {
        return { error: 'Exactly 4 options required (max 300 chars each)' }
    }
    if (typeof correctIndex !== 'number' || correctIndex < 0 || correctIndex > 3) {
        return { error: 'correct_index must be 0-3' }
    }

    const idx = Math.floor(correctIndex)
    const lens = options.map((o) => o.length)
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length
    const max = Math.max(...lens)
    const min = Math.min(...lens)
    const spread = mean > 0 ? (max - min) / mean : 0
    const maxCount = lens.filter((l) => l === max).length
    const others = lens.filter((_, i) => i !== idx).sort((a, b) => a - b)
    const mid = Math.floor(others.length / 2)
    const otherMed =
        others.length % 2 === 1 ? others[mid]! : (others[mid - 1]! + others[mid]!) / 2
    const ratio = otherMed > 0 ? lens[idx]! / otherMed : 1
    if (spread > 0.35 || (maxCount === 1 && lens[idx] === max && ratio > 1.25)) {
        return {
            error:
                'Options are uneven: the correct answer stands out by length. Shorten it and put reasoning in the explanation.',
        }
    }

    return {
        value: {
            kind: 'mcq',
            title,
            prompt,
            explanation,
            hint,
            code,
            test_harness: null,
            difficulty: Math.floor(difficulty),
            correct_index: idx,
            options,
        },
    }
}

export async function handleCreateUserQuest(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)
    if (!(await consumeRateLimit(env, `create-quest:user:${authUser.sub}`, 10, 3600))) {
        return errorResponse('Too many quests created. Please try again later.', 429, env, request)
    }

    let body: UserQuestBody
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const { error: validationError, value } = validateQuestBody(body)
    if (validationError || !value) return errorResponse(validationError ?? 'Invalid quest', 400, env, request)

    const supabase = createSupabaseClient(env)

    const { count } = await supabase
        .from('user_quests')
        .select('id', { count: 'exact', head: true })
        .eq('author_id', authUser.sub)
    if ((count ?? 0) >= MAX_QUESTS_PER_USER) {
        return errorResponse(`Quest limit reached (${MAX_QUESTS_PER_USER})`, 429, env, request)
    }

    const baseSlug = slugify(value.title as string)
    if (baseSlug.length < 3 || isReservedUsername(baseSlug)) {
        return errorResponse('Title produces an invalid link slug. Try a more descriptive title', 400, env, request)
    }

    const { data: existing } = await supabase
        .from('user_quests')
        .select('slug')
        .eq('author_id', authUser.sub)
    const taken = new Set((existing ?? []).map((r: { slug: string }) => r.slug))
    let slug = baseSlug
    for (let i = 2; taken.has(slug); i++) slug = `${baseSlug}-${i}`

    const { data, error } = await supabase
        .from('user_quests')
        .insert({ ...value, author_id: authUser.sub, slug })
        .select('id, slug')
        .single()

    if (error) {
        console.error('create_user_quest failed:', error)
        return errorResponse('Failed to create quest', 500, env, request)
    }

    await awardAuthorXp(supabase, authUser.sub, PUBLISH_XP)

    return jsonResponse({ status: 'ok', quest: data, xp_earned: PUBLISH_XP }, 201, env, request)
}

export async function handleUpdateUserQuest(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    let body: UserQuestBody
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }
    if (!body.id) return errorResponse('id required', 400, env, request)

    const { error: validationError, value } = validateQuestBody(body)
    if (validationError || !value) return errorResponse(validationError ?? 'Invalid quest', 400, env, request)

    const supabase = createSupabaseClient(env)

    
    const { data: existing } = await supabase
        .from('user_quests')
        .select('id, kind')
        .eq('id', body.id)
        .eq('author_id', authUser.sub)
        .maybeSingle()
    if (!existing) return errorResponse('Quest not found', 404, env, request)
    if (value.kind !== existing.kind) {
        return errorResponse('Cannot change quest type after publishing', 400, env, request)
    }

    const { data, error } = await supabase
        .from('user_quests')
        .update(value)
        .eq('id', body.id)
        .eq('author_id', authUser.sub)
        .select('id, slug')
        .maybeSingle()

    if (error) {
        console.error('update_user_quest failed:', error)
        return errorResponse('Failed to update quest', 500, env, request)
    }
    if (!data) return errorResponse('Quest not found', 404, env, request)

    return jsonResponse({ status: 'ok', quest: data }, 200, env, request)
}

export async function handleDeleteUserQuest(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return errorResponse('id required', 400, env, request)

    const supabase = createSupabaseClient(env)
    const { error } = await supabase
        .from('user_quests')
        .delete()
        .eq('id', id)
        .eq('author_id', authUser.sub)

    if (error) {
        console.error('delete_user_quest failed:', error)
        return errorResponse('Failed to delete quest', 500, env, request)
    }
    return jsonResponse({ status: 'ok' }, 200, env, request)
}

const COMMENT_MAX = 2000
const COMMENTS_LIST_LIMIT = 100

export const COMMENT_RATE = {
    windowSec: 3600,
    createUser: 20,
    createIp: 30,
    mutateUser: 30,
    mutateIp: 30,
} as const
const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type CommentRow = {
    id: string
    question_id: string
    author_id: string
    body: string
    created_at: string
    updated_at: string
}


function normalizeQuestionId(raw: string | undefined | null): string | null {
    const id = raw?.trim()
    if (!id || id.length > 80) return null
    return id
}

function normalizeUuid(raw: string | undefined | null): string | null {
    const id = raw?.trim()
    if (!id || !UUID_RE.test(id)) return null
    return id
}

async function questionExists(
    supabase: ReturnType<typeof createSupabaseClient>,
    questionId: string
): Promise<boolean> {
    if (questionId.startsWith('uq:')) {
        const uuid = normalizeUuid(questionId.slice(3))
        if (!uuid) return false
        const { data } = await supabase.from('user_quests').select('id').eq('id', uuid).maybeSingle()
        return Boolean(data)
    }
    if (isKnownContestId(questionId)) {
        return true
    }
    return questionId in BUILTIN_ANSWERS
}

export async function handleReportUserQuest(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    const reporterId = authUser?.sub ?? null

    let body: { question_id?: string; reason?: string; 'cf-turnstile-response'?: string }
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const ok = await requireTurnstile(env, request, body['cf-turnstile-response'])
    if (!ok) return errorResponse('forbidden', 403, env, request)

    const questionId = normalizeQuestionId(body.question_id)
    const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
    if (!questionId) return errorResponse('question_id required', 400, env, request)
    if (reason.length < 3 || reason.length > 1000) {
        return errorResponse('Reason must be 3-1000 characters', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    if (!(await questionExists(supabase, questionId))) {
        return errorResponse('Quest not found', 404, env, request)
    }

    const { error } = await supabase.from('quest_reports').insert({
        question_id: questionId,
        reason,
        reporter_id: reporterId,
    })
    if (error) {
        console.error('quest_report insert failed:', error)
        return errorResponse('Failed to save report', 500, env, request)
    }

    return jsonResponse({ status: 'ok' }, 201, env, request)
}

function mapComment(row: CommentRow, username: string) {
    const edited =
        new Date(row.updated_at).getTime() - new Date(row.created_at).getTime() > 2000
    return {
        id: row.id,
        question_id: row.question_id,
        author_id: row.author_id,
        username,
        body: row.body,
        created_at: row.created_at,
        updated_at: row.updated_at,
        edited,
    }
}

export async function handleListQuestComments(request: Request, env: Env): Promise<Response> {
    const questionId = normalizeQuestionId(new URL(request.url).searchParams.get('question_id'))
    if (!questionId) return errorResponse('question_id required', 400, env, request)

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase
        .from('quest_comments')
        .select('id, question_id, author_id, body, created_at, updated_at')
        .eq('question_id', questionId)
        .order('created_at', { ascending: true })
        .limit(COMMENTS_LIST_LIMIT)

    if (error) {
        console.error('list_quest_comments failed:', error)
        return errorResponse('Failed to load comments', 500, env, request)
    }

    const rows = (data ?? []) as CommentRow[]
    const authorIds = [...new Set(rows.map((r) => r.author_id))]
    const profileById = new Map<string, { username: string }>()
    if (authorIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', authorIds)
        if (profileError) {
            console.error('list_quest_comments profiles failed:', profileError)
            return errorResponse('Failed to load comments', 500, env, request)
        }
        for (const p of profiles ?? []) {
            profileById.set(p.id as string, {
                username: (p.username as string) ?? 'unknown',
            })
        }
    }

    const comments = rows.map((row) => {
        const prof = profileById.get(row.author_id)
        return mapComment(row, prof?.username ?? 'unknown')
    })
    return jsonResponse({ status: 'ok', comments }, 200, env, request)
}

export async function handleCreateQuestComment(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)
    if (
        !(await consumeRateLimit(
            env,
            `comment:user:${authUser.sub}`,
            COMMENT_RATE.createUser,
            COMMENT_RATE.windowSec
        ))
    ) {
        return errorResponse('Too many comments. Please try again later.', 429, env, request)
    }

    let body: { question_id?: string; body?: string }
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const questionId = normalizeQuestionId(body.question_id)
    const text = typeof body.body === 'string' ? body.body.trim() : ''
    if (!questionId) return errorResponse('question_id required', 400, env, request)
    if (text.length < 1 || text.length > COMMENT_MAX) {
        return errorResponse(`Comment must be 1-${COMMENT_MAX} characters`, 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    if (!(await questionExists(supabase, questionId))) {
        return errorResponse('Quest not found', 404, env, request)
    }

    
    const { data, error } = await supabase
        .from('quest_comments')
        .insert({
            question_id: questionId,
            author_id: authUser.sub,
            body: text,
        })
        .select('id, question_id, author_id, body, created_at, updated_at')
        .single()

    if (error || !data) {
        console.error('create_quest_comment failed:', error)
        return errorResponse('Failed to post comment', 500, env, request)
    }

    return jsonResponse(
        {
            status: 'ok',
            comment: mapComment(data as CommentRow, authUser.username || 'unknown'),
        },
        201,
        env,
        request
    )
}

export async function handleUpdateQuestComment(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)
    if (
        !(await consumeRateLimit(
            env,
            `comment-edit:user:${authUser.sub}`,
            COMMENT_RATE.mutateUser,
            COMMENT_RATE.windowSec
        ))
    ) {
        return errorResponse('Too many edits. Please try again later.', 429, env, request)
    }

    let body: { id?: string; body?: string }
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const id = normalizeUuid(body.id)
    const text = typeof body.body === 'string' ? body.body.trim() : ''
    if (!id) return errorResponse('id required', 400, env, request)
    if (text.length < 1 || text.length > COMMENT_MAX) {
        return errorResponse(`Comment must be 1-${COMMENT_MAX} characters`, 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    
    
    const { data, error } = await supabase
        .from('quest_comments')
        .update({ body: text })
        .eq('id', id)
        .eq('author_id', authUser.sub)
        .select('id, question_id, author_id, body, created_at, updated_at')
        .maybeSingle()

    if (error) {
        console.error('update_quest_comment failed:', error)
        return errorResponse('Failed to edit comment', 500, env, request)
    }
    if (!data) return errorResponse('Not your comment', 403, env, request)

    return jsonResponse(
        {
            status: 'ok',
            comment: mapComment(data as CommentRow, authUser.username || 'unknown'),
        },
        200,
        env,
        request
    )
}

export async function handleDeleteQuestComment(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)
    if (
        !(await consumeRateLimit(
            env,
            `comment-del:user:${authUser.sub}`,
            COMMENT_RATE.mutateUser,
            COMMENT_RATE.windowSec
        ))
    ) {
        return errorResponse('Too many deletes. Please try again later.', 429, env, request)
    }

    const id = normalizeUuid(new URL(request.url).searchParams.get('id'))
    if (!id) return errorResponse('id required', 400, env, request)

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase
        .from('quest_comments')
        .delete()
        .eq('id', id)
        .eq('author_id', authUser.sub)
        .select('id')
        .maybeSingle()

    if (error) {
        console.error('delete_quest_comment failed:', error)
        return errorResponse('Failed to delete comment', 500, env, request)
    }
    if (!data) return errorResponse('Not your comment', 403, env, request)

    return jsonResponse({ status: 'ok' }, 200, env, request)
}

export async function handleReportComment(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    const reporterId = authUser?.sub ?? null

    let body: { comment_id?: string; reason?: string; 'cf-turnstile-response'?: string }
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const ok = await requireTurnstile(env, request, body['cf-turnstile-response'])
    if (!ok) return errorResponse('forbidden', 403, env, request)

    const commentId = normalizeUuid(body.comment_id)
    const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
    if (!commentId) return errorResponse('comment_id required', 400, env, request)
    if (reason.length < 3 || reason.length > 1000) {
        return errorResponse('Reason must be 3-1000 characters', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    const { data: comment } = await supabase
        .from('quest_comments')
        .select('id, author_id')
        .eq('id', commentId)
        .maybeSingle()
    if (!comment) return errorResponse('Comment not found', 404, env, request)
    if (reporterId && comment.author_id === reporterId) {
        return errorResponse('Cannot report your own comment', 400, env, request)
    }

    const { error } = await supabase.from('comment_reports').insert({
        comment_id: commentId,
        reason,
        reporter_id: reporterId,
    })
    if (error) {
        console.error('comment_report insert failed:', error)
        return errorResponse('Failed to save report', 500, env, request)
    }

    return jsonResponse({ status: 'ok' }, 201, env, request)
}

export async function handleUpdateAvatar(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    let body: { avatar?: unknown }
    try {
        body = (await request.json()) as { avatar?: unknown }
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const avatar = sanitizeAvatarConfig(body.avatar, authUser.sub)
    if (!avatar) return errorResponse('Invalid avatar', 400, env, request)

    const supabase = createSupabaseClient(env)
    const { error } = await supabase.from('profiles').update({ avatar }).eq('id', authUser.sub)

    if (error) {
        console.error('update_avatar failed:', error)
        return errorResponse('Failed to save avatar', 500, env, request)
    }

    return jsonResponse({ status: 'ok', avatar }, 200, env, request)
}

export async function handleListMyQuests(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase
        .from('user_quests')
        .select(
            'id, slug, title, prompt, kind, code, test_harness, options, correct_index, hint, explanation, difficulty, created_at'
        )
        .eq('author_id', authUser.sub)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('list_my_quests failed:', error)
        return errorResponse('Failed to load quests', 500, env, request)
    }
    return jsonResponse({ status: 'ok', quests: data ?? [] }, 200, env, request)
}

const PUBLIC_CACHE = { 'Cache-Control': 'public, max-age=30, s-maxage=60' }

const LIVE_STATS_CACHE = { 'Cache-Control': 'public, max-age=0, s-maxage=15' }

export async function handleGetSiteStats(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase.rpc('get_site_stats')
    if (error) {
        console.error('get_site_stats failed:', error)
        return errorResponse('Failed to load site stats', 500, env, request)
    }

    const stats =
        data && typeof data === 'object' && !Array.isArray(data)
            ? { ...(data as Record<string, unknown>) }
            : {}

    const { count, error: countError } = await supabase
        .from('custom_users')
        .select('id', { count: 'exact', head: true })
    if (countError) {
        console.error('custom_users member count failed:', countError)
    } else if (count != null) {
        stats.members = count
    }

    return jsonResponse({ status: 'ok', stats }, 200, env, request, LIVE_STATS_CACHE)
}

export async function handleGetPublicProfile(request: Request, env: Env): Promise<Response> {
    const username = new URL(request.url).searchParams.get('username')?.trim()
    if (!username || username.length > 40) return errorResponse('username required', 400, env, request)

    const profile = await loadPublicProfile(env, username)
    if (!profile) return errorResponse('Not found', 404, env, request)
    return jsonResponse({ status: 'ok', profile }, 200, env, request, { 'Cache-Control': 'no-cache, no-store, must-revalidate' })
}

export async function handleGetLeaderboard(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10) || 25))
    const kind = url.searchParams.get('kind') === 'creators' ? 'creators' : 'solvers'
    const supabase = createSupabaseClient(env)
    if (kind === 'creators') {
        const { data, error } = await supabase.rpc('get_creator_leaderboard', { p_limit: limit })
        if (error) {
            console.error('get_creator_leaderboard failed:', error)
            return errorResponse('Failed to load leaderboard', 500, env, request)
        }
        return jsonResponse({ status: 'ok', kind, entries: data ?? [] }, 200, env, request, PUBLIC_CACHE)
    }
    const { data, error } = await supabase.rpc('get_leaderboard', { p_limit: limit })
    if (error) {
        console.error('get_leaderboard failed:', error)
        return errorResponse('Failed to load leaderboard', 500, env, request)
    }
    return jsonResponse({ status: 'ok', kind, entries: data ?? [] }, 200, env, request, PUBLIC_CACHE)
}

type CommunityQuestRow = {
    id: string
    slug: string
    title: string
    kind: string
    difficulty: number
    created_at: string
    author_id: string
}

type CommunityQuestSort =
    | 'most_solved'
    | 'least_solved'
    | 'most_attempts'
    | 'least_attempts'
    | 'newest'
    | 'oldest'

const COMMUNITY_SORTS = new Set<string>([
    'most_solved',
    'least_solved',
    'most_attempts',
    'least_attempts',
    'newest',
    'oldest',
])

function parseCommunitySort(raw: string | null): CommunityQuestSort {
    if (!raw) return 'newest'
    
    if (raw === 'attempts') return 'most_attempts'
    if (raw === 'latest') return 'newest'
    if (COMMUNITY_SORTS.has(raw)) return raw as CommunityQuestSort
    return 'newest'
}

export async function handleListCommunityQuests(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '40', 10) || 40))
    const sort = parseCommunitySort(url.searchParams.get('sort'))
    const supabase = createSupabaseClient(env)

    const rows: CommunityQuestRow[] = []
    const pageSize = 1000
    for (let from = 0; from < 20_000; from += pageSize) {
        const { data, error } = await supabase
            .from('user_quests')
            .select('id, slug, title, kind, difficulty, created_at, author_id')
            .order('created_at', { ascending: false })
            .range(from, from + pageSize - 1)
        if (error) {
            console.error('list_community_quests failed:', error)
            return errorResponse('Failed to load community quests', 500, env, request)
        }
        const page = (data ?? []) as CommunityQuestRow[]
        rows.push(...page)
        if (page.length < pageSize) break
    }
    const authorIds = [...new Set(rows.map((r) => r.author_id))]
    const usernameById = new Map<string, string>()
    if (authorIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', authorIds)
        if (profileError) {
            console.error('list_community_quests profiles failed:', profileError)
            return errorResponse('Failed to load community quests', 500, env, request)
        }
        for (const p of profiles ?? []) {
            usernameById.set(p.id as string, p.username as string)
        }
    }

    const statsByQuestion = new Map<string, { solve_count: number; correct_count: number }>()
    const questionIds = rows.map((r) => `uq:${r.id}`)
    for (let i = 0; i < questionIds.length; i += 300) {
        const chunk = questionIds.slice(i, i + 300)
        const { data: statsData, error: statsError } = await supabase.rpc('get_quest_stats_batch', {
            p_question_ids: chunk,
        })
        if (statsError) {
            console.error('list_community_quests stats failed:', statsError)
            const { data: fallbackRows } = await supabase
                .from('quest_answer_stats')
                .select('question_id, solve_count, correct_count')
                .in('question_id', chunk)
            for (const r of fallbackRows ?? []) {
                statsByQuestion.set(r.question_id as string, {
                    solve_count: Number(r.solve_count) || 0,
                    correct_count: Number(r.correct_count) || 0,
                })
            }
            continue
        }
        if (statsData && typeof statsData === 'object') {
            for (const [qid, stats] of Object.entries(
                statsData as Record<string, { solve_count: number; correct_count: number }>
            )) {
                statsByQuestion.set(qid, {
                    solve_count: Number(stats.solve_count) || 0,
                    correct_count: Number(stats.correct_count) || 0,
                })
            }
        }
    }

    const quests = rows.map((row) => {
        const stats = statsByQuestion.get(`uq:${row.id}`)
        return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            kind: row.kind === 'coding' ? 'coding' : 'mcq',
            difficulty: row.difficulty,
            created_at: row.created_at,
            username: usernameById.get(row.author_id) ?? 'unknown',
            solve_count: stats?.solve_count ?? 0,
            correct_count: stats?.correct_count ?? 0,
        }
    })

    const createdMs = (iso: string) => {
        const t = Date.parse(iso)
        return Number.isFinite(t) ? t : 0
    }

    quests.sort((a, b) => {
        switch (sort) {
            case 'most_solved':
                return b.correct_count - a.correct_count || createdMs(b.created_at) - createdMs(a.created_at)
            case 'least_solved':
                return a.correct_count - b.correct_count || createdMs(b.created_at) - createdMs(a.created_at)
            case 'most_attempts':
                return b.solve_count - a.solve_count || createdMs(b.created_at) - createdMs(a.created_at)
            case 'least_attempts':
                return a.solve_count - b.solve_count || createdMs(b.created_at) - createdMs(a.created_at)
            case 'oldest':
                return createdMs(a.created_at) - createdMs(b.created_at)
            case 'newest':
            default:
                return createdMs(b.created_at) - createdMs(a.created_at)
        }
    })

    return jsonResponse({ status: 'ok', quests: quests.slice(0, limit) }, 200, env, request, PUBLIC_CACHE)
}

export async function handleGetCommunityQuest(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const username = url.searchParams.get('username')?.trim()
    const slug = url.searchParams.get('slug')?.trim().toLowerCase()
    if (!username || username.length > 40) {
        return errorResponse('username required', 400, env, request)
    }
    if (!slug || slug.length > 60) {
        return errorResponse('slug required', 400, env, request)
    }

    const profile = await loadPublicProfile(env, username)
    if (!profile) return errorResponse('Quest not found', 404, env, request)

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase
        .from('user_quests')
        .select(
            'id, author_id, slug, title, prompt, kind, code, test_harness, options, hint, difficulty, created_at'
        )
        .eq('author_id', profile.id)
        .eq('slug', slug)
        .maybeSingle()

    if (error) {
        console.error('get_community_quest failed:', error)
        return errorResponse('Failed to load quest', 500, env, request)
    }
    if (!data) return errorResponse('Quest not found', 404, env, request)

    return jsonResponse(
        {
            status: 'ok',
            quest: {
                ...data,
                kind: data.kind === 'coding' ? 'coding' : 'mcq',
                author_avatar: profile.avatar ?? null,
            },
        },
        200,
        env,
        request,
        PUBLIC_CACHE
    )
}

export async function handleGetQuestStats(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const questionId = url.searchParams.get('question_id')?.trim()
    if (!questionId || questionId.length > 80) {
        return errorResponse('question_id required', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    let stats = { solve_count: 0, correct_count: 0 }

    const { data, error } = await supabase.rpc('get_quest_stats', { p_question_id: questionId })
    if (!error && data && (Number(data.solve_count) > 0 || Number(data.correct_count) > 0)) {
        stats = {
            solve_count: Number(data.solve_count) || 0,
            correct_count: Number(data.correct_count) || 0,
        }
    } else {
        const { data: row } = await supabase
            .from('quest_answer_stats')
            .select('solve_count, correct_count')
            .eq('question_id', questionId)
            .maybeSingle()

        if (row && (Number(row.solve_count) > 0 || Number(row.correct_count) > 0)) {
            stats = {
                solve_count: Number(row.solve_count) || 0,
                correct_count: Number(row.correct_count) || 0,
            }
        } else {
            const { count: totalCount } = await supabase
                .from('quest_answers')
                .select('*', { count: 'exact', head: true })
                .eq('question_id', questionId)

            if (totalCount && totalCount > 0) {
                const { count: correctCount } = await supabase
                    .from('quest_answers')
                    .select('*', { count: 'exact', head: true })
                    .eq('question_id', questionId)
                    .eq('is_correct', true)

                stats = {
                    solve_count: totalCount,
                    correct_count: correctCount || 0,
                }
            }
        }
    }

    return jsonResponse(
        {
            status: 'ok',
            stats,
        },
        200,
        env,
        request,
        PUBLIC_CACHE
    )
}

export async function handleGetQuestStatsBatch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const raw = url.searchParams.get('ids')?.trim() ?? ''
    if (!raw) {
        return errorResponse('ids required', 400, env, request)
    }

    const ids = [...new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))]
    if (ids.length === 0 || ids.length > 300) {
        return errorResponse('ids must include 1–300 question ids', 400, env, request)
    }
    if (ids.some((id) => id.length > 80)) {
        return errorResponse('invalid question id', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    const stats: Record<string, { solve_count: number; correct_count: number }> = {}

    const { data, error } = await supabase.rpc('get_quest_stats_batch', {
        p_question_ids: ids,
    })

    if (!error && data && typeof data === 'object') {
        for (const [qid, row] of Object.entries(
            data as Record<string, { solve_count: number; correct_count: number }>
        )) {
            stats[qid] = {
                solve_count: Number(row.solve_count) || 0,
                correct_count: Number(row.correct_count) || 0,
            }
        }
    } else {
        const { data: rows } = await supabase
            .from('quest_answer_stats')
            .select('question_id, solve_count, correct_count')
            .in('question_id', ids)

        if (rows && Array.isArray(rows)) {
            for (const r of rows) {
                stats[r.question_id] = {
                    solve_count: Number(r.solve_count) || 0,
                    correct_count: Number(r.correct_count) || 0,
                }
            }
        }
    }

    const missingIds = ids.filter((id) => !stats[id])
    if (missingIds.length > 0) {
        const { data: answers } = await supabase
            .from('quest_answers')
            .select('question_id, is_correct')
            .in('question_id', missingIds)

        if (answers && answers.length > 0) {
            for (const a of answers) {
                if (!stats[a.question_id]) {
                    stats[a.question_id] = { solve_count: 0, correct_count: 0 }
                }
                stats[a.question_id].solve_count += 1
                if (a.is_correct) {
                    stats[a.question_id].correct_count += 1
                }
            }
        }
    }

    return jsonResponse({ status: 'ok', stats }, 200, env, request, PUBLIC_CACHE)
}
