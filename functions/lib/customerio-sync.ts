import type { SupabaseClient } from '@supabase/supabase-js'
import {
  calcStreakDays,
  categoryProgressTraits,
  daysSince,
  getContinueTarget,
  rankTraits,
  streakAtRisk,
} from '../../src/lib/customerioProgress'
import { rankForXp } from '../../src/lib/ranks'
import { identifyUser, trackEvent, type CustomerioTraits } from './customerio'
import { createSupabaseClient, type Env } from './supabase'

type CustomerioEnv = Pick<Env, 'CUSTOMERIO_WRITE_KEY' | 'APP_URL'>

type UserRow = {
  id: string
  email: string
  username: string
  display_name?: string | null
  created_at?: string
  last_login?: string | null
  newsletter_opt_in?: boolean
}

type AnswerRow = { question_id: string; answered_at: string }

async function loadAnswerRows(supabase: SupabaseClient, userId: string): Promise<AnswerRow[]> {
  const { data, error } = await supabase
    .from('quest_answers')
    .select('question_id, answered_at')
    .eq('user_id', userId)
  if (error) {
    console.error('[customerio] load answers failed:', error.message)
    return []
  }
  return data ?? []
}

async function loadTotalXp(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_user_stats', { p_user_id: userId })
  if (error || !data || typeof data !== 'object') return 0
  return Number((data as { total_xp?: number }).total_xp) || 0
}

export async function buildCustomerioTraits(
  env: CustomerioEnv,
  supabase: SupabaseClient,
  user: UserRow,
  patch?: Partial<CustomerioTraits>
): Promise<CustomerioTraits> {
  const answers = await loadAnswerRows(supabase, user.id)
  const answeredIds = new Set(answers.map((a) => a.question_id))
  const answeredAtIso = answers.map((a) => a.answered_at)
  const lastAnswerAt =
    answeredAtIso.length === 0
      ? null
      : answeredAtIso.reduce((max, iso) => (iso > max ? iso : max), answeredAtIso[0])

  const totalXp = await loadTotalXp(supabase, user.id)
  const continueTarget = getContinueTarget(answeredIds, env.APP_URL)
  const streakDays = calcStreakDays(answeredAtIso)
  const atRisk = streakAtRisk(answeredAtIso)
  const base = appUrl(env.APP_URL, user.username)
  const optIn = user.newsletter_opt_in !== false

  return {
    email: user.email,
    username: user.username,
    name: user.display_name ?? user.username,
    created_at: user.created_at,
    profile_url: base,
    last_login_at: user.last_login ?? null,
    last_answer_at: lastAnswerAt,
    days_since_last_answer: daysSince(lastAnswerAt),
    streak_days: streakDays,
    streak_at_risk: atRisk,
    newsletter_opt_in: optIn,
    unsubscribed: !optIn,
    ...rankTraits(totalXp),
    ...continueTarget,
    ...categoryProgressTraits(answeredIds),
    ...patch,
  }
}

function appUrl(appUrl: string, username: string): string {
  return `${appUrl.replace(/\/$/, '')}/${username}`
}


export async function syncCustomerioIdentify(
  env: CustomerioEnv,
  supabase: SupabaseClient,
  user: UserRow,
  patch?: Partial<CustomerioTraits>
): Promise<void> {
  if (!env.CUSTOMERIO_WRITE_KEY) return
  if (user.newsletter_opt_in === false && !patch?.unsubscribed) return
  const traits = await buildCustomerioTraits(env, supabase, user, patch)
  await identifyUser(env.CUSTOMERIO_WRITE_KEY, user.id, traits)
}


export async function syncCustomerioOnVerify(env: Env, user: UserRow): Promise<void> {
  if (!env.CUSTOMERIO_WRITE_KEY || user.newsletter_opt_in === false) return
  const supabase = createSupabaseClient(env)
  await syncCustomerioIdentify(env, supabase, user)
  await trackEvent(env.CUSTOMERIO_WRITE_KEY, user.id, 'account_verified', {
    email: user.email,
    username: user.username,
  })
}


export async function syncCustomerioOnLogin(env: Env, user: UserRow): Promise<void> {
  if (!env.CUSTOMERIO_WRITE_KEY || user.newsletter_opt_in === false) return
  const supabase = createSupabaseClient(env)
  const now = new Date().toISOString()
  await syncCustomerioIdentify(env, supabase, user, {
    last_login_at: now,
    days_since_last_login: 0,
  })
}

export type AnswerMilestoneContext = {
  isCorrect: boolean
  xpEarned: number
  categorySlug: string
  prevTotalXp: number
  newTotalXp: number
}


