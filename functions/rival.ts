import { BUILTIN_ANSWERS } from './lib/builtinCorrect'
import { corsHeaders } from './lib/cors'
import { consumeRateLimit } from './lib/rateLimit'
import { getSessionUser } from './lib/session'
import { createSupabaseClient, type Env } from './lib/supabase'
import { insertNotification } from './lib/xp'

type RivalItem = {
    question_id: string
    href: string
    title?: string
}

type RivalRow = {
    id: string
    challenger_id: string
    opponent_id: string | null
    set_payload: { items?: RivalItem[] }
    status: string
    challenger_correct: number
    opponent_correct: number
    challenger_done_at: string | null
    opponent_done_at: string | null
    winner_id: string | null
    expires_at: string
    created_at: string
    accepted_at: string | null
}

const RIVAL_HOURS = 24
const MAX_ITEMS = 5

function jsonResponse(data: unknown, status: number, env: Env, request: Request): Response {
    return new Response(JSON.stringify(data), { status, headers: corsHeaders(env, request) })
}

function errorResponse(message: string, status: number, env: Env, request: Request): Response {
    return jsonResponse({ status: 'error', error: message }, status, env, request)
}

function shuffle<T>(items: T[]): T[] {
    const out = [...items]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[out[i], out[j]] = [out[j]!, out[i]!]
    }
    return out
}

function builtinHref(questionId: string): string | null {
    const meta = BUILTIN_ANSWERS[questionId]
    if (!meta) return null
    return `/category/${meta.categorySlug}/question/${questionId}`
}

async function resolveItems(
    supabase: ReturnType<typeof createSupabaseClient>,
    questionIds: string[]
): Promise<RivalItem[] | string> {
    const unique = [...new Set(questionIds.map((id) => id.trim()).filter(Boolean))]
    if (unique.length < 1 || unique.length > MAX_ITEMS) {
        return 'Pick 1–5 quests for a rival match'
    }

    const items: RivalItem[] = []
    const communityIds: string[] = []
    for (const id of unique) {
        if (id.startsWith('uq:')) {
            communityIds.push(id.slice(3))
            continue
        }
        const href = builtinHref(id)
        if (!href) return 'Unknown quest in rival set'
        items.push({ question_id: id, href })
    }

    if (communityIds.length) {
        const { data: rows, error: err2 } = await supabase
            .from('user_quests')
            .select('id, slug, title, author_id, kind')
            .in('id', communityIds)
        if (err2 || !rows || rows.length !== communityIds.length) return 'Could not load community quests'
        const authors = [...new Set(rows.map((r: { author_id: string }) => r.author_id))]
        const { data: profiles } = await supabase.from('profiles').select('id, username').in('id', authors)
        const names = new Map((profiles ?? []).map((p: { id: string; username: string }) => [p.id, p.username]))
        for (const row of rows) {
            if (row.kind === 'coding') return 'Coding quests cannot be used in a rival match yet'
            const username = names.get(row.author_id)
            if (!username) return 'Unknown quest in rival set'
            items.push({
                question_id: `uq:${row.id}`,
                href: `/${username}/${row.slug}`,
                title: row.title,
            })
        }
    }

    if (items.length < 1) return 'Pick 1–5 quests for a rival match'
    return items
}

function randomBuiltinSet(): RivalItem[] {
    const ids = shuffle(Object.keys(BUILTIN_ANSWERS)).slice(0, MAX_ITEMS)
    return ids.map((id) => ({ question_id: id, href: builtinHref(id)! }))
}

async function profileBrief(
    supabase: ReturnType<typeof createSupabaseClient>,
    id: string | null
): Promise<{ id: string; username: string; avatar: unknown } | null> {
    if (!id) return null
    const { data } = await supabase.from('profiles').select('id, username, avatar').eq('id', id).maybeSingle()
    if (!data) return null
    return data as { id: string; username: string; avatar: unknown }
}

function roleOf(row: RivalRow, userId: string | null): 'challenger' | 'opponent' | 'open' | 'spectator' {
    if (userId && userId === row.challenger_id) return 'challenger'
    if (userId && userId === row.opponent_id) return 'opponent'
    if (!row.opponent_id && row.status === 'pending') return 'open'
    return 'spectator'
}

async function maybeExpire(
    supabase: ReturnType<typeof createSupabaseClient>,
    row: RivalRow
): Promise<RivalRow> {
    if (row.status === 'complete' || row.status === 'declined' || row.status === 'expired') return row
    if (Date.parse(row.expires_at) > Date.now()) return row

    let winner: string | null = null
    if (row.status === 'active') {
        if (row.challenger_correct > row.opponent_correct) winner = row.challenger_id
        else if (row.opponent_correct > row.challenger_correct) winner = row.opponent_id
        else if (row.challenger_done_at && !row.opponent_done_at) winner = row.challenger_id
        else if (row.opponent_done_at && !row.challenger_done_at) winner = row.opponent_id
    }
    const status = winner ? 'complete' : 'expired'
    const { data } = await supabase
        .from('rivals')
        .update({ status, winner_id: winner })
        .eq('id', row.id)
        .select('*')
        .single()
    return (data as RivalRow) ?? { ...row, status, winner_id: winner }
}

