

export interface JWTPayload {
    sub: string
    email: string
    username: string
    iat: number
    exp: number
}

function base64UrlEncode(data: string | Uint8Array): string {
    const str =
        typeof data === 'string'
            ? btoa(data)
            : btoa(String.fromCharCode(...data))
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    while (str.length % 4) str += '='
    return atob(str)
}

async function createSignature(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    return base64UrlEncode(new Uint8Array(signature))
}

async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
    const expected = await createSignature(data, secret)
    if (signature.length !== expected.length) return false
    let result = 0
    for (let i = 0; i < signature.length; i++) {
        result |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
    }
    return result === 0
}

export async function createJWT(
    userId: string,
    email: string,
    username: string,
    secret: string,
    expiresInSeconds = 7 * 24 * 60 * 60
): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = base64UrlEncode(
        JSON.stringify({
            sub: userId,
            email,
            username,
            iat: now,
            exp: now + expiresInSeconds,
        } satisfies JWTPayload)
    )
    const data = `${header}.${payload}`
    return `${data}.${await createSignature(data, secret)}`
}

async function verifyJWT(
    token: string,
    secret: string
): Promise<{ valid: true; payload: JWTPayload } | { valid: false; error: string }> {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return { valid: false, error: 'Invalid token format' }

        const [headerEncoded, payloadEncoded, signature] = parts
        const ok = await verifySignature(`${headerEncoded}.${payloadEncoded}`, signature, secret)
        if (!ok) return { valid: false, error: 'Invalid signature' }

        const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as JWTPayload
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            return { valid: false, error: 'Token expired' }
        }
        return { valid: true, payload }
    } catch {
        return { valid: false, error: 'Failed to verify token' }
    }
}

export async function getUserFromHeader(
    authHeader: string | null,
    secret: string
): Promise<JWTPayload | null> {
    if (!authHeader?.startsWith('Bearer ')) return null
    const result = await verifyJWT(authHeader.slice(7), secret)
    return result.valid ? result.payload : null
}
