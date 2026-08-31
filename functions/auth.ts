

import { createSupabaseClient, type Env } from './lib/supabase'
import { hashPassword, verifyPassword, generateToken } from './lib/crypto'
import { sendVerificationEmail, sendPasswordResetEmail, type MailtrapConfig } from './lib/mailtrap'
import { createJWT } from './lib/jwt'
import { getSessionUser } from './lib/session'
import { corsHeaders } from './lib/cors'
import { consumeRateLimit, getClientIP } from './lib/rateLimit'
import { requireTurnstile } from './lib/turnstile'
import { isReservedUsername } from '../src/lib/reserved'
import {
    handleSubmitQuestAnswer,
    handleSubmitQuestRating,
    handleCreateUserQuest,
    handleUpdateUserQuest,
    handleDeleteUserQuest,
    handleListMyQuests,
    handleGetSiteStats,
    handleGetLeaderboard,
    handleListCommunityQuests,
    handleGetQuestStats,
    handleGetQuestStatsBatch,
    handleGetMyProgress,
    handleSyncLocalProgress,
    handleGetPublicProfile,
    handleUpdateAvatar,
    handleReportUserQuest,
    handleListQuestComments,
    handleCreateQuestComment,
    handleUpdateQuestComment,
    handleDeleteQuestComment,
    handleReportComment,
    COMMENT_RATE,
} from './quest'
import { handleGetGuestClearance } from './lib/guestClearance'
import { handleGradeRun, handleGradeSubmit, handleGetContestLeaderboard } from './lib/grade'
import {
    runStreakAtRiskCheck,
    syncCustomerioOnLogin,
    syncCustomerioOnVerify,
    syncCustomerioIdentify,
} from './lib/customerio-sync'
import { sendLiveContestEmail } from './lib/contestEmail'
import { handleOgImage, handleProfileBadgeSvg, injectProfileOg, profileUsernameFromPath } from './lib/ogHtml'
import {
    handleAcceptRival,
    handleCreateRival,
    handleGetRival,
    handleListNotifications,
    handleReadNotifications,
    handleRivalAnswer,
} from './rival'
import {
    handleDeveloperExecute,
    handleGetDeveloperStatus,
    handleCreateDeveloperKey,
    handleRevokeDeveloperKey,
} from './lib/developer'
import { handleDiscordInteraction, handleDiscordSync } from './lib/discord/handler'
import {
    handleListNotes,
    handleGetNote,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    handleForkNote,
    handleIncrementNoteViews,
    handleIncrementNoteRuns,
} from './lib/notes'

function jsonResponse(data: unknown, status: number, env: Env, request: Request): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: corsHeaders(env, request),
    })
}

function errorResponse(message: string, status: number, env: Env, request: Request): Response {
    return jsonResponse({ error: message }, status, env, request)
}

async function requireRateLimit(
    env: Env,
    request: Request,
    key: string,
    max: number,
    windowSeconds: number,
    failOpen = false
): Promise<Response | null> {
    const ok = await consumeRateLimit(env, key, max, windowSeconds, { failOpen })
    if (!ok) return errorResponse('Too many requests. Please try again later.', 429, env, request)
    return null
}

function mailConfig(env: Env): MailtrapConfig {
    return {
        apiToken: env.MAILTRAP_API_TOKEN,
        senderEmail: env.MAILTRAP_SENDER_EMAIL,
        senderName: env.MAILTRAP_SENDER_NAME || 'Cratery',
    }
}

const VERIFY_EMAIL_SOFT_MSG =
    'If that email exists and is unverified, a new link has been sent.'

const VERIFY_EMAIL_MIN_INTERVAL_MS = 60_000

const VERIFY_EMAIL_MAX_PER_EMAIL = 3
const VERIFY_EMAIL_WINDOW_SECONDS = 3600
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function consumeVerificationEmailSlot(
    env: Env,
    request: Request,
    emailKey: string
): Promise<Response | null> {
    return requireRateLimit(
        env,
        request,
        `verify-mail:email:${emailKey}`,
        VERIFY_EMAIL_MAX_PER_EMAIL,
        VERIFY_EMAIL_WINDOW_SECONDS
    )
}


