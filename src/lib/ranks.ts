export type Rank = {
  name: string
  minXp: number
}


export const RANKS: Rank[] = [
  { name: 'Novice', minXp: 0 },
  { name: 'Apprentice', minXp: 100 },
  { name: 'Adept', minXp: 300 },
  { name: 'Expert', minXp: 600 },
  { name: 'Master', minXp: 1000 },
  { name: 'Grandmaster', minXp: 1500 },
]

export function rankForXp(xp: number): Rank {
  let current = RANKS[0]
  for (const rank of RANKS) {
    if (xp >= rank.minXp) current = rank
  }
  return current
}

export function nextRank(xp: number): Rank | null {
  return RANKS.find((r) => r.minXp > xp) ?? null
}
