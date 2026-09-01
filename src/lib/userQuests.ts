import { supabase, isSupabaseConfigured } from './supabase'
import { customAuth } from './customAuth'
import { questions } from '../data/questions'
import type { AvatarConfig } from './avatar'

export type QuestKind = 'mcq' | 'coding'

export type UserQuest = {
  id: string
  author_id: string
  author_avatar?: AvatarConfig | null
  slug: string
  title: string
  prompt: string
  kind: QuestKind
  code: string | null
  
  test_harness: string | null
  options: string[]
  
  correct_index?: number
  hint: string | null
  explanation?: string
  difficulty: 1 | 2 | 3
  created_at: string
}

type UserQuestSummary = {
  id: string
  slug: string
  title: string
  difficulty: number
  created_at: string
  solve_count: number
  correct_count: number
}

export type PublicProfile = {
  id: string
  username: string
  created_at: string
  avatar?: AvatarConfig | null
  stats: {
    total_xp: number
    solve_xp?: number
    author_xp?: number
    total_quests: number
    correct_count: number
    wrong_count: number
    quests_authored?: number
    solves_taught?: number
    rival_wins?: number
    rival_losses?: number
  }
  quests: UserQuestSummary[]
}

export type LeaderboardEntry = {
  id: string
  username: string
  avatar?: AvatarConfig | null
  total_xp: number
  total_quests: number
  correct_count: number
  author_xp?: number
}

export type CreatorLeaderboardEntry = {
  id: string
  username: string
  avatar?: AvatarConfig | null
  author_xp: number
  quests_authored: number
  solves_taught: number
}

export type SiteStats = {
  members: number
  quests_answered: number
  quests_created: number
  code_executions: number
}

export type QuestAnswerStats = {
  solve_count: number
  correct_count: number
}

export type CommunityQuestCard = {
  id: string
  slug: string
  title: string
  kind: QuestKind
  difficulty: number
  created_at: string
  username: string
  solve_count: number
  correct_count: number
}

export type QuestDraft = {
  kind: QuestKind
  title: string
  prompt: string
  code: string
  test_harness: string
  options: [string, string, string, string]
  correct_index: number
  hint: string
  explanation: string
  difficulty: 1 | 2 | 3
}

const QUESTION_PREFIX = 'uq:'

