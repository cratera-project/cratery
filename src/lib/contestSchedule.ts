import type { Contest } from '../data/contests'

const DAY_MS = 24 * 60 * 60 * 1000

export function solutionUnlocksAtMs(contest: Contest): number {
  if (contest.solutionUnlocksAt) return Date.parse(contest.solutionUnlocksAt)
  return Date.parse(contest.opensAt) + DAY_MS
}

export function isSolutionLocked(contest: Contest, now = Date.now()): boolean {
  return now < solutionUnlocksAtMs(contest)
}

export function formatUnlockCountdown(msLeft: number): string {
  const total = Math.max(0, Math.ceil(msLeft / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
}
