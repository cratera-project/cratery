

export interface CustomerioTraits {
  email: string
  username: string
  name?: string | null
  created_at?: string
  profile_url?: string
  last_login_at?: string | null
  last_answer_at?: string | null
  days_since_last_answer?: number | null
  total_xp?: number
  rank?: string
  next_rank?: string | null
  xp_to_next_rank?: number
  streak_days?: number
  streak_at_risk?: boolean
  continue_topic?: string
  continue_progress?: string
  continue_url?: string
  newsletter_opt_in?: boolean
  unsubscribed?: boolean
  [key: string]: string | number | boolean | null | undefined
}

export type ContestBroadcastData = {
  contest_id: string
  title: string
  week_label: string
  difficulty: number
  url: string
}

function parseAuth(writeKey: string) {
  if (writeKey.includes(':')) {
    return {
      type: 'track_api' as const,
      authHeader: 'Basic ' + btoa(writeKey),
    }
  }
  return {
    type: 'cdp' as const,
    authHeader: 'Basic ' + btoa(writeKey + ':'),
  }
}


export async function identifyUser(
  writeKey: string | undefined,
  userId: string,
  traits: CustomerioTraits
): Promise<void> {
  if (!writeKey) return
  try {
    const auth = parseAuth(writeKey)
    const url =
      auth.type === 'track_api'
        ? `https://track.customer.io/api/v1/customers/${encodeURIComponent(userId)}`
        : 'https://cdp.customer.io/v1/identify'

    const body =
      auth.type === 'track_api' ? JSON.stringify(traits) : JSON.stringify({ userId, traits })

    const method = auth.type === 'track_api' ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: auth.authHeader,
        'Content-Type': 'application/json',
      },
      body,
    })
    if (!res.ok) {
      console.error('[customerio] identify failed:', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.error('[customerio] identify failed:', err instanceof Error ? err.message : err)
  }
}


export async function trackEvent(
  writeKey: string | undefined,
  userId: string,
  name: string,
  data?: Record<string, unknown>
): Promise<void> {
  if (!writeKey) return
  try {
    const auth = parseAuth(writeKey)
    const url =
      auth.type === 'track_api'
        ? `https://track.customer.io/api/v1/customers/${encodeURIComponent(userId)}/events`
        : 'https://cdp.customer.io/v1/track'

    const body =
      auth.type === 'track_api'
        ? JSON.stringify({ name, data: data ?? {} })
        : JSON.stringify({ userId, event: name, properties: data ?? {} })

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: auth.authHeader,
        'Content-Type': 'application/json',
      },
      body,
    })
    if (!res.ok) {
      console.error('[customerio] track failed:', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.error('[customerio] track failed:', err instanceof Error ? err.message : err)
  }
}


export async function triggerBroadcast(
  appApiKey: string,
  broadcastId: string,
  triggerId: string,
  data: ContestBroadcastData
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`https://api.customer.io/v1/api/campaigns/${broadcastId}/triggers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${appApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: triggerId,
        data,
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { ok: false, error: `broadcast ${res.status}: ${body.slice(0, 500)}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'broadcast failed' }
  }
}
