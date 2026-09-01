import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import {
  getCommunityQuests,
  type CommunityQuestCard,
  type CommunityQuestSort,
} from '../lib/userQuests'
import { questHref, saveCommunityPlaylist } from '../lib/communityNav'
import { useAuth } from '../context/AuthContext'
import { AuthModal } from '../components/AuthModal'
import { difficultyLabel } from '../lib/quiz'
import { ZULIP_COMMUNITY_URL, DISCORD_BOT_INVITE_URL } from '../lib/constants'

function difficultyClass(d: number) {
  return d === 1 ? 'text-grass' : d === 2 ? 'text-gold' : 'text-rust-orange'
}

const SORT_OPTIONS: { value: CommunityQuestSort; label: string }[] = [
  { value: 'most_solved', label: 'Most solved' },
  { value: 'least_solved', label: 'Least solved' },
  { value: 'most_attempts', label: 'Most attempted' },
  { value: 'least_attempts', label: 'Least attempted' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

export function CommunityPage() {
  const { user } = useAuth()
  const [quests, setQuests] = useState<CommunityQuestCard[]>([])
  const [sort, setSort] = useState<CommunityQuestSort>('most_solved')
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getCommunityQuests(100, { sort })
      .then((rows) => {
        if (cancelled) return
        setQuests(rows)
        saveCommunityPlaylist(rows.map((q) => ({ username: q.username, slug: q.slug })))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [sort])

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Most solved'

  return (
    <div className="space-y-5">
      <SEO
        title="Community Quests"
        description="Browse Rust quizzes created by the Cratery community. Solve them, then create your own."
      />

      <PixelPanel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h1 className="font-pixel text-sm uppercase tracking-[0.02em] text-ink">
              Community quests
            </h1>
            <p className="mt-1 text-sm text-ink-dim">
              Quizzes and coding challenges by rustaceans. Pick one, solve it, or publish your own.
              For curated topic quizzes, see{' '}
              <Link to="/quests" className="text-rust-orange hover:underline">
                official quests
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={ZULIP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PixelButton size="sm" className="!bg-[#5063f0] hover:!bg-[#3d4ec7] !text-white !border-black">
                Join Zulip
              </PixelButton>
            </a>
            <a
              href={DISCORD_BOT_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PixelButton size="sm" variant="secondary">
                + Discord Bot
              </PixelButton>
            </a>
            {user ? (
              <Link to="/create">
                <PixelButton size="sm" variant="primary">Create a quest</PixelButton>
              </Link>
            ) : (
              <PixelButton size="sm" onClick={() => setShowAuth(true)}>Sign in to create</PixelButton>
            )}
          </div>
        </div>
      </PixelPanel>

      <PixelPanel>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b-2 border-night-edge pb-2">
          <div className="font-pixel text-xs text-ink-dim">{sortLabel}</div>
          <label className="flex items-center gap-2">
            <span className="font-pixel text-[9px] uppercase text-ink-faint">Order</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as CommunityQuestSort)}
              className="border-3 border-black/60 bg-night-raised px-2 py-1.5 font-code text-base text-ink shadow-pixel focus:outline-none focus:ring-2 focus:ring-diamond"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <div className="animate-pulse font-code text-lg text-ink-dim">Loading quests…</div>
        ) : quests.length === 0 ? (
          <div className="space-y-3 py-4 text-center">
            <p className="read-body text-xl text-ink-dim">No community quests yet. Be the first.</p>
            {user ? (
              <Link to="/create">
                <PixelButton>Create a quest</PixelButton>
              </Link>
            ) : (
              <PixelButton onClick={() => setShowAuth(true)}>Sign in to create</PixelButton>
            )}
          </div>
        ) : (
          <ul className="grid gap-2">
            {quests.map((q) => {
              const href = questHref({ username: q.username, slug: q.slug }, 'community')
              return (
                <li
                  key={q.id}
                  className="pixel-ui flex items-center gap-2.5 sm:gap-3 border-3 border-night-edge bg-night-raised p-2.5 sm:p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-pixel-lg"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={href}
                      className="font-pixel text-[9px] sm:text-[10px] uppercase leading-relaxed text-ink hover:text-rust-orange break-words"
                    >
                      {q.title}
                    </Link>
                    <div className="mt-1 font-code text-xs sm:text-base text-ink-dim">
                      by{' '}
                      <Link to={`/${q.username}`} className="text-rust-orange hover:underline">
                        {q.username}
                      </Link>
                      <span className="text-ink-faint">
                        {' '}
                        · {q.kind === 'coding' ? 'coding' : 'quiz'}
                        {q.kind === 'coding'
                          ? null
                          : ` · ${q.solve_count} attempts · ${q.correct_count} solved`}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={href}
                    className={`shrink-0 font-pixel text-[9px] uppercase ${difficultyClass(q.difficulty)}`}
                  >
                    {difficultyLabel(q.difficulty)}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </PixelPanel>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialTab="signup"
      />
    </div>
  )
}
