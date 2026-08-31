import { corsHeaders } from './cors'
import { getSessionUser } from './session'
import { createSupabaseClient, type Env } from './supabase'
import { consumeRateLimit, getClientIP } from './rateLimit'
import { trackCodeExecution } from './executionStats'
import { getDeveloperLimits } from './limits'

async function sha256Hex(text: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function getNextMidnightUtc(): string {
    const now = new Date()
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0))
    return tomorrow.toISOString()
}

function getTodayUtcString(): string {
    return new Date().toISOString().split('T')[0]
}

interface ResolvedDevAuth {
    userId: string
    isApiKey: boolean
    keyId?: string
}

async function authenticateDevRequest(request: Request, env: Env): Promise<ResolvedDevAuth | null> {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return null
    const token = authHeader.slice(7).trim()
    if (!token) return null

    
    if (token.startsWith('cr_live_')) {
        const hash = await sha256Hex(token)
        const supabase = createSupabaseClient(env)

        const { data: keyData, error: keyError } = await supabase
            .from('custom_api_keys')
            .select('id, user_id')
            .eq('key_hash', hash)
            .maybeSingle()

        if (keyError || !keyData?.user_id) return null

        const { data: userData, error: userError } = await supabase
            .from('custom_users')
            .select('id, email_verified')
            .eq('id', keyData.user_id)
            .maybeSingle()

        if (userError || !userData) return null
        if (userData.email_verified === false) return null

        
        supabase
            .from('custom_api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', keyData.id)
            .then(() => {})

        return {
            userId: keyData.user_id,
            isApiKey: true,
            keyId: keyData.id,
        }
    }

    
    const sessionUser = await getSessionUser(request, env)
    if (!sessionUser) return null

    return {
        userId: sessionUser.sub,
        isApiKey: false,
    }
}

