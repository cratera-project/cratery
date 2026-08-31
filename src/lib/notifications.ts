import { customAuth } from './customAuth'

export type NotificationRow = {
  id: string
  kind: 'quest_solved' | 'rival_invite' | 'rival_result' | string
  payload: Record<string, unknown>
  created_at: string
  read_at: string | null
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T & { error?: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = customAuth.getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(path, { ...options, headers })
  const data = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok && !data.error) data.error = `Request failed (${response.status})`
  return data
}

export async function listNotifications(): Promise<{
  notifications: NotificationRow[]
  unread: number
}> {
  const res = await api<{ notifications?: NotificationRow[]; unread?: number }>('/api/notifications')
  return { notifications: res.notifications ?? [], unread: res.unread ?? 0 }
}

export async function markNotificationsRead(): Promise<void> {
  await api('/api/notifications/read', { method: 'POST' })
}

export function notificationText(n: NotificationRow): string {
  const p = n.payload
  if (n.kind === 'quest_solved') {
    const who = typeof p.username === 'string' ? p.username : 'Someone'
    const title = typeof p.quest_title === 'string' ? p.quest_title : 'your quest'
    return `${who} solved ${title}`
  }
  if (n.kind === 'rival_invite') {
    const from = typeof p.from === 'string' ? p.from : 'Someone'
    if (p.accepted) return `${from} accepted your challenge`
    return `${from} challenged you`
  }
  if (n.kind === 'rival_result') {
    const opp = typeof p.opponent === 'string' ? p.opponent : 'your rival'
    return p.won ? `You beat ${opp}` : `${opp} beat you`
  }
  return 'New activity'
}

export function notificationHref(n: NotificationRow): string | null {
  const p = n.payload
  if (typeof p.rival_id === 'string') return `/rival/${p.rival_id}`
  return null
}
