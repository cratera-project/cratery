import { createSupabaseClient, type Env } from './supabase'


export async function consumeRateLimit(
    env: Env,
    key: string,
    maxRequests: number,
    windowSeconds: number,
    options?: { failOpen?: boolean }
): Promise<boolean> {
    
    if (
        env.DISABLE_RATE_LIMITS === '1' ||
        env.DISABLE_RATE_LIMITS === 'true' ||
        env.LOCAL_DEV === '1' ||
        env.LOCAL_DEV === 'true'
    ) {
        return true
    }

    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
    const bucketKey = Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, '0')
    ).join('')
    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase.rpc('consume_rate_limit', {
        p_key: bucketKey,
        p_max: maxRequests,
        p_window_seconds: windowSeconds,
    })
    if (error) {
        console.error('consume_rate_limit failed:', error)
        
        return options?.failOpen === true
    }
    return data === true
}

export function getClientIP(request: Request): string {
    return (
        request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
        'unknown'
    )
}