export async function handleDeveloperExecute(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(env, request)
    const json = (data: unknown, status: number) =>
        new Response(JSON.stringify(data), {
            status,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
        })

    const auth = await authenticateDevRequest(request, env)
    if (!auth) {
        return json(
            {
                error: 'Unauthorized. Provide a valid API key (Authorization: Bearer cr_live_...) or session token.',
            },
            401
        )
    }

    
    const devLimits = getDeveloperLimits(env)
    const ip = getClientIP(request)
    const burstLimit = devLimits.burstPerMin
    const ipBurstLimit = devLimits.ipBurstPerMin
    const [underBurst, underIpBurst] = await Promise.all([
        consumeRateLimit(env, `dev:burst:${auth.userId}`, burstLimit, 60, { failOpen: false }),
        consumeRateLimit(env, `dev:burst:ip:${ip}`, ipBurstLimit, 60, { failOpen: false }),
    ])
    if (!underBurst || !underIpBurst) {
        return json(
            {
                error: `Rate limit exceeded (${burstLimit} req/min). Please slow down requests.`,
                burst: {
                    limit: burstLimit,
                    windowSeconds: 60,
                },
            },
            429
        )
    }

    
    const today = getTodayUtcString()
    const underIpDaily = await consumeRateLimit(
        env,
        `dev:daily:ip:${ip}:${today}`,
        devLimits.ipDailyLimit,
        86400,
        { failOpen: false }
    )
    if (!underIpDaily) {
        return json(
            {
                error: `Device/IP daily limit reached (${devLimits.ipDailyLimit} req/day across accounts). Resets at 00:00 UTC.`,
                quota: {
                    limit: devLimits.ipDailyLimit,
                    remaining: 0,
                    resetsAt: getNextMidnightUtc(),
                },
            },
            429
        )
    }

    
    const limit = devLimits.dailyQuota
    const supabase = createSupabaseClient(env)

    let usedToday = 0
    let currentRunMs = 0
    try {
        const { data: usage } = await supabase
            .from('custom_api_usage')
            .select('request_count, total_run_ms')
            .eq('user_id', auth.userId)
            .eq('usage_date', today)
            .maybeSingle()
        if (usage) {
            usedToday = Number(usage.request_count) || 0
            currentRunMs = Number(usage.total_run_ms) || 0
        }
    } catch {
        // fail-open on transient query errors for initial check
    }

    if (usedToday >= limit) {
        return json(
            {
                error: `Daily execution limit reached (${limit}/${limit}). Resets at 00:00 UTC.`,
                quota: {
                    limit,
                    used: usedToday,
                    remaining: 0,
                    resetsAt: getNextMidnightUtc(),
                },
            },
            429
        )
    }

    let body: { code?: unknown; harness?: unknown; language?: unknown; mode?: unknown }
    try {
        body = await request.json()
    } catch {
        return json({ error: 'Invalid JSON payload' }, 400)
    }

    const code = typeof body.code === 'string' ? body.code : ''
    const harness = typeof body.harness === 'string' && body.harness.trim() ? body.harness : '{{SOLUTION}}\n'
    const language = typeof body.language === 'string' && body.language.trim() ? body.language.toLowerCase().trim() : 'rust'
    const mode = body.mode === 'run' ? 'run' : 'submit'

    if (!code.trim()) {
        return json({ error: 'Code cannot be empty' }, 400)
    }
    if (new TextEncoder().encode(code).length > devLimits.maxCodeBytes) {
        return json({ error: `Code exceeds maximum size of ${Math.round(devLimits.maxCodeBytes / 1024)} KB` }, 400)
    }
    if (new TextEncoder().encode(harness).length > devLimits.maxHarnessBytes) {
        return json({ error: `Harness exceeds maximum size of ${Math.round(devLimits.maxHarnessBytes / 1024)} KB` }, 400)
    }
    if (harness.trim() && !harness.includes('{{SOLUTION}}')) {
        return json({ error: 'Harness must contain {{SOLUTION}} template marker' }, 400)
    }

    const gradeUrl = env.GRADE_URL?.replace(/\/$/, '')
    const key = env.GRADE_INTERNAL_KEY
    if (!gradeUrl || !key) {
        return json({ unavailable: true, error: 'Judge backend service not configured' }, 503)
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
            body: JSON.stringify({ code, harness, mode, language }),
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
            return json({ unavailable: true, error: 'Judge is currently busy' }, 503)
        }
        if (!res.ok) {
            const err =
                data && typeof data === 'object' && 'error' in data
                    ? String((data as { error: unknown }).error)
                    : 'Judge execution rejected'
            return json({ error: err }, res.status === 400 ? 400 : 502)
        }

        trackCodeExecution(env)

        
        const runMs = Number((data as Record<string, unknown>)?.wallMs) || 0
        let newUsed = usedToday + 1

        let rpcSucceeded = false
        try {
            const { data: rpcRes, error: rpcErr } = await supabase.rpc('consume_developer_quota', {
                p_user_id: auth.userId,
                p_daily_limit: limit,
                p_run_ms: runMs,
            })
            if (!rpcErr && rpcRes && typeof rpcRes === 'object' && 'used' in rpcRes) {
                newUsed = Number((rpcRes as { used: number }).used) || newUsed
                rpcSucceeded = true
            }
        } catch {
            // fall through to direct upsert
        }

        if (!rpcSucceeded) {
            try {
                const { data: freshUsage } = await supabase
                    .from('custom_api_usage')
                    .select('request_count, total_run_ms')
                    .eq('user_id', auth.userId)
                    .eq('usage_date', today)
                    .maybeSingle()

                const latestCount = freshUsage ? Number(freshUsage.request_count) || 0 : usedToday
                const latestRunMs = freshUsage ? Number(freshUsage.total_run_ms) || 0 : currentRunMs
                newUsed = latestCount + 1

                await supabase
                    .from('custom_api_usage')
                    .upsert(
                        {
                            user_id: auth.userId,
                            usage_date: today,
                            request_count: newUsed,
                            total_run_ms: latestRunMs + runMs,
                            updated_at: new Date().toISOString(),
                        },
                        { onConflict: 'user_id,usage_date' }
                    )
            } catch (err) {
                console.error('Failed to persist custom_api_usage:', err)
            }
        }

        return json(
            {
                ...(data as object),
                quota: {
                    limit,
                    used: newUsed,
                    remaining: Math.max(0, limit - newUsed),
                    resetsAt: getNextMidnightUtc(),
                },
            },
            200
        )
    } catch {
        return json({ unavailable: true, error: 'Execution request timed out' }, 503)
    }
}

