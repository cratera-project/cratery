import type { SupabaseClient } from '@supabase/supabase-js'
import { rankForXp } from '../../../src/lib/ranks'
import { loadTotalXp } from '../xp'
import { loadSolverLeaderboard } from '../leaderboard'

export type DiscordUserScore = {
  discord_id: string
  username: string
  xp: number
  mcq_solves: number
  coding_solves: number
  race_wins: number
  last_active: string
}

export type CrateryUserStats = {
  userId: string
  username: string
  totalXp: number
  rank: string
  solvedCount: number
}

export type UnifiedUserStats = {
  discordStats: DiscordUserScore | null
  crateryUser: CrateryUserStats | null
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}


export async function resolveCrateryUserFromApiKey(
  supabase: SupabaseClient | null,
  apiKey: string
): Promise<{ userId: string; username: string } | null> {
  if (!supabase) return null
  const clean = apiKey.trim()
  if (!clean.startsWith('cr_live_')) return null

  try {
    const keyHash = await sha256Hex(clean)
    const { data: keyData, error: keyErr } = await supabase
      .from('custom_api_keys')
      .select('id, user_id')
      .eq('key_hash', keyHash)
      .maybeSingle()

    if (keyErr || !keyData?.user_id) return null

    const { data: userData, error: userErr } = await supabase
      .from('custom_users')
      .select('id, username, email_verified')
      .eq('id', keyData.user_id)
      .maybeSingle()

    if (userErr || !userData) return null
    if (userData.email_verified === false) return null

    return {
      userId: userData.id,
      username: userData.username,
    }
  } catch (err) {
    console.error('[discord-db] Error resolving Cratery user from API key:', err)
    return null
  }
}

export async function getDiscordUserApiKey(
  supabase: SupabaseClient | null,
  discordId: string
): Promise<string | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('discord_user_keys')
      .select('api_key')
      .eq('discord_id', discordId)
      .maybeSingle()

    if (error || !data) return null
    return data.api_key
  } catch {
    return null
  }
}

export async function setDiscordUserApiKey(
  supabase: SupabaseClient | null,
  discordId: string,
  apiKey: string
): Promise<{ success: boolean; username?: string; error?: string }> {
  if (!supabase) return { success: false, error: 'Database unavailable' }
  const clean = apiKey.trim()
  if (!clean.startsWith('cr_live_')) {
    return {
      success: false,
      error: 'Invalid key format. Cratera API keys start with `cr_live_`. Get one at cratery.cratera.org/developer',
    }
  }

  const crateryUser = await resolveCrateryUserFromApiKey(supabase, clean)
  if (!crateryUser) {
    return {
      success: false,
      error: 'API key not recognized or email unverified on Cratery. Check cratery.cratera.org/developer',
    }
  }

  try {
    const { error } = await supabase.from('discord_user_keys').upsert(
      {
        discord_id: discordId,
        api_key: clean,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'discord_id' }
    )
    if (error) {
      console.error('[discord-db] Failed to upsert user API key:', error)
      return { success: false, error: 'Failed to save key' }
    }
    return { success: true, username: crateryUser.username }
  } catch (err) {
    console.error('[discord-db] Failed to set user API key:', err)
    return { success: false, error: 'Failed to save key' }
  }
}

export async function removeDiscordUserApiKey(
  supabase: SupabaseClient | null,
  discordId: string
): Promise<boolean> {
  if (!supabase) return false
  try {
    const { error } = await supabase
      .from('discord_user_keys')
      .delete()
      .eq('discord_id', discordId)
    return !error
  } catch {
    return false
  }
}

export async function recordDiscordScore(
  supabase: SupabaseClient | null,
  discordId: string,
  username: string,
  award: { xp: number; mcqSolve?: boolean; codingSolve?: boolean; raceWin?: boolean }
): Promise<void> {
  if (!supabase) return
  try {
    const { data: prev } = await supabase
      .from('discord_quiz_scores')
      .select('*')
      .eq('discord_id', discordId)
      .maybeSingle()

    const currentXp = Number(prev?.xp || 0) + award.xp
    const currentMcq = Number(prev?.mcq_solves || 0) + (award.mcqSolve ? 1 : 0)
    const currentCoding = Number(prev?.coding_solves || 0) + (award.codingSolve ? 1 : 0)
    const currentWins = Number(prev?.race_wins || 0) + (award.raceWin ? 1 : 0)

    await supabase.from('discord_quiz_scores').upsert(
      {
        discord_id: discordId,
        username,
        xp: currentXp,
        mcq_solves: currentMcq,
        coding_solves: currentCoding,
        race_wins: currentWins,
        last_active: new Date().toISOString(),
      },
      { onConflict: 'discord_id' }
    )
  } catch (err) {
    console.error('[discord-db] Failed to record score:', err)
  }
}


