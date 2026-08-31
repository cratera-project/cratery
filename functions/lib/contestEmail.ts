import { getLiveContest } from '../../src/data/contestCalendar'
import { createSupabaseClient, type Env } from './supabase'
import { triggerBroadcast } from './customerio'

export type ContestEmailResult =
  | { ok: true; contestId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; error: string }

export async function sendLiveContestEmail(env: Env, now = Date.now()): Promise<ContestEmailResult> {
  const writeReady = Boolean(env.CUSTOMERIO_APP_API_KEY && env.CUSTOMERIO_BROADCAST_ID)
  if (!writeReady) {
    return { ok: false, skipped: true, reason: 'customerio_not_configured' }
  }

  const live = getLiveContest(now)
  if (!live) {
    return { ok: false, skipped: true, reason: 'no_live_contest' }
  }

  const supabase = createSupabaseClient(env)
  const { error: insertError } = await supabase.from('contest_email_sends').insert({
    contest_id: live.id,
  })
  if (insertError) {
    if (insertError.code === '23505') {
      return { ok: false, skipped: true, reason: 'already_sent' }
    }
    return { ok: false, error: `claim failed: ${insertError.message}` }
  }

  const appUrl = env.APP_URL.replace(/\/$/, '')
  const result = await triggerBroadcast(env.CUSTOMERIO_APP_API_KEY!, env.CUSTOMERIO_BROADCAST_ID!, live.id, {
    contest_id: live.id,
    title: live.title,
    week_label: live.weekLabel,
    difficulty: live.difficulty,
    url: `${appUrl}/contest/${live.id}`,
  })

  if (!result.ok) {
    const { error: undoError } = await supabase.from('contest_email_sends').delete().eq('contest_id', live.id)
    if (undoError) {
      console.error('[contest-email] failed to release claim after broadcast error:', undoError.message)
    }
    return { ok: false, error: result.error }
  }

  return { ok: true, contestId: live.id }
}
