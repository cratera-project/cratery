import { corsHeaders } from './cors'
import { consumeRateLimit, getClientIP } from './rateLimit'
import { getSessionUser } from './session'
import { createSupabaseClient, type Env } from './supabase'
import { isKnownContestId, officialHarnessHash } from '../../src/data/contestIds'
import { loadTotalXp } from './xp'
import { rankForXp } from '../../src/lib/ranks'
import { trackCodeExecution } from './executionStats'

const MAX_CODE = 64 * 1024
const MAX_HARNESS = 256 * 1024


const GUEST_RUN = { ip: 100, burst: 15, window: 3600 } as const
const RUN = { user: 180, ip: 240, burst: 20, window: 3600 } as const
const SUBMIT = { user: 120, ip: 160, burst: 15, window: 3600 } as const

export type GradeKind = 'run' | 'submit'


const SERVER_EXEC_CACHE_MAX = 500
const serverExecCache = new Map<string, Record<string, unknown>>()

function putServerExecCache(key: string, value: Record<string, unknown>) {
    if (serverExecCache.size >= SERVER_EXEC_CACHE_MAX) {
        const firstKey = serverExecCache.keys().next().value
        if (firstKey) serverExecCache.delete(firstKey)
    }
    serverExecCache.set(key, value)
}

export async function handleGradeRun(
    request: Request,
    env: Env,
    ctx?: ExecutionContext
): Promise<Response> {
    return handleGrade(request, env, 'run', ctx)
}

export async function handleGradeSubmit(
    request: Request,
    env: Env,
    ctx?: ExecutionContext
): Promise<Response> {
    return handleGrade(request, env, 'submit', ctx)
}