export async function handleGetDeveloperStatus(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(env, request)
    const json = (data: unknown, status: number) =>
        new Response(JSON.stringify(data), {
            status,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
        })

    const auth = await authenticateDevRequest(request, env)
    if (!auth) {
        return json({ error: 'Authentication required' }, 401)
    }

    const devLimits = getDeveloperLimits(env)
    const limit = devLimits.dailyQuota
    const today = getTodayUtcString()
    const supabase = createSupabaseClient(env)

    const [keyRes, usageRes] = await Promise.all([
        supabase
            .from('custom_api_keys')
            .select('id, key_prefix, name, created_at, last_used_at')
            .eq('user_id', auth.userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase
            .from('custom_api_usage')
            .select('request_count, total_run_ms')
            .eq('user_id', auth.userId)
            .eq('usage_date', today)
            .maybeSingle(),
    ])

    const usedToday = Number(usageRes.data?.request_count) || 0
    const totalRunMs = Number(usageRes.data?.total_run_ms) || 0

    return json(
        {
            hasKey: Boolean(keyRes.data),
            apiKey: keyRes.data
                ? {
                      id: keyRes.data.id,
                      prefix: keyRes.data.key_prefix,
                      name: keyRes.data.name,
                      createdAt: keyRes.data.created_at,
                      lastUsedAt: keyRes.data.last_used_at,
                  }
                : null,
            quota: {
                limit,
                used: usedToday,
                remaining: Math.max(0, limit - usedToday),
                resetsAt: getNextMidnightUtc(),
                rateLimitPerMin: devLimits.burstPerMin,
                totalRunMs,
            },
        },
        200
    )
}

export async function handleCreateDeveloperKey(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(env, request)
    const json = (data: unknown, status: number) =>
        new Response(JSON.stringify(data), {
            status,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
        })

    const user = await getSessionUser(request, env)
    if (!user) {
        return json({ error: 'Authentication required' }, 401)
    }

    if (user.email_verified === false) {
        return json(
            { error: 'Email verification required before generating an API key. Please check your inbox for the verification link.' },
            403
        )
    }

    const ip = getClientIP(request)
    const [userOk, ipShortOk, ipDailyOk] = await Promise.all([
        consumeRateLimit(env, `keygen:user:${user.sub}`, 3, 3600),
        consumeRateLimit(env, `keygen:ip:short:${ip}`, 5, 3600),
        consumeRateLimit(env, `keygen:ip:daily:${ip}`, 10, 86400),
    ])
    if (!userOk || !ipShortOk || !ipDailyOk) {
        return json(
            { error: 'Rate limit exceeded for API key creation. Maximum 5 keys per IP per day.' },
            429
        )
    }

    const randomBytes = new Uint8Array(24)
    crypto.getRandomValues(randomBytes)
    const hex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('')
    const rawKey = `cr_live_${hex}`
    const keyPrefix = `cr_live_${hex.slice(0, 8)}...`
    const keyHash = await sha256Hex(rawKey)

    const supabase = createSupabaseClient(env)

    
    await supabase.from('custom_api_keys').delete().eq('user_id', user.sub)

    const { data, error } = await supabase
        .from('custom_api_keys')
        .insert({
            user_id: user.sub,
            key_hash: keyHash,
            key_prefix: keyPrefix,
            name: 'Default API Key',
        })
        .select('id, created_at')
        .single()

    if (error || !data) {
        return json({ error: 'Failed to generate API key' }, 500)
    }

    return json(
        {
            key: rawKey,
            prefix: keyPrefix,
            createdAt: data.created_at,
            message: 'Copy your API key now. You will not be able to see it again.',
        },
        201
    )
}

export async function handleRevokeDeveloperKey(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(env, request)
    const json = (data: unknown, status: number) =>
        new Response(JSON.stringify(data), {
            status,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
        })

    const user = await getSessionUser(request, env)
    if (!user) {
        return json({ error: 'Authentication required' }, 401)
    }

    const supabase = createSupabaseClient(env)
    await supabase.from('custom_api_keys').delete().eq('user_id', user.sub)

    return json({ ok: true, message: 'API key revoked successfully' }, 200)
}