async function withPublicCache(
    request: Request,
    env: Env,
    bucket: string,
    maxMisses: number,
    handler: () => Promise<Response>
): Promise<Response> {
    const cache = caches.default
    const cacheKey = new Request(request.url, { method: 'GET' })
    const hit = await cache.match(cacheKey)
    if (hit) return hit

    const limited = await requireRateLimit(
        env,
        request,
        `pub:${bucket}:${getClientIP(request)}`,
        maxMisses,
        60,
        true
    )
    if (limited) return limited

    const res = await handler()
    if (res.ok) {
        
        await cache.put(cacheKey, res.clone())
    }
    return res
}

function bearerToken(request: Request): string {
    const header = request.headers.get('Authorization') ?? ''
    return header.startsWith('Bearer ') ? header.slice(7) : ''
}

function secretsMatch(provided: string, expected: string | undefined): boolean {
    if (!expected) return false
    const a = new TextEncoder().encode(provided)
    const b = new TextEncoder().encode(expected)
    if (a.byteLength !== b.byteLength) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
    return diff === 0
}

export default {
    async fetch(
        request: Request,
        env: Env & { ASSETS?: { fetch: (request: Request) => Promise<Response> } },
        ctx: ExecutionContext
    ): Promise<Response> {
        const url = new URL(request.url)
        const path = url.pathname

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(env, request) })
        }

        if (
            !path.startsWith('/auth/') &&
            !path.startsWith('/api/') &&
            path !== '/internal/contest-email'
        ) {
            if (env.ASSETS) {
                if (request.method === 'GET' || request.method === 'HEAD') {
                    const username = profileUsernameFromPath(path)
                    if (username) return injectProfileOg(request, env, username)
                }
                return env.ASSETS.fetch(request)
            }
            return new Response('Not Found', { status: 404 })
        }

        const isDiscordInteractionPath =
            path === '/api/discord' ||
            path === '/api/discord/' ||
            path === '/api/discord/interactions' ||
            path === '/api/discord/interactions/'

        if (isDiscordInteractionPath) {
            if (request.method === 'POST') {
                return await handleDiscordInteraction(request, env, ctx)
            }
            if (request.method === 'GET') {
                return jsonResponse(
                    {
                        status: 'ok',
                        service: 'cratery-discord-bot',
                        endpoint: path,
                        message: 'Active and listening for Discord interaction webhooks (POST).',
                    },
                    200,
                    env,
                    request
                )
            }
        }
        if ((path === '/api/discord/sync' || path === '/api/discord/sync/') && (request.method === 'POST' || request.method === 'GET')) {
            return await handleDiscordSync(request, env)
        }

        const backendReady = Boolean(
            env.SUPABASE_URL &&
                env.SUPABASE_SERVICE_ROLE_KEY &&
                env.JWT_SECRET &&
                env.APP_URL &&
                !env.SUPABASE_URL.includes('xxxxx') &&
                !env.SUPABASE_SERVICE_ROLE_KEY.includes('...')
        )
        if (!backendReady) {
            return errorResponse(
                'Backend not configured. Quizzes still work offline. Add real secrets to .dev.vars for auth/sync.',
                503,
                env,
                request
            )
        }

        try {
            if (path === '/api/quest-answer' && request.method === 'POST') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(env, request, `answer:ip:${ip}`, 500, 3600)
                if (limited) return limited
                return await handleSubmitQuestAnswer(request, env, ctx)
            }
            if (path === '/api/guest-clearance' && request.method === 'GET') {
                return await handleGetGuestClearance(request, env)
            }
            if (path === '/api/my-progress' && request.method === 'GET') {
                return await handleGetMyProgress(request, env)
            }
            if (path === '/api/sync-progress' && request.method === 'POST') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(env, request, `sync:ip:${ip}`, 30, 3600)
                if (limited) return limited
                return await handleSyncLocalProgress(request, env)
            }
            if (path === '/api/quest-rating' && request.method === 'POST') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(env, request, `rating:ip:${ip}`, 60, 3600)
                if (limited) return limited
                return await handleSubmitQuestRating(request, env)
            }
            if (path === '/api/user-quest' && request.method === 'POST') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(env, request, `create-quest:ip:${ip}`, 10, 3600)
                if (limited) return limited
                return await handleCreateUserQuest(request, env)
            }
            if (path === '/api/user-quest' && request.method === 'PUT') {
                return await handleUpdateUserQuest(request, env)
            }
            if (path === '/api/user-quest' && request.method === 'DELETE') {
                return await handleDeleteUserQuest(request, env)
            }
            if (path === '/api/quest-report' && request.method === 'POST') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(env, request, `report:ip:${ip}`, 10, 3600)
                if (limited) return limited
                return await handleReportUserQuest(request, env)
            }
            if (path === '/api/quest-comments' && request.method === 'GET') {
                return await handleListQuestComments(request, env)
            }
            if (path === '/api/quest-comments' && request.method === 'POST') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(
                    env,
                    request,
                    `comment:ip:${ip}`,
                    COMMENT_RATE.createIp,
                    COMMENT_RATE.windowSec
                )
                if (limited) return limited
                return await handleCreateQuestComment(request, env)
            }
            if (path === '/api/quest-comments' && request.method === 'PUT') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(
                    env,
                    request,
                    `comment-edit:ip:${ip}`,
                    COMMENT_RATE.mutateIp,
                    COMMENT_RATE.windowSec
                )
                if (limited) return limited
                return await handleUpdateQuestComment(request, env)
            }
            if (path === '/api/quest-comments' && request.method === 'DELETE') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(
                    env,
                    request,
                    `comment-del:ip:${ip}`,
                    COMMENT_RATE.mutateIp,
                    COMMENT_RATE.windowSec
                )
                if (limited) return limited
                return await handleDeleteQuestComment(request, env)
            }
            if (path === '/api/comment-report' && request.method === 'POST') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(env, request, `report:ip:${ip}`, 10, 3600)
                if (limited) return limited
                return await handleReportComment(request, env)
            }
            if (path === '/api/user-quests' && request.method === 'GET') {
                return await handleListMyQuests(request, env)
            }
            if (path === '/api/site-stats' && request.method === 'GET') {
                
                return await handleGetSiteStats(request, env)
            }
            if (path === '/api/leaderboard' && request.method === 'GET') {
                return await withPublicCache(request, env, 'leaderboard', 30, () =>
                    handleGetLeaderboard(request, env)
                )
            }
            if (path === '/api/community-quests' && request.method === 'GET') {
                return await withPublicCache(request, env, 'community-quests', 30, () =>
                    handleListCommunityQuests(request, env)
                )
            }
            if (path === '/api/quest-stats' && request.method === 'GET') {
                return await withPublicCache(request, env, 'quest-stats', 60, () =>
                    handleGetQuestStats(request, env)
                )
            }
            if (path === '/api/quest-stats-batch' && request.method === 'GET') {
                return await withPublicCache(request, env, 'quest-stats-batch', 60, () =>
                    handleGetQuestStatsBatch(request, env)
                )
            }
            if (path === '/api/public-profile' && request.method === 'GET') {
                return await handleGetPublicProfile(request, env)
            }
            if (path === '/api/notes' && request.method === 'GET') {
                return await handleListNotes(request, env)
            }
            if (path === '/api/notes' && request.method === 'POST') {
                return await handleCreateNote(request, env)
            }
            if (path === '/api/notes/view' && request.method === 'POST') {
                return await handleIncrementNoteViews(request, env)
            }
            if (path === '/api/notes/run' && request.method === 'POST') {
                return await handleIncrementNoteRuns(request, env)
            }
            if (path === '/api/notes' && request.method === 'PUT') {
                return await handleUpdateNote(request, env)
            }
            if (path === '/api/notes' && request.method === 'DELETE') {
                return await handleDeleteNote(request, env)
            }
            if (path === '/api/notes/fork' && request.method === 'POST') {
                return await handleForkNote(request, env)
            }
            if (path.startsWith('/api/notes/') && request.method === 'GET') {
                return await handleGetNote(request, env)
            }
            if (path.startsWith('/api/og/') && request.method === 'GET') {
                return await handleOgImage(request, env)
            }
            if (path.startsWith('/api/badge/') && request.method === 'GET') {
                return await handleProfileBadgeSvg(request, env)
            }
            if (path === '/api/rival' && request.method === 'POST') {
                return await handleCreateRival(request, env)
            }
            if (path === '/api/rival' && request.method === 'GET') {
                return await handleGetRival(request, env)
            }
            if (path === '/api/rival/accept' && request.method === 'POST') {
                return await handleAcceptRival(request, env)
            }
            if (path === '/api/rival/answer' && request.method === 'POST') {
                return await handleRivalAnswer(request, env)
            }
            if (path === '/api/notifications' && request.method === 'GET') {
                return await handleListNotifications(request, env)
            }
            if (path === '/api/notifications/read' && request.method === 'POST') {
                return await handleReadNotifications(request, env)
            }
            if (path === '/api/avatar' && request.method === 'PUT') {
                const ip = getClientIP(request)
                const limited = await requireRateLimit(env, request, `avatar:ip:${ip}`, 30, 3600)
                if (limited) return limited
                return await handleUpdateAvatar(request, env)
            }
            if (path === '/api/grade-run' && request.method === 'POST') {
                return await handleGradeRun(request, env, ctx)
            }
            if (path === '/api/grade-submit' && request.method === 'POST') {
                return await handleGradeSubmit(request, env, ctx)
            }
            if (path === '/api/contest-leaderboard' && request.method === 'GET') {
                const limited = await requireRateLimit(
                    env,
                    request,
                    `pub:contest-board:${getClientIP(request)}`,
                    60,
                    60,
                    true
                )
                if (limited) return limited
                return await handleGetContestLeaderboard(request, env)
            }
            if (path === '/api/v1/execute' && request.method === 'POST') {
                return await handleDeveloperExecute(request, env)
            }
            if ((path === '/api/v1/developer/status' || path === '/api/developer/status') && request.method === 'GET') {
                return await handleGetDeveloperStatus(request, env)
            }
            if (path === '/api/developer/keys' && request.method === 'POST') {
                return await handleCreateDeveloperKey(request, env)
            }
            if (path === '/api/developer/keys' && request.method === 'DELETE') {
                return await handleRevokeDeveloperKey(request, env)
            }
            if (path === '/api/preferences' && request.method === 'GET') {
                return await handleGetPreferences(request, env)
            }
            if (path === '/api/preferences' && request.method === 'PATCH') {
                return await handleUpdatePreferences(request, env, ctx)
            }
            if (path === '/auth/signup' && request.method === 'POST') {
                return await handleSignup(request, env)
            }
            if (path === '/internal/contest-email' && request.method === 'POST') {
                return await handleContestEmail(request, env)
            }
            if (path === '/auth/verify' && request.method === 'POST') {
                return await handleVerify(request, env, ctx)
            }
            if (path === '/auth/login' && request.method === 'POST') {
                return await handleLogin(request, env, ctx)
            }
            if (path === '/auth/forgot-password' && request.method === 'POST') {
                return await handleForgotPassword(request, env)
            }
            if (path === '/auth/reset-password' && request.method === 'POST') {
                return await handleResetPassword(request, env)
            }
            if (path === '/auth/resend-verification' && request.method === 'POST') {
                return await handleResendVerification(request, env)
            }

            return errorResponse('Auth endpoint not found', 404, env, request)
        } catch (err) {
            console.error('Auth API error:', err)
            return errorResponse('Internal server error', 500, env, request)
        }
    },

    async scheduled(controller: ScheduledController, env: Env): Promise<void> {
        if (controller.cron === '5 0 * * 4') {
            const result = await sendLiveContestEmail(env)
            console.log('[contest-email]', JSON.stringify(result))
            return
        }
        if (controller.cron === '0 18 * * *') {
            const result = await runStreakAtRiskCheck(env)
            console.log('[streak-at-risk]', JSON.stringify(result))
        }
    },
}

