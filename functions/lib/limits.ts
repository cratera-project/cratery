import type { Env } from './supabase'
import { DEFAULT_EXECUTION_LIMITS } from '../../src/lib/executionLimits'

export function parseEnvInt(val: string | number | undefined, fallback: number): number {
    if (typeof val === 'number') {
        return Number.isFinite(val) && val > 0 ? Math.round(val) : fallback
    }
    if (typeof val === 'string') {
        const parsed = parseInt(val.trim(), 10)
        if (Number.isFinite(parsed) && parsed > 0) return parsed
    }
    return fallback
}

export function getJudgeLimits(env?: Env) {
    const dGuest = DEFAULT_EXECUTION_LIMITS.websiteExecution.guest
    const dUser = DEFAULT_EXECUTION_LIMITS.websiteExecution.registeredUser
    const dCode = DEFAULT_EXECUTION_LIMITS.websiteExecution.code

    const guestRunsPerHour = parseEnvInt(
        env?.LIMIT_GUEST_RUN_HOURLY ?? env?.GUEST_RUN_HOURLY,
        dGuest.runsPerHour
    )
    const guestSubmitsPerHour = parseEnvInt(
        env?.LIMIT_GUEST_SUBMIT_HOURLY ?? env?.GUEST_SUBMIT_HOURLY,
        dGuest.submitsPerHour
    )
    const guestBurst = parseEnvInt(
        env?.LIMIT_GUEST_BURST_PER_MIN ?? env?.GUEST_BURST_PER_MIN,
        dGuest.burstPerMin
    )
    const guestWindow = parseEnvInt(
        env?.LIMIT_GUEST_WINDOW_SECONDS ?? env?.GUEST_WINDOW_SECONDS,
        dGuest.windowSeconds
    )

    const userHourlyQuota = parseEnvInt(
        env?.LIMIT_USER_EXECUTION_HOURLY ?? env?.LIMIT_USER_RUN_HOURLY ?? env?.USER_RUN_HOURLY,
        dUser.hourlyQuota
    )
    const userBurstRun = parseEnvInt(
        env?.LIMIT_USER_BURST_RUN ?? env?.USER_BURST_RUN,
        dUser.burstRunPerMin
    )
    const userBurstSubmit = parseEnvInt(
        env?.LIMIT_USER_BURST_SUBMIT ?? env?.USER_BURST_SUBMIT,
        dUser.burstSubmitPerMin
    )
    const userWindow = parseEnvInt(
        env?.LIMIT_USER_WINDOW_SECONDS ?? env?.USER_WINDOW_SECONDS,
        dUser.windowSeconds
    )

    const maxCodeBytes = parseEnvInt(env?.MAX_CODE_BYTES, dCode.maxCodeBytes)
    const maxHarnessBytes = parseEnvInt(env?.MAX_HARNESS_BYTES, dCode.maxHarnessBytes)

    return {
        guest: {
            runsPerHour: guestRunsPerHour,
            submitsPerHour: guestSubmitsPerHour,
            burstPerMin: guestBurst,
            windowSeconds: guestWindow,
        },
        user: {
            hourlyQuota: userHourlyQuota,
            burstRunPerMin: userBurstRun,
            burstSubmitPerMin: userBurstSubmit,
            windowSeconds: userWindow,
        },
        code: {
            maxCodeBytes,
            maxHarnessBytes,
        },
    }
}

export function getDeveloperLimits(env?: Env) {
    const dDev = DEFAULT_EXECUTION_LIMITS.developerApi.standard

    const dailyQuota = parseEnvInt(
        env?.LIMIT_DEV_DAILY ?? env?.DEV_DAILY_LIMIT,
        dDev.dailyQuota
    )
    const burstPerMin = parseEnvInt(
        env?.LIMIT_DEV_BURST_PER_MIN ?? env?.DEV_BURST_PER_MIN,
        dDev.burstPerMin
    )
    const ipBurstPerMin = parseEnvInt(
        env?.LIMIT_DEV_IP_BURST_PER_MIN ?? env?.DEV_IP_BURST_PER_MIN,
        dDev.ipBurstPerMin
    )
    const ipDailyLimit = parseEnvInt(
        env?.LIMIT_DEV_IP_DAILY ?? env?.DEV_IP_DAILY_LIMIT,
        dDev.ipDailyShield
    )
    const maxCodeBytes = parseEnvInt(env?.MAX_CODE_BYTES, dDev.maxCodeBytes)
    const maxHarnessBytes = parseEnvInt(env?.MAX_HARNESS_BYTES, dDev.maxHarnessBytes)

    return {
        dailyQuota,
        burstPerMin,
        ipBurstPerMin,
        ipDailyLimit,
        maxCodeBytes,
        maxHarnessBytes,
    }
}
