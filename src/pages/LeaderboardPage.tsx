import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { getLeaderboard, getCreatorLeaderboard, type LeaderboardEntry, type CreatorLeaderboardEntry } from '../lib/userQuests'
import { rankForXp } from '../lib/ranks'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { avatarUrl } from '../lib/avatar'

export function LeaderboardPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'solvers' | 'creators'>('solvers')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [creators, setCreators] = useState<CreatorLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const load = tab === 'creators' ? getCreatorLeaderboard(50) : getLeaderboard(50)
    load
      .then((rows) => {
        if (cancelled) return
        if (tab === 'creators') setCreators(rows as CreatorLeaderboardEntry[])
        else setEntries(rows as LeaderboardEntry[])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tab])

  return (
    <div className="space-y-5">
      <SEO
        title="Leaderboard: Top Rustaceans"
        description="Top Cratery rustaceans ranked by XP earned from solving Rust quests."
      />

      <PixelPanel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-pixel text-sm uppercase tracking-[0.02em] text-ink">Leaderboard</h1>
            <p className="mt-1 text-sm text-ink-dim">
              {tab === 'creators'
                ? 'Author XP for publishing quests and for each rustacean you teach.'
                : 'Solve XP plus author XP. Climb from Novice to Grandmaster.'}
            </p>
          </div>
          <div className="flex gap-2">
            <PixelButton size="sm" variant={tab === 'solvers' ? 'primary' : 'secondary'} onClick={() => setTab('solvers')}>
              Solvers
            </PixelButton>
            <PixelButton size="sm" variant={tab === 'creators' ? 'primary' : 'secondary'} onClick={() => setTab('creators')}>
              Creators
            </PixelButton>
          </div>
        </div>
      </PixelPanel>

      <PixelPanel title={tab === 'creators' ? 'Top creators' : 'Top rustaceans'}>
        {loading ? (
          <div className="animate-pulse font-code text-lg text-ink-dim">Loading ranks…</div>
        ) : tab === 'creators' ? (
          !isSupabaseConfigured || creators.length === 0 ? (
            <div className="space-y-3 py-4 text-center">
              <p className="read-body text-xl text-ink-dim">
                No creators ranked yet. Publish a quest and teach someone.
              </p>
              <Link to="/create">
                <PixelButton>Create a quest</PixelButton>
              </Link>
            </div>
          ) : (
            <div className="grid gap-2">
              {creators.map((entry, i) => {
                const isSelf = user?.username?.toLowerCase() === entry.username.toLowerCase()
                return (
                  <Link key={entry.username} to={`/${entry.username}`} className="block">
                    <div
                      className={`pixel-ui flex items-center gap-2 sm:gap-3 border-3 p-2.5 sm:p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-pixel-lg ${
                        isSelf
                          ? 'border-rust-orange bg-rust-orange/10'
                          : 'border-night-edge bg-night-raised hover:border-ink-faint'
                      }`}
                    >
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center border-3 border-black/60 bg-night font-pixel text-[9px] sm:text-[10px] text-ink-dim">
                        {i + 1}
                      </div>
                      <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden border-2 border-black/60 bg-night">
                        <img
                          src={avatarUrl(entry.id || entry.username, entry.avatar)}
                          alt=""
                          className="h-full w-full"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 font-pixel text-[9px] sm:text-[10px] uppercase text-ink">
                          <span className="truncate">{entry.username}</span>
                          {isSelf ? <span className="text-rust-orange shrink-0"> (you)</span> : null}
                        </div>
                        <div className="font-code text-xs sm:text-base text-ink-dim truncate">
                          {entry.quests_authored} quests · {entry.solves_taught} taught
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-pixel text-[9px] sm:text-[10px] text-gold">{entry.author_xp} XP</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        ) : !isSupabaseConfigured || entries.length === 0 ? (
          <div className="space-y-3 py-4 text-center">
            <p className="read-body text-xl text-ink-dim">
              No ranked rustaceans yet. Be the first to answer a quest while signed in.
            </p>
            <Link to="/">
              <PixelButton>Start a topic</PixelButton>
            </Link>
          </div>
        ) : (
          <div className="grid gap-2">
            {entries.map((entry, i) => {
              const rank = rankForXp(entry.total_xp)
              const isSelf = user?.username?.toLowerCase() === entry.username.toLowerCase()
              return (
                <Link key={entry.username} to={`/${entry.username}`} className="block">
                  <div
                    className={`pixel-ui flex items-center gap-2 sm:gap-3 border-3 p-2.5 sm:p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-pixel-lg ${
                      isSelf
                        ? 'border-rust-orange bg-rust-orange/10'
                        : 'border-night-edge bg-night-raised hover:border-ink-faint'
                    }`}
                  >
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center border-3 border-black/60 bg-night font-pixel text-[9px] sm:text-[10px] text-ink-dim">
                      {i + 1}
                    </div>
                    <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden border-2 border-black/60 bg-night">
                      <img
                        src={avatarUrl(entry.id || entry.username, entry.avatar)}
                        alt=""
                        className="h-full w-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 font-pixel text-[9px] sm:text-[10px] uppercase text-ink">
                        <span className="truncate">{entry.username}</span>
                        {isSelf ? <span className="text-rust-orange shrink-0"> (you)</span> : null}
                      </div>
                      <div className="font-code text-xs sm:text-base text-ink-dim">{rank.name}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-pixel text-[9px] sm:text-[10px] text-gold">{entry.total_xp} XP</div>
                      <div className="font-code text-xs sm:text-base text-ink-faint">
                        {entry.correct_count} correct
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </PixelPanel>
    </div>
  )
}