async function maybeComplete(
    supabase: ReturnType<typeof createSupabaseClient>,
    row: RivalRow
): Promise<RivalRow> {
    if (row.status !== 'active' || !row.opponent_id) return row
    const items = row.set_payload?.items ?? []
    const n = items.length
    if (!n) return row
    if (!row.challenger_done_at || !row.opponent_done_at) return row

    const winner =
        row.challenger_correct > row.opponent_correct
            ? row.challenger_id
            : row.opponent_correct > row.challenger_correct
              ? row.opponent_id
              : row.challenger_done_at <= row.opponent_done_at
                ? row.challenger_id
                : row.opponent_id

    const { data } = await supabase
        .from('rivals')
        .update({ status: 'complete', winner_id: winner })
        .eq('id', row.id)
        .select('*')
        .single()
    const next = (data as RivalRow) ?? { ...row, status: 'complete', winner_id: winner }

    const [challenger, opponent] = await Promise.all([
        profileBrief(supabase, next.challenger_id),
        profileBrief(supabase, next.opponent_id),
    ])
    if (challenger && opponent) {
        await insertNotification(supabase, next.challenger_id, 'rival_result', {
            rival_id: next.id,
            won: next.winner_id === next.challenger_id,
            opponent: opponent.username,
        })
        await insertNotification(supabase, opponent.id, 'rival_result', {
            rival_id: next.id,
            won: next.winner_id === opponent.id,
            opponent: challenger.username,
        })
    }
    return next
}

async function serialize(
    supabase: ReturnType<typeof createSupabaseClient>,
    row: RivalRow,
    userId: string | null
) {
    const [challenger, opponent] = await Promise.all([
        profileBrief(supabase, row.challenger_id),
        profileBrief(supabase, row.opponent_id),
    ])
    let answered: string[] = []
    if (userId && (userId === row.challenger_id || userId === row.opponent_id)) {
        const { data } = await supabase
            .from('rival_answers')
            .select('question_id')
            .eq('rival_id', row.id)
            .eq('user_id', userId)
        answered = (data ?? []).map((r: { question_id: string }) => r.question_id)
    }
    const winnerName =
        row.winner_id === row.challenger_id
            ? challenger?.username ?? null
            : row.winner_id === row.opponent_id
              ? opponent?.username ?? null
              : null
    return {
        id: row.id,
        status: row.status,
        expires_at: row.expires_at,
        accepted_at: row.accepted_at,
        items: row.set_payload?.items ?? [],
        challenger,
        opponent,
        challenger_correct: row.challenger_correct,
        opponent_correct: row.opponent_correct,
        winner_username: winnerName,
        you: roleOf(row, userId),
        answered,
    }
}

export async function handleCreateRival(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)
    if (!(await consumeRateLimit(env, `rival-create:${authUser.sub}`, 20, 3600))) {
        return errorResponse('Too many rival invites. Try later.', 429, env, request)
    }

    let body: { question_ids?: string[]; opponent_username?: string }
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    let items: RivalItem[]
    if (Array.isArray(body.question_ids) && body.question_ids.length > 0) {
        const resolved = await resolveItems(supabase, body.question_ids)
        if (typeof resolved === 'string') return errorResponse(resolved, 400, env, request)
        items = resolved
    } else {
        items = randomBuiltinSet()
    }

    let opponentId: string | null = null
    const name = body.opponent_username?.trim()
    if (name) {
        const { data: opp } = await supabase
            .from('profiles')
            .select('id, username')
            .ilike('username', name)
            .maybeSingle()
        if (!opp) return errorResponse('No rustacean with that name', 404, env, request)
        if (opp.id === authUser.sub) return errorResponse('Challenge someone else', 400, env, request)
        opponentId = opp.id as string
    }

    const expires = new Date(Date.now() + RIVAL_HOURS * 3600 * 1000).toISOString()
    const { data, error } = await supabase
        .from('rivals')
        .insert({
            challenger_id: authUser.sub,
            opponent_id: opponentId,
            set_payload: { items },
            status: 'pending',
            expires_at: expires,
        })
        .select('*')
        .single()
    if (error || !data) {
        console.error('create rival failed:', error)
        return errorResponse('Failed to create rival', 500, env, request)
    }

    if (opponentId) {
        await insertNotification(supabase, opponentId, 'rival_invite', {
            rival_id: data.id,
            from: authUser.username,
        })
    }

    return jsonResponse({ status: 'ok', rival: await serialize(supabase, data as RivalRow, authUser.sub) }, 201, env, request)
}

export async function handleGetRival(request: Request, env: Env): Promise<Response> {
    const id = new URL(request.url).searchParams.get('id')?.trim()
    if (!id) return errorResponse('id required', 400, env, request)
    const authUser = await getSessionUser(request, env)
    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase.from('rivals').select('*').eq('id', id).maybeSingle()
    if (error || !data) return errorResponse('Not found', 404, env, request)
    const row = await maybeExpire(supabase, data as RivalRow)
    return jsonResponse({ status: 'ok', rival: await serialize(supabase, row, authUser?.sub ?? null) }, 200, env, request)
}

