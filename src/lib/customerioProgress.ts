import { catalogCategories, questionsByCategory } from '../data/questionCatalog'
import { nextRank, rankForXp } from './ranks'

export type ContinueTarget = {
  continue_topic: string
  continue_progress: string
  continue_url: string
  continue_category_slug: string
}


export function calcStreakDays(answeredAtIso: string[], now = Date.now()): number {
  const activityDates = new Set<number>()
  for (const iso of answeredAtIso) {
    const t = Date.parse(iso)
    if (Number.isFinite(t)) activityDates.add(new Date(t).setHours(0, 0, 0, 0))
  }
  if (activityDates.size === 0) return 0

  const today = new Date(now).setHours(0, 0, 0, 0)
  const yesterday = today - 86400000
  let currentCheck = activityDates.has(today)
    ? today
    : activityDates.has(yesterday)
      ? yesterday
      : null

  let streak = 0
  if (currentCheck !== null) {
    while (activityDates.has(currentCheck)) {
      streak++
      currentCheck -= 86400000
    }
  }
  return streak
}


export function streakAtRisk(answeredAtIso: string[], now = Date.now()): boolean {
  const activityDates = new Set<number>()
  for (const iso of answeredAtIso) {
    const t = Date.parse(iso)
    if (Number.isFinite(t)) activityDates.add(new Date(t).setHours(0, 0, 0, 0))
  }
  const today = new Date(now).setHours(0, 0, 0, 0)
  const yesterday = today - 86400000
  if (activityDates.has(today)) return false
  if (!activityDates.has(yesterday)) return false
  return calcStreakDays(answeredAtIso, now) >= 2
}

export function daysSince(iso: string | null | undefined, now = Date.now()): number | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return null
  return Math.max(0, Math.floor((now - t) / 86400000))
}


export function getContinueTarget(
  answeredQuestionIds: Set<string>,
  appUrl: string
): ContinueTarget {
  let best: {
    slug: string
    name: string
    done: number
    total: number
    nextId: string
  } | null = null

  for (const cat of catalogCategories) {
    const ids = questionsByCategory[cat.slug] ?? []
    if (ids.length === 0) continue
    const done = ids.filter((id) => answeredQuestionIds.has(id)).length
    if (done >= ids.length) continue
    const nextId = ids.find((id) => !answeredQuestionIds.has(id))
    if (!nextId) continue
    if (!best || done / ids.length > best.done / best.total || (done / ids.length === best.done / best.total && done > best.done)) {
      best = { slug: cat.slug, name: cat.name, done, total: ids.length, nextId }
    }
  }

  const base = appUrl.replace(/\/$/, '')
  if (best) {
    return {
      continue_topic: best.name,
      continue_progress: `${best.done}/${best.total}`,
      continue_url: `${base}/category/${best.slug}/question/${best.nextId}`,
      continue_category_slug: best.slug,
    }
  }

  const first = catalogCategories[0]
  const ids = questionsByCategory[first.slug] ?? []
  return {
    continue_topic: first.name,
    continue_progress: `${ids.length}/${ids.length}`,
    continue_url: `${base}/fated-five`,
    continue_category_slug: first.slug,
  }
}

export function categoryProgressTraits(
  answeredQuestionIds: Set<string>
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const cat of catalogCategories) {
    const ids = questionsByCategory[cat.slug] ?? []
    const done = ids.filter((id) => answeredQuestionIds.has(id)).length
    out[`progress_${cat.slug.replace(/-/g, '_')}`] = `${done}/${ids.length}`
  }
  return out
}

export function rankTraits(totalXp: number) {
  const rank = rankForXp(totalXp)
  const next = nextRank(totalXp)
  return {
    total_xp: totalXp,
    rank: rank.name,
    next_rank: next?.name ?? null,
    xp_to_next_rank: next ? next.minXp - totalXp : 0,
  }
}
