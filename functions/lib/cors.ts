import type { Env } from './supabase'


export function corsHeaders(env: Env, request?: Request): HeadersInit {
    const origin = request ? request.headers.get('Origin') : null
    const allowedConfig = (env.APP_URL || '').replace(/\/$/, '')
    
    let allowOrigin = allowedConfig
    if (origin) {
        try {
            const host = new URL(origin).hostname
            if (
                host === 'localhost' ||
                host === '127.0.0.1' ||
                host === 'cratery.cratera.org' ||
                host === 'cratera.org' ||
                host.endsWith('.cratera.org')
            ) {
                allowOrigin = origin
            }
        } catch {
            /* ignore invalid origin */
        }
    }

    return {
        'Access-Control-Allow-Origin': allowOrigin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, CF-Access-Client-Id, CF-Access-Client-Secret',
        'Content-Type': 'application/json',
    }
}
