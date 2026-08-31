

export type AvatarConfig = {
  seed: string
  backgroundColor?: string
  hair?: string
  hairColor?: string
  clothing?: string
  clothingColor?: string
  skinColor?: string
  glasses?: string | null
  accessories?: string | null
  hat?: string | null
}

export const AVATAR_BACKGROUNDS = [
  '',
  '16171b',
  '2a2d34',
  '3a3e47',
  'ce422b',
  'a0321f',
  '42a5f5',
  '00c853',
  'ffa000',
  '7b1fa2',
  'b6e3f4',
  'ffd5dc',
  'ffdfbf',
] as const

export const AVATAR_HAIR = [
  'short01',
  'short05',
  'short09',
  'short15',
  'short19',
  'long01',
  'long07',
  'long12',
  'long18',
] as const

export const AVATAR_HAIR_COLORS = [
  '28150a',
  '603a14',
  'a78961',
  'cab188',
  '611c17',
  '009bbd',
  'bd1700',
  '91cb15',
] as const

export const AVATAR_CLOTHING = [
  'variant01',
  'variant04',
  'variant08',
  'variant12',
  'variant16',
  'variant20',
  'variant23',
] as const

export const AVATAR_CLOTHING_COLORS = [
  '03396c',
  '428bca',
  '5bc0de',
  '00b159',
  'd11141',
  'ffc425',
  'ae0001',
  '2a2d34',
] as const

export const AVATAR_SKIN = [
  'ffdbac',
  'f5cfa0',
  'eac393',
  'e0b687',
  'cb9e6e',
  'b68655',
  'a26d3d',
  '8d5524',
] as const

export const AVATAR_GLASSES = [
  'dark01',
  'dark04',
  'dark07',
  'light01',
  'light04',
  'light07',
] as const

export const AVATAR_ACCESSORIES = ['variant01', 'variant02', 'variant03', 'variant04'] as const

export const AVATAR_HATS = ['variant01', 'variant03', 'variant05', 'variant07', 'variant10'] as const

const STRING_FIELDS = [
  ['backgroundColor', AVATAR_BACKGROUNDS.filter(Boolean)],
  ['hair', AVATAR_HAIR],
  ['hairColor', AVATAR_HAIR_COLORS],
  ['clothing', AVATAR_CLOTHING],
  ['clothingColor', AVATAR_CLOTHING_COLORS],
  ['skinColor', AVATAR_SKIN],
] as const

const GEAR_FIELDS = [
  ['glasses', AVATAR_GLASSES],
  ['accessories', AVATAR_ACCESSORIES],
  ['hat', AVATAR_HATS],
] as const

function allow(allowed: readonly string[], value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const v = value.replace(/^#/, '').toLowerCase()
  if (allowed.includes(v)) return v
  if (allowed.includes(value)) return value
  return undefined
}


export function sanitizeAvatarConfig(input: unknown, fallbackSeed: string): AvatarConfig | null {
  if (!input || typeof input !== 'object') return null
  const raw = input as Record<string, unknown>
  const seedRaw = typeof raw.seed === 'string' ? raw.seed.trim() : ''
  const seed = (seedRaw || fallbackSeed).slice(0, 64)
  if (!seed) return null

  const cfg: AvatarConfig = { seed }

  for (const [key, allowed] of STRING_FIELDS) {
    const v = allow(allowed, raw[key])
    if (v) cfg[key] = v
  }

  for (const [key, allowed] of GEAR_FIELDS) {
    if (!(key in raw)) continue
    if (raw[key] === null || raw[key] === '') {
      cfg[key] = null
      continue
    }
    const v = allow(allowed, raw[key])
    if (v) cfg[key] = v
  }

  return cfg
}

export function defaultAvatarConfig(userId: string): AvatarConfig {
  return { seed: userId, glasses: null, accessories: null, hat: null }
}

export function randomAvatarSeed(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `seed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function setGear(params: URLSearchParams, key: string, value: string | null | undefined) {
  if (!value) {
    params.set(`${key}Probability`, '0')
    return
  }
  params.set(`${key}Probability`, '100')
  params.set(key, value)
}


export function avatarUrl(userId: string, avatar?: AvatarConfig | null): string {
  const cfg = sanitizeAvatarConfig(avatar, userId)
  const seed = encodeURIComponent(cfg?.seed ?? userId)
  if (!cfg) return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`

  const params = new URLSearchParams()
  if (cfg.backgroundColor) params.set('backgroundColor', cfg.backgroundColor)
  if (cfg.hair) params.set('hair', cfg.hair)
  if (cfg.hairColor) params.set('hairColor', cfg.hairColor)
  if (cfg.clothing) params.set('clothing', cfg.clothing)
  if (cfg.clothingColor) params.set('clothingColor', cfg.clothingColor)
  if (cfg.skinColor) params.set('skinColor', cfg.skinColor)
  setGear(params, 'glasses', cfg.glasses)
  setGear(params, 'accessories', cfg.accessories)
  setGear(params, 'hat', cfg.hat)
  params.set('beardProbability', '0')

  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&${params}`
}