export function userQuestQuestionId(questId: string): string {
  return `${QUESTION_PREFIX}${questId}`
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

export function createUserQuest(draft: QuestDraft) {
  return apiRequest<{ status: string; quest: { id: string; slug: string } }>('/api/user-quest', {
    method: 'POST',
    body: JSON.stringify(draft),
  })
}

export function updateUserQuest(id: string, draft: QuestDraft) {
  return apiRequest<{ status: string; quest: { id: string; slug: string } }>('/api/user-quest', {
    method: 'PUT',
    body: JSON.stringify({ id, ...draft }),
  })
}

export function deleteUserQuest(id: string) {
  return apiRequest<{ status: string }>(`/api/user-quest?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export async function listMyQuests(): Promise<UserQuest[]> {
  const res = await apiRequest<{ status: string; quests: UserQuest[] }>('/api/user-quests')
  return (res.quests ?? []).map(normalizeQuest)
}

function normalizeQuest(q: Partial<UserQuest> & { id: string }): UserQuest {
  return {
    ...q,
    kind: q.kind === 'coding' ? 'coding' : 'mcq',
    test_harness: q.test_harness ?? null,
    code: q.code ?? null,
    options: q.options ?? [],
    difficulty: (q.difficulty ?? 1) as 1 | 2 | 3,
    prompt: q.prompt ?? '',
    title: q.title ?? '',
    slug: q.slug ?? '',
    author_id: q.author_id ?? '',
    hint: q.hint ?? null,
    created_at: q.created_at ?? '',
  }
}

export async function getPublicProfile(username: string, fresh = false): Promise<PublicProfile | null> {
  try {
    const url = fresh
      ? `/api/public-profile?username=${encodeURIComponent(username)}&_t=${Date.now()}`
      : `/api/public-profile?username=${encodeURIComponent(username)}`
    const res = await fetch(url)
    if (!res.ok) return null
    const body = (await res.json()) as { profile?: PublicProfile }
    return body.profile ?? null
  } catch {
    return null
  }
}

export async function getUserQuest(username: string, slug: string): Promise<UserQuest | null> {
  if (!isSupabaseConfigured) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, avatar')
    .ilike('username', username)
    .maybeSingle()
  if (!profile) return null

  const { data, error } = await supabase
    .from('user_quests')
    .select(
      'id, author_id, slug, title, prompt, kind, code, test_harness, options, hint, difficulty, created_at'
    )
    .eq('author_id', profile.id)
    .eq('slug', slug)
    .maybeSingle()
  if (error || !data) return null
  return {
    ...normalizeQuest(data as UserQuest),
    author_avatar: (profile.avatar as AvatarConfig | null) ?? null,
  }
}

export async function saveAvatar(avatar: AvatarConfig) {
  return apiRequest<{ status: string; avatar?: AvatarConfig }>('/api/avatar', {
    method: 'PUT',
    body: JSON.stringify({ avatar }),
  })
}

export async function getCreatorLeaderboard(limit = 25): Promise<CreatorLeaderboardEntry[]> {
  try {
    const res = await fetch(`/api/leaderboard?kind=creators&limit=${limit}`)
    if (res.ok) {
      const body = (await res.json()) as { entries?: CreatorLeaderboardEntry[] }
      if (body.entries) return body.entries
    }
  } catch {
    /* ignore */
  }
  return []
}

export async function getLeaderboard(limit = 25): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`/api/leaderboard?limit=${limit}`)
    if (res.ok) {
      const body = (await res.json()) as { entries?: LeaderboardEntry[] }
      if (body.entries) return body.entries
    }
  } catch {
    /* ignore */
  }
  return []
}

export type CommunityQuestSort =
  | 'most_solved'
  | 'least_solved'
  | 'most_attempts'
  | 'least_attempts'
  | 'newest'
  | 'oldest'

export async function getCommunityQuests(
  limit = 40,
  opts?: { sort?: CommunityQuestSort | 'latest' | 'attempts' }
): Promise<CommunityQuestCard[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) })
    const sort = opts?.sort
    if (sort === 'latest') params.set('sort', 'newest')
    else if (sort === 'attempts') params.set('sort', 'most_attempts')
    else if (sort) params.set('sort', sort)
    const res = await fetch(`/api/community-quests?${params}`)
    if (res.ok) {
      const body = (await res.json()) as { quests?: CommunityQuestCard[] }
      if (body.quests) {
        return body.quests.map((q) => ({
          ...q,
          kind: q.kind === 'coding' ? 'coding' : 'mcq',
        }))
      }
    }
  } catch {
    /* ignore */
  }
  return []
}

export async function getQuestStats(questionId: string): Promise<QuestAnswerStats> {
  const empty = { solve_count: 0, correct_count: 0 }
  if (!questionId) return empty
  try {
    const res = await fetch(`/api/quest-stats?question_id=${encodeURIComponent(questionId)}`)
    if (res.ok) {
      const body = (await res.json()) as { stats?: QuestAnswerStats }
      if (body.stats) {
        return {
          solve_count: Number(body.stats.solve_count) || 0,
          correct_count: Number(body.stats.correct_count) || 0,
        }
      }
    }
  } catch {
    /* ignore */
  }
  return empty
}

export async function getQuestStatsBatch(
  questionIds: string[]
): Promise<Record<string, QuestAnswerStats>> {
  const out: Record<string, QuestAnswerStats> = {}
  if (questionIds.length === 0) return out
  const chunks: string[][] = []
  for (let i = 0; i < questionIds.length; i += 100) {
    chunks.push(questionIds.slice(i, i + 100))
  }
  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const res = await fetch(
          `/api/quest-stats-batch?ids=${encodeURIComponent(chunk.join(','))}`
        )
        if (res.ok) {
          const body = (await res.json()) as { stats?: Record<string, QuestAnswerStats> }
          if (body.stats) {
            for (const [id, stats] of Object.entries(body.stats)) {
              out[id] = {
                solve_count: Number(stats.solve_count) || 0,
                correct_count: Number(stats.correct_count) || 0,
              }
            }
          }
        }
      } catch {
        /* ignore */
      }
    })
  )
  return out
}

function withBuiltinQuests(stats: SiteStats): SiteStats {
  return {
    members: Number(stats.members) || 0,
    quests_answered: Number(stats.quests_answered) || 0,
    
    quests_created: (Number(stats.quests_created) || 0) + questions.length,
    code_executions: Number(stats.code_executions) || 0,
  }
}

export async function getSiteStats(): Promise<SiteStats | null> {
  try {
    
    const res = await fetch('/api/site-stats', { cache: 'no-store' })
    if (res.ok) {
      const body = (await res.json()) as { stats?: SiteStats }
      if (body.stats) return withBuiltinQuests(body.stats)
    }
  } catch {
    /* ignore */
  }
  return null
}