async function handleContestEmail(request: Request, env: Env): Promise<Response> {
    if (!secretsMatch(bearerToken(request), env.INTERNAL_JOB_SECRET)) {
        return errorResponse('forbidden', 403, env, request)
    }
    const result = await sendLiveContestEmail(env)
    if (result.ok || ('skipped' in result && result.skipped)) {
        return jsonResponse(result, 200, env, request)
    }
    return jsonResponse(result, 500, env, request)
}

async function handleGetPreferences(request: Request, env: Env): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser) return errorResponse('Unauthorized', 401, env, request)

    const supabase = createSupabaseClient(env)
    const { data: user, error } = await supabase
        .from('custom_users')
        .select('id, email, username, newsletter_opt_in')
        .eq('id', authUser.id)
        .maybeSingle()

    if (error || !user) {
        return errorResponse('User not found', 404, env, request)
    }

    return jsonResponse(
        {
            status: 'ok',
            preferences: {
                newsletter_opt_in: user.newsletter_opt_in !== false,
            },
        },
        200,
        env,
        request
    )
}

async function handleUpdatePreferences(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const authUser = await getSessionUser(request, env)
    if (!authUser) return errorResponse('Unauthorized', 401, env, request)

    const body = (await request.json()) as { newsletter_opt_in?: boolean }
    if (typeof body.newsletter_opt_in !== 'boolean') {
        return errorResponse('newsletter_opt_in must be a boolean', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    const { data: user, error } = await supabase
        .from('custom_users')
        .update({
            newsletter_opt_in: body.newsletter_opt_in,
            updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id)
        .select('id, email, username, display_name, created_at, last_login, newsletter_opt_in')
        .single()

    if (error || !user) {
        return errorResponse('Failed to update preferences', 500, env, request)
    }

    ctx.waitUntil(
        syncCustomerioIdentify(env, supabase, user, {
            newsletter_opt_in: user.newsletter_opt_in !== false,
            unsubscribed: user.newsletter_opt_in === false,
        })
    )

    return jsonResponse(
        {
            status: 'ok',
            preferences: {
                newsletter_opt_in: user.newsletter_opt_in !== false,
            },
        },
        200,
        env,
        request
    )
}

const DISPOSABLE_EMAIL_DOMAINS = new Set([
    'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
    'tempmail.com', 'temp-mail.org', '10minutemail.com', 'yopmail.com', 'yopmail.net',
    'sharklasers.com', 'throwawaymail.com', 'trashmail.com', 'getairmail.com',
    'dispostable.com', 'fakemailgenerator.com', 'generator.email', 'tempail.com',
    'mytemp.email', 'crazymailing.com', 'mohmal.com', 'burnermail.io', 'inboxkitten.com',
    'dropmail.me', 'minuteinbox.com', 'emailondeck.com', 'tempinbox.com', 'tempmailo.com'
])

async function handleSignup(request: Request, env: Env): Promise<Response> {
    const ip = getClientIP(request)
    const [ipShortOk, ipDailyOk] = await Promise.all([
        consumeRateLimit(env, `signup:ip:short:${ip}`, 3, 3600),
        consumeRateLimit(env, `signup:ip:daily:${ip}`, 5, 86400),
    ])
    if (!ipShortOk || !ipDailyOk) {
        return errorResponse('Too many accounts created from this IP/network. Please try again tomorrow.', 429, env, request)
    }

    const body = (await request.json()) as {
        email?: string
        password?: string
        username?: string
        newsletter_opt_in?: boolean
        'cf-turnstile-response'?: string
    }
    const ok = await requireTurnstile(env, request, body['cf-turnstile-response'])
    if (!ok) return errorResponse('forbidden', 403, env, request)

    const { email, password, username, newsletter_opt_in } = body

    if (!email || !password || !username) {
        return errorResponse('Email, password, and username are required', 400, env, request)
    }
    if (password.length < 8 || password.length > 128) {
        return errorResponse('Password must be 8-128 characters', 400, env, request)
    }
    if (username.length < 3 || username.length > 20) {
        return errorResponse('Username must be 3-20 characters', 400, env, request)
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return errorResponse('Username can only contain letters, numbers, and underscores', 400, env, request)
    }
    if (isReservedUsername(username)) {
        return errorResponse('Username is not available', 400, env, request)
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return errorResponse('Invalid email format', 400, env, request)
    }

    const emailDomain = email.split('@')[1]?.toLowerCase().trim()
    if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
        return errorResponse('Disposable or temporary email addresses are not permitted', 400, env, request)
    }

    const emailKey = email.toLowerCase()
    const limitedEmail = await requireRateLimit(env, request, `signup:email:${emailKey}`, 5, 3600)
    if (limitedEmail) return limitedEmail

    const supabase = createSupabaseClient(env)

    const { data: existingEmail } = await supabase
        .from('custom_users')
        .select('id')
        .eq('email', emailKey)
        .single()
    if (existingEmail) {
        return errorResponse('Could not create account with that email or username', 400, env, request)
    }

    const { data: existingUsername } = await supabase
        .from('custom_users')
        .select('id')
        .eq('username', username.toLowerCase())
        .single()
    if (existingUsername) {
        return errorResponse('Could not create account with that email or username', 400, env, request)
    }

    const passwordHash = await hashPassword(password)
    const verificationToken = generateToken()
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const optIn = newsletter_opt_in !== false

    const { data: newUser, error: insertError } = await supabase
        .from('custom_users')
        .insert({
            email: emailKey,
            password_hash: passwordHash,
            username: username.toLowerCase(),
            display_name: username,
            email_verified: false,
            newsletter_opt_in: optIn,
            verification_token: verificationToken,
            verification_expires: verificationExpires,
        })
        .select('id, email, username, newsletter_opt_in')
        .single()

    if (insertError) {
        console.error('Insert error:', insertError)
        return errorResponse('Failed to create account', 400, env, request)
    }

    const verificationUrl = `${env.APP_URL}/verify?token=${verificationToken}`
    const verifyLimited = await consumeVerificationEmailSlot(env, request, emailKey)
    if (verifyLimited) {
        return jsonResponse(
            {
                message:
                    'Account created! Too many verification emails recently. Wait a few minutes, then use “Resend link”.',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                    newsletter_opt_in: newUser.newsletter_opt_in,
                },
                requiresVerification: true,
            },
            201,
            env,
            request
        )
    }

    const emailResult = await sendVerificationEmail(mailConfig(env), email, username, verificationUrl)
    if (!emailResult.success) {
        console.error('Email send failed:', emailResult.error)
    }

    return jsonResponse(
        {
            message: 'Account created! Check your email for a verification link.',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                newsletter_opt_in: newUser.newsletter_opt_in,
            },
            requiresVerification: true,
        },
        201,
        env,
        request
    )
}

