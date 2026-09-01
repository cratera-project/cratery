import type { SupabaseClient } from '@supabase/supabase-js'

export type SolverLeaderboardEntry = {
    id: string
    username: string
    avatar: unknown
    total_xp: number
    total_quests: number
    correct_count: number
    author_xp: number
}

export type CreatorLeaderboardEntry = {
    id: string
    username: string
    avatar: unknown
    author_xp: number
    quests_authored: number
    solves_taught: number
}

const PAGE = 1000

function num(value: unknown): number {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
}

async function selectAll<T>(supabase: SupabaseClient, table: string, columns: string): Promise<T[]> {
    const rows: T[] = []
    for (let from = 0; from < 20_000; from += PAGE) {
        const { data, error } = await supabase.from(table).select(columns).range(from, from + PAGE - 1)
        if (error) throw new Error(error.message)
        const page = (data || []) as T[]
        rows.push(...page)
        if (page.length < PAGE) break
    }
    return rows
}

async function loadProfiles(supabase: SupabaseClient): Promise<
    Array<{ id: string; username: string; avatar?: unknown; author_xp?: unknown }>
> {
    try {
        return await selectAll(supabase, 'profiles', 'id, username, avatar, author_xp')
    } catch {
        return await selectAll(supabase, 'profiles', 'id, username, avatar')
    }
}

export async function loadSolverLeaderboard(
    supabase: SupabaseClient,
    limit: number
): Promise<SolverLeaderboardEntry[]> {
    const cap = Math.min(100, Math.max(1, limit))
    const [profiles, answers] = await Promise.all([
        loadProfiles(supabase),
        selectAll<{ user_id: string; xp_earned?: unknown; is_correct?: unknown }>(
            supabase,
            'quest_answers',
            'user_id, xp_earned, is_correct'
        ),
    ])

    const totals = new Map<string, { xp: number; quests: number; correct: number }>()
    for (const row of answers) {
        if (!row.user_id) continue
        const cur = totals.get(row.user_id) || { xp: 0, quests: 0, correct: 0 }
        cur.xp += num(row.xp_earned)
        cur.quests += 1
        if (row.is_correct) cur.correct += 1
        totals.set(row.user_id, cur)
    }

    return profiles
        .filter((profile) => profile.id && profile.username)
        .map((profile) => {
            const stats = totals.get(profile.id)
            const authorXp = num(profile.author_xp)
            return {
                id: profile.id,
                username: profile.username,
                avatar: profile.avatar ?? null,
                total_xp: (stats?.xp || 0) + authorXp,
                total_quests: stats?.quests || 0,
                correct_count: stats?.correct || 0,
                author_xp: authorXp,
            }
        })
        .filter((row) => row.total_xp > 0)
        .sort((a, b) => b.total_xp - a.total_xp || b.correct_count - a.correct_count)
        .slice(0, cap)
}

export async function loadCreatorLeaderboard(
    supabase: SupabaseClient,
    limit: number
): Promise<CreatorLeaderboardEntry[]> {
    const cap = Math.min(100, Math.max(1, limit))
    const [profiles, quests, stats] = await Promise.all([
        loadProfiles(supabase),
        selectAll<{ id: string; author_id: string }>(supabase, 'user_quests', 'id, author_id'),
        selectAll<{ question_id: string; correct_count?: unknown }>(
            supabase,
            'quest_answer_stats',
            'question_id, correct_count'
        ),
    ])

    const taught = new Map<string, number>()
    for (const row of stats) {
        if (!row.question_id?.startsWith('uq:')) continue
        taught.set(row.question_id.slice(3), num(row.correct_count))
    }

    const byAuthor = new Map<string, { quests: number; taught: number }>()
    for (const quest of quests) {
        if (!quest.author_id || !quest.id) continue
        const cur = byAuthor.get(quest.author_id) || { quests: 0, taught: 0 }
        cur.quests += 1
        cur.taught += taught.get(quest.id) || 0
        byAuthor.set(quest.author_id, cur)
    }

    const profileById = new Map(profiles.map((profile) => [profile.id, profile]))
    const entries: CreatorLeaderboardEntry[] = []
    for (const [authorId, counts] of byAuthor) {
        const profile = profileById.get(authorId)
        if (!profile?.username) continue
        entries.push({
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar ?? null,
            author_xp: num(profile.author_xp),
            quests_authored: counts.quests,
            solves_taught: counts.taught,
        })
    }

    return entries
        .sort((a, b) => b.author_xp - a.author_xp || b.solves_taught - a.solves_taught || b.quests_authored - a.quests_authored)
        .slice(0, cap)
}
