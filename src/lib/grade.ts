import { customAuth } from './customAuth'
import type { AvatarConfig } from './avatar'

export type GradeRunResult = {
  unavailable?: boolean
  error?: string
  compilationSuccess?: boolean
  compilationError?: string | null
  passed?: boolean
  status?: string
  verdict?: string
  stdout?: string | null
  stderr?: string | null
  executionTime?: number
  memoryKb?: number
  scoreUpdated?: boolean
  compileMs?: number
  copyMs?: number
  bootMs?: number
  wallMs?: number
  restored?: boolean
  xpEarned?: number
  totalXp?: number
  rank?: string
  tier?: 'guest' | 'free'
  requiresSignup?: boolean
  requiresAuth?: boolean
  rateLimited?: boolean
}

export type ContestStanding = {
  id: string
  username: string
  avatar?: AvatarConfig | null
  run_ms: number
  memory_kb: number
}

async function gradeRequest(
  path: '/api/grade-run' | '/api/grade-submit',
  input: { code: string; harness: string; contestId?: string; language?: string }
): Promise<GradeRunResult> {
  const token = customAuth.getToken()

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(path, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code: input.code,
        harness: input.harness,
        ...(input.contestId ? { contestId: input.contestId } : {}),
        ...(input.language ? { language: input.language } : {}),
      }),
      signal: AbortSignal.timeout(90_000),
    })
    const data = (await response.json().catch(() => ({}))) as GradeRunResult
    if (response.status === 401) {
      return { ...data, error: data.error || 'Sign in required', requiresAuth: true }
    }
    if (response.status === 429) {
      return {
        ...data,
        error: data.error || 'Rate limit reached. Try again later.',
        rateLimited: true,
      }
    }
    if (response.status === 503 || data.unavailable) {
      return { unavailable: true, error: data.error }
    }
    if (!response.ok) {
      return { error: data.error || `Request failed (${response.status})` }
    }
    return data
  } catch {
    return { unavailable: true, error: 'network' }
  }
}

export function gradeRun(input: { code: string; harness: string; language?: string }): Promise<GradeRunResult> {
  return gradeRequest('/api/grade-run', input)
}

export function gradeSubmit(input: {
  code: string
  harness: string
  contestId?: string
  language?: string
}): Promise<GradeRunResult> {
  return gradeRequest('/api/grade-submit', input)
}

export async function getContestLeaderboard(
  contestId: string,
  limit = 50
): Promise<ContestStanding[]> {
  try {
    const res = await fetch(
      `/api/contest-leaderboard?contest_id=${encodeURIComponent(contestId)}&limit=${limit}`
    )
    if (!res.ok) return []
    const body = (await res.json()) as { entries?: ContestStanding[] }
    return Array.isArray(body.entries) ? body.entries : []
  } catch {
    return []
  }
}


export function formatRunMs(us: number): string {
  if (!Number.isFinite(us) || us < 0) return '-'
  if (us < 1000) return `${Math.round(us)}µs`
  if (us < 1_000_000) {
    const ms = us / 1000
    return ms >= 10 ? `${ms.toFixed(1)}ms` : `${ms.toFixed(2)}ms`
  }
  return `${(us / 1_000_000).toFixed(2)}s`
}

export function formatMemoryKb(kb: number): string {
  if (kb >= 1024) {
    const mb = kb / 1024
    return mb >= 10 ? `${Math.round(mb)} MB` : `${mb.toFixed(1)} MB`
  }
  return `${kb} KB`
}

export type ContestRunItem = {
  id: string
  timestamp: number
  kind: 'run' | 'submit'
  passed?: boolean
  verdict?: string
  status?: string
  executionTime?: number
  memoryKb?: number
  wallMs?: number
  code?: string
  scoreUpdated?: boolean
  error?: string
  compilationError?: string | null
}

const RUNS_KEY_PREFIX = 'cratery_contest_runs_'

export function getContestRuns(contestId: string): ContestRunItem[] {
  try {
    const raw = localStorage.getItem(RUNS_KEY_PREFIX + contestId)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ContestRunItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveContestRun(
  contestId: string,
  item: Omit<ContestRunItem, 'id' | 'timestamp'> & { timestamp?: number }
): ContestRunItem {
  const existing = getContestRuns(contestId)
  const fullItem: ContestRunItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: item.timestamp ?? Date.now(),
  }
  const next = [fullItem, ...existing].slice(0, 50)
  try {
    localStorage.setItem(RUNS_KEY_PREFIX + contestId, JSON.stringify(next))
  } catch {
    /* ignore storage quota limits */
  }
  return fullItem
}

export function clearContestRuns(contestId: string): void {
  try {
    localStorage.removeItem(RUNS_KEY_PREFIX + contestId)
  } catch {
    /* ignore */
  }
}

export function isContestSolvedLocally(contestId: string): boolean {
  return getContestRuns(contestId).some((r) => r.passed === true || r.verdict === 'AC')
}