async function handleVerify(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const ip = getClientIP(request)
    const limited = await requireRateLimit(env, request, `verify:ip:${ip}`, 20, 900)
    if (limited) return limited

    const body = (await request.json()) as { token?: string }
    const token = body.token?.trim()
    if (!token || token.length < 32) {
        return errorResponse('Verification token required', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    const { data: user, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('verification_token', token)
        .single()

    if (error || !user) {
        return errorResponse('Invalid or expired verification link', 400, env, request)
    }
    if (user.email_verified) {
        return errorResponse('Email is already verified', 400, env, request)
    }
    if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
        return errorResponse('Verification link has expired. Please request a new one.', 400, env, request)
    }

    const { error: updateError } = await supabase
        .from('custom_users')
        .update({
            email_verified: true,
            verification_token: null,
            verification_expires: null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (updateError) {
        return errorResponse('Failed to verify email', 400, env, request)
    }

    await supabase.from('profiles').upsert({ id: user.id, username: user.username })

    ctx.waitUntil(
        syncCustomerioOnVerify(env, {
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            created_at: user.created_at,
            last_login: user.last_login,
            newsletter_opt_in: user.newsletter_opt_in !== false,
        })
    )

    const jwtToken = await createJWT(user.id, user.email, user.username, env.JWT_SECRET)
    return jsonResponse(
        {
            message: 'Email verified successfully!',
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                display_name: user.display_name,
                newsletter_opt_in: user.newsletter_opt_in !== false,
            },
        },
        200,
        env,
        request
    )
}

async function handleLogin(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const ip = getClientIP(request)
    const limited = await requireRateLimit(env, request, `login:ip:${ip}`, 10, 900)
    if (limited) return limited

    const body = (await request.json()) as { email?: string; password?: string }
    const { email, password } = body

    if (!email || !password) {
        return errorResponse('Email and password are required', 400, env, request)
    }
    if (password.length > 128) {
        return errorResponse('Invalid email or password', 401, env, request)
    }

    const emailKey = email.toLowerCase()
    const limitedEmail = await requireRateLimit(env, request, `login:email:${emailKey}`, 10, 900)
    if (limitedEmail) return limitedEmail

    const supabase = createSupabaseClient(env)
    const { data: user, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('email', emailKey)
        .single()

    if (error || !user) {
        return errorResponse('Invalid email or password', 401, env, request)
    }

    const passwordValid = await verifyPassword(password, user.password_hash)
    if (!passwordValid) {
        return errorResponse('Invalid email or password', 401, env, request)
    }

    if (!user.email_verified) {
        return jsonResponse(
            {
                error: 'Please verify your email before logging in',
                requiresVerification: true,
            },
            403,
            env,
            request
        )
    }

    const token = await createJWT(user.id, user.email, user.username, env.JWT_SECRET)
    const loginAt = new Date().toISOString()
    await supabase.from('custom_users').update({ last_login: loginAt, tokens_valid_after: 'epoch' }).eq('id', user.id)

    ctx.waitUntil(
        syncCustomerioOnLogin(env, {
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            created_at: user.created_at,
            last_login: loginAt,
            newsletter_opt_in: user.newsletter_opt_in !== false,
        })
    )

    return jsonResponse(
        {
            message: 'Logged in successfully!',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                display_name: user.display_name,
                newsletter_opt_in: user.newsletter_opt_in !== false,
            },
        },
        200,
        env,
        request
    )
}

async function handleForgotPassword(request: Request, env: Env): Promise<Response> {
    const ip = getClientIP(request)
    const limited = await requireRateLimit(env, request, `reset:ip:${ip}`, 3, 3600)
    if (limited) return limited

    const body = (await request.json()) as { email?: string; 'cf-turnstile-response'?: string }
    const ok = await requireTurnstile(env, request, body['cf-turnstile-response'])
    if (!ok) return errorResponse('forbidden', 403, env, request)

    const { email } = body
    if (!email) {
        return errorResponse('Email is required', 400, env, request)
    }

    const emailKey = email.toLowerCase()
    const limitedEmail = await requireRateLimit(env, request, `reset:email:${emailKey}`, 3, 3600)
    if (limitedEmail) return limitedEmail

    const supabase = createSupabaseClient(env)
    const { data: user } = await supabase
        .from('custom_users')
        .select('id, email, username')
        .eq('email', emailKey)
        .single()

    
    if (!user) {
        return jsonResponse(
            { message: 'If that email exists, a reset link has been sent.' },
            200,
            env,
            request
        )
    }

    const resetToken = generateToken()
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    await supabase
        .from('custom_users')
        .update({
            reset_token: resetToken,
            reset_expires: resetExpires,
        })
        .eq('id', user.id)

    const resetUrl = `${env.APP_URL}/reset-password?token=${resetToken}`
    await sendPasswordResetEmail(mailConfig(env), user.email, user.username, resetUrl)

    return jsonResponse(
        { message: 'If that email exists, a reset link has been sent.' },
        200,
        env,
        request
    )
}

async function handleResetPassword(request: Request, env: Env): Promise<Response> {
    const ip = getClientIP(request)
    const limited = await requireRateLimit(env, request, `reset-confirm:ip:${ip}`, 20, 900)
    if (limited) return limited

    const body = (await request.json()) as { token?: string; password?: string }
    const { token, password } = body

    if (!password || password.length < 8 || password.length > 128) {
        return errorResponse('Password must be 8-128 characters', 400, env, request)
    }
    if (!token || token.length < 32) {
        return errorResponse('Reset token required', 400, env, request)
    }

    const supabase = createSupabaseClient(env)
    const { data: user, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('reset_token', token)
        .single()

    if (error || !user) {
        return errorResponse('Invalid or expired reset token', 400, env, request)
    }
    if (user.reset_expires && new Date(user.reset_expires) < new Date()) {
        return errorResponse('Reset token has expired. Please request a new one.', 400, env, request)
    }

    const passwordHash = await hashPassword(password)
    const { error: updateError } = await supabase
        .from('custom_users')
        .update({
            password_hash: passwordHash,
            reset_token: null,
            reset_expires: null,
            tokens_valid_after: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (updateError) {
        return errorResponse('Failed to reset password', 400, env, request)
    }

    return jsonResponse(
        { message: 'Password reset successfully! You can now log in.' },
        200,
        env,
        request
    )
}

async function handleResendVerification(request: Request, env: Env): Promise<Response> {
    const ip = getClientIP(request)
    const limited = await requireRateLimit(env, request, `resend:ip:${ip}`, 3, 900)
    if (limited) return limited
    const limitedHour = await requireRateLimit(env, request, `resend:ip:${ip}:hour`, 8, 3600)
    if (limitedHour) return limitedHour

    const body = (await request.json()) as { email?: string; 'cf-turnstile-response'?: string }
    const ok = await requireTurnstile(env, request, body['cf-turnstile-response'])
    if (!ok) return errorResponse('forbidden', 403, env, request)

    const { email } = body
    if (!email) {
        return errorResponse('Email is required', 400, env, request)
    }

    const emailKey = email.toLowerCase().trim()
    if (!EMAIL_REGEX.test(emailKey)) {
        return errorResponse('Invalid email format', 400, env, request)
    }

    const softMsg = { message: VERIFY_EMAIL_SOFT_MSG }

    const supabase = createSupabaseClient(env)
    const { data: user } = await supabase
        .from('custom_users')
        .select('id, email, username, email_verified, updated_at')
        .eq('email', emailKey)
        .maybeSingle()

    
    if (!user || user.email_verified) {
        return jsonResponse(softMsg, 200, env, request)
    }

    if (user.updated_at) {
        const elapsed = Date.now() - new Date(user.updated_at).getTime()
        if (elapsed < VERIFY_EMAIL_MIN_INTERVAL_MS) {
            return jsonResponse(softMsg, 200, env, request)
        }
    }

    const emailLimited = await consumeVerificationEmailSlot(env, request, emailKey)
    if (emailLimited) return emailLimited

    const verificationToken = generateToken()
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    await supabase
        .from('custom_users')
        .update({
            verification_token: verificationToken,
            verification_expires: verificationExpires,
        })
        .eq('id', user.id)

    const verificationUrl = `${env.APP_URL}/verify?token=${verificationToken}`
    await sendVerificationEmail(mailConfig(env), user.email, user.username, verificationUrl)

    return jsonResponse(softMsg, 200, env, request)
}
