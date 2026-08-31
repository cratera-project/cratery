import type { SupabaseClient } from '@supabase/supabase-js'

export const PUBLISH_XP = 25
export const SOLVE_DRIP_XP = 5

export async function awardAuthorXp(
    supabase: SupabaseClient,
    userId: string,
    amount: number
): Promise<number> {
    const { data, error } = await supabase.rpc('award_author_xp', {
        p_user_id: userId,
        p_amount: amount,
    })
    if (error) {
        console.error('award_author_xp failed:', error)
        return 0
    }
    return Number(data) || 0
}

export async function insertNotification(
    supabase: SupabaseClient,
    userId: string,
    kind: 'quest_solved' | 'rival_invite' | 'rival_result',
    payload: Record<string, unknown>
): Promise<void> {
    const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        kind,
        payload,
    })
    if (error) console.error('insert notification failed:', error)
}

export async function loadTotalXp(supabase: SupabaseClient, userId: string): Promise<number> {
    const { data, error } = await supabase.rpc('get_user_stats', { p_user_id: userId })
    if (!error && data && typeof data === 'object' && typeof (data as { total_xp?: unknown }).total_xp === 'number') {
        return Number((data as { total_xp?: number }).total_xp) || 0
    }

    
    try {
        const [answersRes, profileRes] = await Promise.all([
            supabase.from('quest_answers').select('xp_earned').eq('user_id', userId),
            supabase.from('profiles').select('author_xp').eq('id', userId).maybeSingle(),
        ])
        const solveXp = (answersRes.data || []).reduce(
            (acc: number, row: { xp_earned?: unknown }) => acc + (Number(row.xp_earned) || 0),
            0
        )
        const authorXp = Number(profileRes.data?.author_xp) || 0
        return Math.max(0, solveXp + authorXp)
    } catch {
        return 0
    }
}
