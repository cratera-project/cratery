import type { AvatarConfig } from '../../src/lib/avatar'
import { rankForXp } from '../../src/lib/ranks'
import { createSupabaseClient, type Env } from './supabase'

export type ProfileStats = {
    total_xp: number
    solve_xp: number
    author_xp: number
    total_quests: number
    correct_count: number
    wrong_count: number
    quests_authored: number
    solves_taught: number
    rival_wins: number
    rival_losses: number
}

export type PublicProfile = {
    id: string
    username: string
    created_at: string
    avatar?: AvatarConfig | null
    stats: ProfileStats
    quests: Array<{
        id: string
        slug: string
        title: string
        difficulty: number
        created_at: string
        solve_count: number
        correct_count: number
    }>
}

const EMPTY_STATS: ProfileStats = {
    total_xp: 0,
    solve_xp: 0,
    author_xp: 0,
    total_quests: 0,
    correct_count: 0,
    wrong_count: 0,
    quests_authored: 0,
    solves_taught: 0,
    rival_wins: 0,
    rival_losses: 0,
}

export function normalizeStats(raw: unknown): ProfileStats {
    const s = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
    const n = (key: string) => {
        const v = Number(s[key])
        return Number.isFinite(v) ? v : 0
    }
    const solve = n('solve_xp') || n('total_xp')
    const author = n('author_xp')
    return {
        total_xp: n('total_xp') || solve + author,
        solve_xp: solve,
        author_xp: author,
        total_quests: n('total_quests'),
        correct_count: n('correct_count'),
        wrong_count: n('wrong_count'),
        quests_authored: n('quests_authored'),
        solves_taught: n('solves_taught'),
        rival_wins: n('rival_wins'),
        rival_losses: n('rival_losses'),
    }
}

export async function loadPublicProfile(env: Env, username: string): Promise<PublicProfile | null> {
    const supabase = createSupabaseClient(env)
    const { data, error } = await supabase.rpc('get_public_profile', { p_username: username })
    if (error || !data || typeof data !== 'object') return null
    const row = data as PublicProfile
    if (!row.username) return null
    return {
        ...row,
        stats: { ...EMPTY_STATS, ...normalizeStats(row.stats) },
        quests: Array.isArray(row.quests) ? row.quests : [],
    }
}

export function ogCacheKey(profile: PublicProfile): string {
    const s = profile.stats
    return [
        s.total_xp,
        rankForXp(s.total_xp).name,
        s.quests_authored,
        s.solves_taught,
        s.rival_wins,
        s.rival_losses,
        profile.avatar?.seed ?? '',
    ].join('-')
}
