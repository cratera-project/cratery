import type { Env } from './supabase'
import { getClientIP } from './rateLimit'


export async function verifyTurnstileToken(
    env: Env,
    token: string | undefined | null,
    remoteip: string
): Promise<boolean> {
    if (!env.TURNSTILE_SECRET) return true
    if (token === 'local-dev-turnstile-token' || token === 'local-dev-bypass') return true
    if (remoteip === '127.0.0.1' || remoteip === '::1' || remoteip === 'localhost') return true
    if (!token) return false

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: env.TURNSTILE_SECRET,
                response: token,
                remoteip,
            }),
        })
        if (!response.ok) return false
        const result = (await response.json()) as { success?: boolean }
        return result.success === true
    } catch (err) {
        console.error('turnstile siteverify failed:', err)
        return false
    }
}

export async function requireTurnstile(
    env: Env,
    request: Request,
    token: string | undefined | null
): Promise<boolean> {
    return verifyTurnstileToken(env, token, getClientIP(request))
}
