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
    LIMIT_GUEST_RUN_HOURLY?: string | number
    GUEST_RUN_HOURLY?: string | number
    LIMIT_GUEST_SUBMIT_HOURLY?: string | number
    GUEST_SUBMIT_HOURLY?: string | number
    LIMIT_GUEST_BURST_PER_MIN?: string | number
    GUEST_BURST_PER_MIN?: string | number
    LIMIT_GUEST_WINDOW_SECONDS?: string | number
    GUEST_WINDOW_SECONDS?: string | number
    LIMIT_USER_EXECUTION_HOURLY?: string | number
    LIMIT_USER_RUN_HOURLY?: string | number
    USER_RUN_HOURLY?: string | number
    LIMIT_USER_BURST_RUN?: string | number
    USER_BURST_RUN?: string | number
    LIMIT_USER_BURST_SUBMIT?: string | number
    USER_BURST_SUBMIT?: string | number
    LIMIT_USER_WINDOW_SECONDS?: string | number
    USER_WINDOW_SECONDS?: string | number
    MAX_CODE_BYTES?: string | number
    MAX_HARNESS_BYTES?: string | number
    LIMIT_DEV_DAILY?: string | number
    DEV_DAILY_LIMIT?: string | number
    LIMIT_DEV_BURST_PER_MIN?: string | number
    DEV_BURST_PER_MIN?: string | number
    LIMIT_DEV_IP_BURST_PER_MIN?: string | number
    DEV_IP_BURST_PER_MIN?: string | number
    LIMIT_DEV_IP_DAILY?: string | number
    DEV_IP_DAILY_LIMIT?: string | number
}

export function createSupabaseClient(env: Env): SupabaseClient {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
