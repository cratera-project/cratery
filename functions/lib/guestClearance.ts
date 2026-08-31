import type { Env } from './supabase'


export const GUEST_CLEARANCE_COOKIE = 'cratery_guest'

export const GUEST_CLEARANCE_TTL_SECONDS = 60 * 60

type GuestPayload = {
    typ: 'guest'
    iat: number
    exp: number
}

function base64UrlEncode(data: string | Uint8Array): string {
    const str =
        typeof data === 'string' ? btoa(data) : btoa(String.fromCharCode(...data))
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    while (str.length % 4) str += '='
    return atob(str)
}

async function sign(data: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
    return base64UrlEncode(new Uint8Array(signature))
}

export async function createGuestClearanceToken(secret: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const payload = base64UrlEncode(
        JSON.stringify({
            typ: 'guest',
            iat: now,
            exp: now + GUEST_CLEARANCE_TTL_SECONDS,
        } satisfies GuestPayload)
    )
    const body = `g1.${payload}`
    return `${body}.${await sign(body, secret)}`
}

export async function verifyGuestClearanceToken(
    token: string,
    secret: string
): Promise<boolean> {
    try {
        const parts = token.split('.')
        if (parts.length !== 3 || parts[0] !== 'g1') return false
        const [version, payloadEncoded, signature] = parts
        const data = `${version}.${payloadEncoded}`
        const expected = await sign(data, secret)
        if (signature.length !== expected.length) return false
        let diff = 0
        for (let i = 0; i < signature.length; i++) {
            diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
        }
        if (diff !== 0) return false
        const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as GuestPayload
        if (payload.typ !== 'guest') return false
        return payload.exp >= Math.floor(Date.now() / 1000)
    } catch {
        return false
    }
}

export function readCookie(request: Request, name: string): string | null {
    const raw = request.headers.get('Cookie') || ''
    for (const part of raw.split(';')) {
        const trimmed = part.trim()
        if (!trimmed) continue
        const eq = trimmed.indexOf('=')
        if (eq <= 0) continue
        const key = trimmed.slice(0, eq)
        if (key !== name) continue
        return decodeURIComponent(trimmed.slice(eq + 1))
    }
    return null
}

export async function hasValidGuestClearance(request: Request, env: Env): Promise<boolean> {
    if (!env.JWT_SECRET) return false
    const token = readCookie(request, GUEST_CLEARANCE_COOKIE)
    if (!token) return false
    return verifyGuestClearanceToken(token, env.JWT_SECRET)
}

export function guestClearanceSetCookieHeader(token: string, env: Env): string {
    const secure = (env.APP_URL || '').startsWith('https')
    const parts = [
        `${GUEST_CLEARANCE_COOKIE}=${encodeURIComponent(token)}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${GUEST_CLEARANCE_TTL_SECONDS}`,
    ]
    if (secure) parts.push('Secure')
    return parts.join('; ')
}

export async function handleGetGuestClearance(request: Request, env: Env): Promise<Response> {
    const ok = await hasValidGuestClearance(request, env)
    return new Response(JSON.stringify({ ok }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
    })
}
