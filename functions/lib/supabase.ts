import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface Env {
    SUPABASE_URL: string
    SUPABASE_SERVICE_ROLE_KEY: string
    JWT_SECRET: string
    APP_URL: string
    TURNSTILE_SECRET?: string
    MAILTRAP_API_TOKEN?: string
    MAILTRAP_SENDER_EMAIL?: string
    MAILTRAP_SENDER_NAME?: string
    GRADE_URL?: string
    GRADE_INTERNAL_KEY?: string
    CF_ACCESS_CLIENT_ID?: string
    CF_ACCESS_CLIENT_SECRET?: string
    CUSTOMERIO_WRITE_KEY?: string
    CUSTOMERIO_APP_API_KEY?: string
    CUSTOMERIO_BROADCAST_ID?: string
    INTERNAL_JOB_SECRET?: string
    DISCORD_PUBLIC_KEY?: string
    DISCORD_TOKEN?: string
    DISCORD_CLIENT_ID?: string
    DISABLE_RATE_LIMITS?: string
    LOCAL_DEV?: string
}

export function createSupabaseClient(env: Env): SupabaseClient {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
