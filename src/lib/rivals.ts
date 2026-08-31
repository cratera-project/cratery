import { customAuth } from './customAuth'
import { rivalShareUrl } from './share'

export type RivalItem = {
  question_id: string
  href: string
  title?: string
}

export type RivalPlayer = {
  id: string
  username: string
  avatar?: unknown
}

export type RivalMatch = {
  id: string
  status: 'pending' | 'active' | 'complete' | 'expired' | 'declined' | string
  expires_at: string
  accepted_at: string | null
  items: RivalItem[]
  challenger: RivalPlayer | null
  opponent: RivalPlayer | null
  challenger_correct: number
  opponent_correct: number
  winner_username: string | null
  you: 'challenger' | 'opponent' | 'open' | 'spectator'
  answered: string[]
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

export async function createRival(opts?: {
  questionIds?: string[]
  opponentUsername?: string
}): Promise<{ rival?: RivalMatch; error?: string }> {
  return api<{ rival?: RivalMatch }>('/api/rival', {
    method: 'POST',
    body: JSON.stringify({
      question_ids: opts?.questionIds,
      opponent_username: opts?.opponentUsername,
    }),
  })
}

export async function getRival(id: string): Promise<RivalMatch | null> {
  const res = await api<{ rival?: RivalMatch }>(`/api/rival?id=${encodeURIComponent(id)}`)
  return res.rival ?? null
}

export async function acceptRival(id: string): Promise<{ rival?: RivalMatch; error?: string }> {
  return api<{ rival?: RivalMatch }>('/api/rival/accept', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

export async function reportRivalAnswer(
  id: string,
  questionId: string
): Promise<{ rival?: RivalMatch; error?: string }> {
  return api<{ rival?: RivalMatch }>('/api/rival/answer', {
    method: 'POST',
    body: JSON.stringify({ id, question_id: questionId }),
  })
}

export function inviteUrl(id: string): string {
  return rivalShareUrl(id)
}