async function sha256Hex(text: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function isAccepted(data: unknown): data is Record<string, unknown> {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false
    const body = data as Record<string, unknown>
    return body.passed === true || body.verdict === 'AC'
}

function judgeMetrics(data: Record<string, unknown>): { runMs: number; memoryKb: number } | null {
    const runMs = data.executionTime
    const memoryKb = data.memoryKb
    if (typeof runMs !== 'number' || !Number.isFinite(runMs) || runMs < 0 || runMs > 60_000_000) {
        return null
    }
    if (
        typeof memoryKb !== 'number' ||
        !Number.isFinite(memoryKb) ||
        memoryKb < 32 ||
        memoryKb > 2_097_152
    ) {
        return null
    }
    return { runMs: Math.round(runMs), memoryKb: Math.round(memoryKb) }
}

async function recordContestScore(
    env: Env,
    userId: string,
    contestId: string,
    harness: string,
    data: unknown
): Promise<boolean> {
    if (!isKnownContestId(contestId) || !isAccepted(data)) return false
    const expected = officialHarnessHash(contestId)
    if (!expected) return false
    if ((await sha256Hex(harness)) !== expected) return false
    const metrics = judgeMetrics(data)
    if (!metrics) return false

    const supabase = createSupabaseClient(env)
    const { data: updated, error } = await supabase.rpc('upsert_contest_score', {
        p_user_id: userId,
        p_contest_id: contestId,
        p_run_ms: metrics.runMs,
        p_memory_kb: metrics.memoryKb,
    })
    if (error) {
        console.error('upsert_contest_score failed:', error)
        return false
    }
    return updated === true
}

async function handleGrade(
    request: Request,
    env: Env,
    kind: GradeKind,
    ctx?: ExecutionContext
): Promise<Response> {
    const headers = corsHeaders(env, request)
    const json = (data: unknown, status: number) =>
        new Response(JSON.stringify(data), { status, headers })

    const user = await getSessionUser(request, env)

    let body: { code?: unknown; harness?: unknown; contestId?: unknown; language?: unknown }
    try {
        body = (await request.json()) as typeof body
    } catch {
        return json({ error: 'Invalid JSON' }, 400)
    }

    const VALID_LANGUAGES = new Set([
        'rust', 'python', 'cpp', 'c', 'go', 'javascript', 'typescript', 'java', 'csharp',
    ])

    const code = typeof body.code === 'string' ? body.code : ''
    const harness = typeof body.harness === 'string' ? body.harness : ''
    const language =
        typeof body.language === 'string' && VALID_LANGUAGES.has(body.language)
            ? body.language
            : 'rust'
    if (!code.trim() || !harness.trim()) {
        return json({ error: 'code and harness are required' }, 400)
    }
    if (code.length > MAX_CODE) {
        return json({ error: 'Code too large (max 64KB)' }, 400)
    }
    if (harness.length > MAX_HARNESS) {
        return json({ error: 'Harness too large (max 256KB)' }, 400)
    }
    if ((harness.match(/\{\{SOLUTION\}\}/g) ?? []).length !== 1) {
        return json({ error: 'Harness must contain {{SOLUTION}} exactly once' }, 400)
    }

    
    
    
    
    
    const cacheKey = kind === 'run' ? await sha256Hex(`exec:v2:${language}:${harness}:${code}`) : null

    if (cacheKey) {
        
        const memCached = serverExecCache.get(cacheKey)
        if (memCached) {
            trackCodeExecution(env, ctx)
            return json(memCached, 200)
        }

        
        try {
            const edgeCache = (caches as unknown as { default?: Cache })?.default
            if (edgeCache) {
                const cacheUrl = new URL(`https://cache.cratery.internal/run/${cacheKey}`)
                const cachedRes = await edgeCache.match(cacheUrl)
                if (cachedRes) {
                    const cachedData = (await cachedRes.json()) as Record<string, unknown>
                    putServerExecCache(cacheKey, cachedData)
                    trackCodeExecution(env, ctx)
                    return json(cachedData, 200)
                }
            }
        } catch {
            /* ignore edge cache match errors */
        }
    }

    const contestIdRaw = typeof body.contestId === 'string' ? body.contestId.trim() : ''
    if (contestIdRaw && !isKnownContestId(contestIdRaw)) {
        return json({ error: 'Invalid contest problem ID' }, 400)
    }
    const contestId = kind === 'submit' && isKnownContestId(contestIdRaw) ? contestIdRaw : ''

    
    if (kind === 'submit' && contestId) {
        const expectedHash = officialHarnessHash(contestId)
        if (expectedHash && (await sha256Hex(harness)) !== expectedHash) {
            return json({ error: 'Submission rejected: test harness has been tampered with' }, 400)
        }
    }

    const gradeUrl = env.GRADE_URL?.replace(/\/$/, '')
    const key = env.GRADE_INTERNAL_KEY
    if (!gradeUrl || !key) {
        return json({ unavailable: true }, 503)
    }

    const ip = getClientIP(request)

    if (!user) {
        
        const [ipHourlyOk, ipBurstOk] = await Promise.all([
            consumeRateLimit(env, `grade:${kind}:guest:ip:${ip}`, GUEST_RUN.ip, GUEST_RUN.window),
            consumeRateLimit(env, `grade:burst:${kind}:guest:ip:${ip}`, GUEST_RUN.burst, 60, { failOpen: false }),
        ])

        if (!ipBurstOk) {
            return json(
                {
                    error: `Too many rapid requests. Please wait a few seconds before executing again.`,
                    retryAfter: 5,
                },
                429
            )
        }

        if (!ipHourlyOk) {
            return json(
                {
                    error: `Guest limit reached (${GUEST_RUN.ip} executions/hr). Sign up for free (5s) to get 250 executions/day, save progress, and earn XP!`,
                    tier: 'guest',
                    limit: GUEST_RUN.ip,
                    requiresSignup: true,
                },
                429
            )
        }
    } else {
        const today = new Date().toISOString().split('T')[0]
        const userDailyOk = await consumeRateLimit(env, `grade:daily:user:${user.sub}:${today}`, 250, 86400)
        if (!userDailyOk) {
            return json(
                {
                    error: 'Daily execution limit reached (250 executions/day). Resets at 00:00 UTC.',
                    limit: 250,
                    rateLimited: true,
                },
                429
            )
        }

        const cap = kind === 'run' ? RUN : SUBMIT

        const [userBurstOk, ipBurstOk] = await Promise.all([
            consumeRateLimit(env, `grade:burst:${kind}:user:${user.sub}`, cap.burst, 60, { failOpen: false }),
            consumeRateLimit(env, `grade:burst:${kind}:ip:${ip}`, cap.burst * 2, 60, { failOpen: false }),
        ])
        if (!userBurstOk || !ipBurstOk) {
            return json(
                {
                    error: `Too many rapid requests. Please wait a few seconds before executing again.`,
                    retryAfter: 5,
                },
                429
            )
        }
    }

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
    }
    if (env.CF_ACCESS_CLIENT_ID && env.CF_ACCESS_CLIENT_SECRET) {
        requestHeaders['CF-Access-Client-Id'] = env.CF_ACCESS_CLIENT_ID
        requestHeaders['CF-Access-Client-Secret'] = env.CF_ACCESS_CLIENT_SECRET
    }

    const callJudge = async () => {
        const res = await fetch(`${gradeUrl}/harness`, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({ code, harness, mode: kind, language }),
            signal: AbortSignal.timeout(30_000),
        })
        const data = await res.json().catch(() => ({}))
        return { res, data }
    }

    try {
        let { res, data } = await callJudge()
        if (res.status === 503 || (data && typeof data === 'object' && 'unavailable' in data)) {
            await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))
            const retry = await callJudge()
            res = retry.res
            data = retry.data
        }
        if (res.status === 503 || (data && typeof data === 'object' && 'unavailable' in data)) {
            return json({ unavailable: true }, 503)
        }
        if (!res.ok) {
            const err =
                data && typeof data === 'object' && 'error' in data
                    ? String((data as { error: unknown }).error)
                    : 'Judge rejected the run'
            return json({ error: err }, res.status === 400 ? 400 : 502)
        }

        trackCodeExecution(env, ctx)

        if (kind === 'submit' && data && typeof data === 'object' && !Array.isArray(data)) {
            const passed = isAccepted(data)
            let scoreUpdated = false
            let xpEarned = 0
            let totalXp = 0
            let rank = ''

            if (passed && contestId && user) {
                const supabase = createSupabaseClient(env)
                scoreUpdated = await recordContestScore(env, user.sub, contestId, harness, data)

                let catSlug = 'interactive'
                if (contestId.startsWith('own-')) catSlug = 'ownership'
                else if (contestId.startsWith('borrow-')) catSlug = 'borrow-checker'
                else if (contestId.startsWith('life-')) catSlug = 'lifetimes'
                else if (contestId.startsWith('trait-')) catSlug = 'traits'
                else if (contestId.startsWith('err-')) catSlug = 'error-handling'
                else if (contestId.startsWith('iter-')) catSlug = 'iterators-closures'
                else if (contestId.startsWith('point-')) catSlug = 'pointers'
                else if (contestId.startsWith('conc-')) catSlug = 'concurrency'
                else if (contestId.startsWith('macro-')) catSlug = 'macros'

                
                const { data: existingAnswer } = await supabase
                    .from('quest_answers')
                    .select('id, is_correct')
                    .eq('user_id', user.sub)
                    .eq('question_id', contestId)
                    .maybeSingle()

                if (!existingAnswer || !existingAnswer.is_correct) {
                    xpEarned = 55

                    await supabase.from('quest_answers').upsert(
                        {
                            user_id: user.sub,
                            question_id: contestId,
                            category_slug: catSlug,
                            selected_index: 0,
                            is_correct: true,
                            xp_earned: xpEarned,
                            answered_at: new Date().toISOString(),
                        },
                        { onConflict: 'user_id,question_id' }
                    )
                }

                try {
                    const { data: row } = await supabase
                        .from('quest_answer_stats')
                        .select('solve_count, correct_count')
                        .eq('question_id', contestId)
                        .maybeSingle()

                    if (row) {
                        await supabase
                            .from('quest_answer_stats')
                            .update({
                                solve_count: Number(row.solve_count) + 1,
                                correct_count: Number(row.correct_count) + 1,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('question_id', contestId)
                    } else {
                        await supabase.from('quest_answer_stats').insert({
                            question_id: contestId,
                            solve_count: 1,
                            correct_count: 1,
                        })
                    }
                } catch {
                    /* non-fatal stats recording */
                }

                totalXp = await loadTotalXp(supabase, user.sub)
                rank = rankForXp(totalXp).name
            }

            return json(
                {
                    ...(data as object),
                    scoreUpdated,
                    xpEarned,
                    totalXp: totalXp > 0 ? totalXp : undefined,
                    rank: rank || undefined,
                    passed,
                },
                200
            )
        }

        
        const isSuccessfulRun =
            data &&
            typeof data === 'object' &&
            !('unavailable' in data) &&
            !('error' in data) &&
            !(data as Record<string, unknown>).compilationError &&
            !(data as Record<string, unknown>).compileStderr

        if (cacheKey && isSuccessfulRun) {
            putServerExecCache(cacheKey, data as Record<string, unknown>)
            try {
                const edgeCache = (caches as unknown as { default?: Cache })?.default
                if (edgeCache) {
                    const cacheUrl = new URL(`https://cache.cratery.internal/run/${cacheKey}`)
                    const cacheResponse = new Response(JSON.stringify(data), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'public, max-age=604800',
                        },
                    })
                    if (ctx) {
                        ctx.waitUntil(edgeCache.put(cacheUrl, cacheResponse))
                    } else {
                        void edgeCache.put(cacheUrl, cacheResponse)
                    }
                }
            } catch {
                /* non-fatal edge cache put error */
            }
        }

        return json(data, 200)
    } catch {
        return json({ unavailable: true }, 503)
    }
}

export async function handleGetContestLeaderboard(request: Request, env: Env): Promise<Response> {
    const headers = {
        ...corsHeaders(env, request),
        'Cache-Control': 'no-store',
    }
    const json = (data: unknown, status: number) =>
        new Response(JSON.stringify(data), { status, headers })

    const url = new URL(request.url)
    const contestId = url.searchParams.get('contest_id')?.trim() ?? ''
    if (!isKnownContestId(contestId)) {
        return json({ error: 'Unknown contest' }, 400)
    }
    const limit = Math.min(
        100,
        Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10) || 50)
    )

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase.rpc('get_contest_leaderboard', {
        p_contest_id: contestId,
        p_limit: limit,
    })
    if (error) {
        console.error('get_contest_leaderboard failed:', error)
        return json({ error: 'Failed to load standings' }, 500)
    }
    return json({ status: 'ok', entries: data ?? [] }, 200)
}