export async function syncDiscordProgressToCratery(
  supabase: SupabaseClient | null,
  discordId: string,
  questionId: string,
  categorySlug: string,
  isCorrect: boolean,
  xpEarned: number,
  selectedIndex = 0
): Promise<{ synced: boolean; totalXp?: number; crateryUsername?: string }> {
  if (!supabase) return { synced: false }

  try {
    const apiKey = await getDiscordUserApiKey(supabase, discordId)
    if (!apiKey) return { synced: false }

    const crateryUser = await resolveCrateryUserFromApiKey(supabase, apiKey)
    if (!crateryUser) return { synced: false }

    
    const { data: existing } = await supabase
      .from('quest_answers')
      .select('id, is_correct, xp_earned')
      .eq('user_id', crateryUser.userId)
      .eq('question_id', questionId)
      .maybeSingle()

    const finalXp = isCorrect ? xpEarned : 0

    if (!existing) {
      await supabase.from('quest_answers').insert({
        user_id: crateryUser.userId,
        question_id: questionId,
        category_slug: categorySlug,
        selected_index: selectedIndex,
        is_correct: isCorrect,
        xp_earned: finalXp,
        answered_at: new Date().toISOString(),
      })
    } else if (!existing.is_correct && isCorrect) {
      
      await supabase
        .from('quest_answers')
        .update({
          selected_index: selectedIndex,
          is_correct: true,
          xp_earned: finalXp,
          answered_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    }

    const totalXp = await loadTotalXp(supabase, crateryUser.userId)
    return {
      synced: true,
      totalXp,
      crateryUsername: crateryUser.username,
    }
  } catch (err) {
    console.error('[discord-db] Failed to sync progress to Cratery web app:', err)
    return { synced: false }
  }
}

export async function getDiscordUserStats(
  supabase: SupabaseClient | null,
  discordId: string
): Promise<DiscordUserScore | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('discord_quiz_scores')
      .select('*')
      .eq('discord_id', discordId)
      .maybeSingle()

    if (error || !data) return null
    return data as DiscordUserScore
  } catch {
    return null
  }
}

export async function getUnifiedUserStats(
  supabase: SupabaseClient | null,
  discordId: string
): Promise<UnifiedUserStats> {
  const discordStats = await getDiscordUserStats(supabase, discordId)
  if (!supabase) return { discordStats, crateryUser: null }

  try {
    const apiKey = await getDiscordUserApiKey(supabase, discordId)
    if (!apiKey) return { discordStats, crateryUser: null }

    const crateryUser = await resolveCrateryUserFromApiKey(supabase, apiKey)
    if (!crateryUser) return { discordStats, crateryUser: null }

    const totalXp = await loadTotalXp(supabase, crateryUser.userId)
    const rank = rankForXp(totalXp).name

    const { count } = await supabase
      .from('quest_answers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', crateryUser.userId)
      .eq('is_correct', true)

    return {
      discordStats,
      crateryUser: {
        userId: crateryUser.userId,
        username: crateryUser.username,
        totalXp,
        rank,
        solvedCount: count ?? 0,
      },
    }
  } catch (err) {
    console.error('[discord-db] Error fetching unified stats:', err)
    return { discordStats, crateryUser: null }
  }
}

export type CrateryLeaderboardRow = {
  id: string
  username: string
  total_xp: number
  total_quests: number
  correct_count: number
}

export async function getCrateryLeaderboard(
  supabase: SupabaseClient | null,
  limit = 10
): Promise<CrateryLeaderboardRow[]> {
  if (!supabase) return []
  try {
    const rows = await loadSolverLeaderboard(supabase, limit)
    return rows.map((row) => ({
      id: row.id,
      username: row.username,
      total_xp: row.total_xp,
      total_quests: row.total_quests,
      correct_count: row.correct_count,
    }))
  } catch (err) {
    console.error('[discord-db] Failed to load Cratery leaderboard:', err)
    return []
  }
}

export async function getDiscordLeaderboard(
  supabase: SupabaseClient | null,
  limit = 10
): Promise<DiscordUserScore[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('discord_quiz_scores')
      .select('*')
      .order('xp', { ascending: false })
      .order('race_wins', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data as DiscordUserScore[]
  } catch {
    return []
  }
}