export async function syncCustomerioAfterAnswer(
  env: Env,
  userId: string,
  ctx: AnswerMilestoneContext
): Promise<void> {
  if (!env.CUSTOMERIO_WRITE_KEY) return
  const supabase = createSupabaseClient(env)
  const { data: user } = await supabase
    .from('custom_users')
    .select('id, email, username, display_name, created_at, last_login, newsletter_opt_in')
    .eq('id', userId)
    .eq('email_verified', true)
    .maybeSingle()
  if (!user || user.newsletter_opt_in === false) return

  const now = new Date().toISOString()
  const traits = await buildCustomerioTraits(env, supabase, user, {
    last_answer_at: now,
    days_since_last_answer: 0,
    streak_at_risk: false,
  })

  await identifyUser(env.CUSTOMERIO_WRITE_KEY, user.id, traits)

  await trackEvent(env.CUSTOMERIO_WRITE_KEY, user.id, 'quest_answered', {
    is_correct: ctx.isCorrect,
    xp_earned: ctx.xpEarned,
    category_slug: ctx.categorySlug,
    total_xp: ctx.newTotalXp,
    rank: traits.rank,
  })

  if (!ctx.isCorrect || ctx.xpEarned <= 0) return

  const prevRank = rankForXp(ctx.prevTotalXp).name
  const newRank = rankForXp(ctx.newTotalXp).name
  if (prevRank !== newRank) {
    await trackEvent(env.CUSTOMERIO_WRITE_KEY, user.id, 'rank_up', {
      rank: newRank,
      previous_rank: prevRank,
      total_xp: ctx.newTotalXp,
      continue_url: traits.continue_url,
    })
  }

  const xpToNext = traits.xp_to_next_rank ?? 0
  if (xpToNext > 0 && xpToNext <= 10) {
    await trackEvent(env.CUSTOMERIO_WRITE_KEY, user.id, 'rank_near', {
      current_rank: traits.rank,
      next_rank: traits.next_rank,
      xp_to_next_rank: xpToNext,
      continue_url: traits.continue_url,
    })
  }

  const progressKey = `progress_${ctx.categorySlug.replace(/-/g, '_')}`
  const progress = traits[progressKey]
  if (typeof progress === 'string') {
    const [doneStr, totalStr] = progress.split('/')
    const done = Number(doneStr)
    const total = Number(totalStr)
    if (Number.isFinite(done) && Number.isFinite(total) && total - done === 1) {
      await trackEvent(env.CUSTOMERIO_WRITE_KEY, user.id, 'category_near_complete', {
        category_slug: ctx.categorySlug,
        continue_topic: traits.continue_topic,
        continue_progress: progress,
        continue_url: traits.continue_url,
      })
    }
  }
}


export async function runStreakAtRiskCheck(env: Env): Promise<{ checked: number; notified: number }> {
  if (!env.CUSTOMERIO_WRITE_KEY) return { checked: 0, notified: 0 }

  const supabase = createSupabaseClient(env)
  const now = Date.now()
  const todayStart = new Date(now).setHours(0, 0, 0, 0)
  const yesterdayStart = todayStart - 86400000

  const { data: yesterdayRows, error } = await supabase
    .from('quest_answers')
    .select('user_id, answered_at')
    .gte('answered_at', new Date(yesterdayStart).toISOString())
    .lt('answered_at', new Date(todayStart).toISOString())

  if (error) {
    console.error('[customerio] streak check query failed:', error.message)
    return { checked: 0, notified: 0 }
  }

  const candidateIds = [...new Set((yesterdayRows ?? []).map((r) => r.user_id as string))]
  let notified = 0

  for (const userId of candidateIds) {
    const { data: todayAnswer } = await supabase
      .from('quest_answers')
      .select('id')
      .eq('user_id', userId)
      .gte('answered_at', new Date(todayStart).toISOString())
      .limit(1)
      .maybeSingle()
    if (todayAnswer) continue

    const answers = await loadAnswerRows(supabase, userId)
    const answeredAtIso = answers.map((a) => a.answered_at)
    if (!streakAtRisk(answeredAtIso, now)) continue

    const { data: user } = await supabase
      .from('custom_users')
      .select('id, email, username, display_name, created_at, last_login, newsletter_opt_in')
      .eq('id', userId)
      .eq('email_verified', true)
      .maybeSingle()
    if (!user) continue

    if (user.newsletter_opt_in === false) continue

    const streakDays = calcStreakDays(answeredAtIso, now)
    await syncCustomerioIdentify(env, supabase, user, { streak_at_risk: true })
    await trackEvent(env.CUSTOMERIO_WRITE_KEY, userId, 'streak_at_risk', {
      streak_days: streakDays,
    })
    notified++
  }

  return { checked: candidateIds.length, notified }
}
