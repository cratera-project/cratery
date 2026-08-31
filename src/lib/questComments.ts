import { customAuth } from './customAuth'

export type QuestComment = {
  id: string
  question_id: string
  author_id: string
  username: string
  body: string
  created_at: string
  updated_at: string
  edited: boolean
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T & { error?: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = customAuth.getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(path, { ...options, headers })
  const data = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok && !data.error) data.error = `Request failed (${response.status})`
  return data
}

export async function listQuestComments(questionId: string): Promise<QuestComment[]> {
  const res = await apiRequest<{ status: string; comments: QuestComment[] }>(
    `/api/quest-comments?question_id=${encodeURIComponent(questionId)}`
  )
  return res.comments ?? []
}

export function createQuestComment(questionId: string, body: string) {
  return apiRequest<{ status: string; comment: QuestComment }>('/api/quest-comments', {
    method: 'POST',
    body: JSON.stringify({ question_id: questionId, body }),
  })
}

export function updateQuestComment(id: string, body: string) {
  return apiRequest<{ status: string; comment: QuestComment }>('/api/quest-comments', {
    method: 'PUT',
    body: JSON.stringify({ id, body }),
  })
}

export function deleteQuestComment(id: string) {
  return apiRequest<{ status: string }>(
    `/api/quest-comments?id=${encodeURIComponent(id)}`,
    { method: 'DELETE' }
  )
}

export function reportQuest(questionId: string, reason: string, turnstileToken: string) {
  return apiRequest<{ status: string }>('/api/quest-report', {
    method: 'POST',
    body: JSON.stringify({
      question_id: questionId,
      reason,
      'cf-turnstile-response': turnstileToken,
    }),
  })
}

export function reportComment(commentId: string, reason: string, turnstileToken: string) {
  return apiRequest<{ status: string }>('/api/comment-report', {
    method: 'POST',
    body: JSON.stringify({
      comment_id: commentId,
      reason,
      'cf-turnstile-response': turnstileToken,
    }),
  })
}

export function formatCommentTime(iso: string): string {
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return ''
  const sec = Math.floor((Date.now() - t) / 1000)
  if (sec < 60) return 'just now'
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`
  if (sec < 86400 * 14) return `${Math.floor(sec / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}