export async function handleAcceptRival(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    let body: { id?: string }
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }
    const id = body.id?.trim()
    if (!id) return errorResponse('id required', 400, env, request)

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase.from('rivals').select('*').eq('id', id).maybeSingle()
    if (error || !data) return errorResponse('Not found', 404, env, request)
    const row = await maybeExpire(supabase, data as RivalRow)
    if (row.status !== 'pending') return errorResponse('This rival is no longer open', 400, env, request)
    if (row.challenger_id === authUser.sub) return errorResponse('You sent this challenge', 400, env, request)
    if (row.opponent_id && row.opponent_id !== authUser.sub) {
        return errorResponse('This challenge is for someone else', 403, env, request)
    }

    const { data: updated, error: upd } = await supabase
        .from('rivals')
        .update({
            opponent_id: authUser.sub,
            status: 'active',
            accepted_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('status', 'pending')
        .select('*')
        .single()
    if (upd || !updated) return errorResponse('Could not accept', 409, env, request)

    await insertNotification(supabase, row.challenger_id, 'rival_invite', {
        rival_id: id,
        from: authUser.username,
        accepted: true,
    })

    return jsonResponse(
        { status: 'ok', rival: await serialize(supabase, updated as RivalRow, authUser.sub) },
        200,
        env,
        request
    )
}

export async function handleRivalAnswer(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)

    let body: { id?: string; question_id?: string }
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON', 400, env, request)
    }
    const id = body.id?.trim()
    const questionId = body.question_id?.trim()
    if (!id || !questionId) return errorResponse('id and question_id required', 400, env, request)

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase.from('rivals').select('*').eq('id', id).maybeSingle()
    if (error || !data) return errorResponse('Not found', 404, env, request)
    let row = await maybeExpire(supabase, data as RivalRow)
    if (row.status !== 'active') return errorResponse('Rival is not active', 400, env, request)

    const isChallenger = row.challenger_id === authUser.sub
    const isOpponent = row.opponent_id === authUser.sub
    if (!isChallenger && !isOpponent) return errorResponse('Not in this rival', 403, env, request)

    const items = row.set_payload?.items ?? []
    if (!items.some((it) => it.question_id === questionId)) {
        return errorResponse('Question is not in this rival', 400, env, request)
    }

    const { data: answer } = await supabase
        .from('quest_answers')
        .select('is_correct')
        .eq('user_id', authUser.sub)
        .eq('question_id', questionId)
        .maybeSingle()
    if (!answer) return errorResponse('Answer the quest first', 400, env, request)

    const { error: ins } = await supabase.from('rival_answers').insert({
        rival_id: id,
        user_id: authUser.sub,
        question_id: questionId,
        is_correct: Boolean(answer.is_correct),
    })
    if (ins && ins.code !== '23505') {
        console.error('rival_answers insert failed:', ins)
        return errorResponse('Failed to record rival answer', 500, env, request)
    }

    const { data: mine } = await supabase
        .from('rival_answers')
        .select('question_id, is_correct')
        .eq('rival_id', id)
        .eq('user_id', authUser.sub)
    const answered = mine ?? []
    const correct = answered.filter((a: { is_correct: boolean }) => a.is_correct).length
    const done = answered.length >= items.length
    const patch: Record<string, unknown> = isChallenger
        ? { challenger_correct: correct, ...(done ? { challenger_done_at: new Date().toISOString() } : {}) }
        : { opponent_correct: correct, ...(done ? { opponent_done_at: new Date().toISOString() } : {}) }

    const { data: updated } = await supabase.from('rivals').update(patch).eq('id', id).select('*').single()
    row = await maybeComplete(supabase, (updated as RivalRow) ?? { ...row, ...patch })

    return jsonResponse({ status: 'ok', rival: await serialize(supabase, row, authUser.sub) }, 200, env, request)
}

export async function handleListNotifications(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)
    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase
        .from('notifications')
        .select('id, kind, payload, created_at, read_at')
        .eq('user_id', authUser.sub)
        .order('created_at', { ascending: false })
        .limit(30)
    if (error) {
        console.error('list notifications failed:', error)
        return errorResponse('Failed to load notifications', 500, env, request)
    }
    const rows = data ?? []
    const unread = rows.filter((r: { read_at: string | null }) => !r.read_at).length
    return jsonResponse({ status: 'ok', notifications: rows, unread }, 200, env, request)
}

export async function handleReadNotifications(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser?.sub) return errorResponse('Unauthorized', 401, env, request)
    const supabase = createSupabaseClient(env)
    const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', authUser.sub)
        .is('read_at', null)
    if (error) {
        console.error('read notifications failed:', error)
        return errorResponse('Failed to mark read', 500, env, request)
    }
    return jsonResponse({ status: 'ok' }, 200, env, request)
}
