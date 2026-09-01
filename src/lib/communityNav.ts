

export type QuestNavItem = {
  username: string
  slug: string
}

export type QuestNavSource = 'community' | 'user'

const COMMUNITY_KEY = 'cratery_nav_community'
const userKey = (username: string) => `cratery_nav_user_${username.toLowerCase()}`

function write(key: string, items: QuestNavItem[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

function read(key: string): QuestNavItem[] {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is QuestNavItem =>
        Boolean(x) &&
        typeof x === 'object' &&
        typeof (x as QuestNavItem).username === 'string' &&
        typeof (x as QuestNavItem).slug === 'string'
    )
  } catch {
    return []
  }
}

export function saveCommunityPlaylist(items: QuestNavItem[]) {
  write(COMMUNITY_KEY, items)
}

export function saveUserPlaylist(username: string, items: QuestNavItem[]) {
  write(userKey(username), items)
}

export function loadStoredPlaylist(source: QuestNavSource, username: string): QuestNavItem[] {
  if (source === 'community') return read(COMMUNITY_KEY)
  return read(userKey(username))
}

export function parseNavSource(value: string | null): QuestNavSource | null {
  if (value === 'community' || value === 'user') return value
  return null
}

export function questHref(item: QuestNavItem, source: QuestNavSource | null): string {
  const base = `/${encodeURIComponent(item.username)}/${encodeURIComponent(item.slug)}`
  if (!source) return base
  return `${base}?from=${source}`
}

export function findAdjacent(
  playlist: QuestNavItem[],
  username: string,
  slug: string
): { index: number; prev: QuestNavItem | null; next: QuestNavItem | null } {
  const index = playlist.findIndex(
    (q) => q.username.toLowerCase() === username.toLowerCase() && q.slug === slug
  )
  if (index < 0) return { index: -1, prev: null, next: null }
  return {
    index,
    prev: index > 0 ? playlist[index - 1]! : null,
    next: index < playlist.length - 1 ? playlist[index + 1]! : null,
  }
}
