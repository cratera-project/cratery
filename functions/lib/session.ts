import { createSupabaseClient, type Env } from './supabase'
import { getUserFromHeader, type JWTPayload } from './jwt'

export interface SessionUser extends JWTPayload {
    id: string
    email_verified?: boolean
    newsletter_opt_in?: boolean
}

export async function getSessionUser(
    request: Request,
    env: Env
): Promise<SessionUser | null> {
    const payload = await getUserFromHeader(request.headers.get('Authorization'), env.JWT_SECRET)
    if (!payload) return null

    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase
        .from('custom_users')
        .select('id, tokens_valid_after, email_verified')
        .eq('id', payload.sub)
        .maybeSingle()

    if (error || !data?.id) return null
    if (data.email_verified === false) return null

    const cut = data.tokens_valid_after
    if (cut && cut !== 'epoch' && !String(cut).startsWith('1970-01-01')) {
        const cutSec = Math.floor(new Date(cut as string).getTime() / 1000)
        if (!Number.isFinite(cutSec) || payload.iat < cutSec) return null
    }
    return {
        ...payload,
        id: payload.sub,
        email_verified: Boolean(data.email_verified),
    }
}
