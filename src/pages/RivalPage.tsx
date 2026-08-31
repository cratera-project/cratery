import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { AuthModal } from '../components/AuthModal'
import { ShareBar } from '../components/ShareBar'
import { useAuth } from '../context/AuthContext'
import { questions } from '../data/questions'
import { acceptRival, getRival, inviteUrl, type RivalMatch } from '../lib/rivals'
import { avatarUrl } from '../lib/avatar'
import { copyText } from '../lib/share'

function itemTitle(questionId: string, fallback?: string): string {
  if (fallback) return fallback
  return questions.find((q) => q.id === questionId)?.title ?? questionId
}

function itemHref(href: string, rivalId: string): string {
  const join = href.includes('?') ? '&' : '?'
  return `${href}${join}rival=${encodeURIComponent(rivalId)}`
}

export function RivalPage() {
  const { rivalId } = useParams()
  const { user } = useAuth()
  const [match, setMatch] = useState<RivalMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [copied, setCopied] = useState(false)

  const id = rivalId ?? ''

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    getRival(id)
      .then((row) => {
        if (cancelled) return
        setMatch(row)
        if (!row) setError('Rival not found')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, user?.id])

  const youDone = useMemo(() => {
    if (!match) return false
    return match.answered.length >= match.items.length && match.items.length > 0
  }, [match])

  const nextItem = match?.items.find((it) => !match.answered.includes(it.question_id))

  const copyInvite = async () => {
    const ok = await copyText(inviteUrl(id))
    setCopied(ok)
  }

  const accept = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    const res = await acceptRival(id)
    if (res.error || !res.rival) {
      setError(res.error ?? 'Could not accept')
      return
    }
    setMatch(res.rival)
  }

  if (loading) {
    return (
      <PixelPanel>
        <div className="animate-pulse font-code text-lg text-ink-dim">Loading rival…</div>
      </PixelPanel>
    )
  }

  if (!match) {
    return (
      <PixelPanel title="Rival not found">
        <SEO title="Rival Not Found" noIndex />
        <p className="read-body text-lg text-ink-dim">{error ?? 'This challenge does not exist.'}</p>
        <div className="mt-4">
          <Link to="/">
            <PixelButton>Home</PixelButton>
          </Link>
        </div>
      </PixelPanel>
    )
  }

  const left = match.challenger
  const right = match.opponent
  const url = inviteUrl(match.id)

  return (
    <div className="space-y-5">
      <SEO
        title={`${left?.username ?? 'Rival'} vs ${right?.username ?? 'open'} on Cratery`}
        description="Two rustaceans, one set of quests. Sign in to accept and play."
      />

      <PixelPanel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-pixel text-[9px] uppercase tracking-wider text-rust-orange">
              Rival match
            </div>
            <h1 className="mt-2 font-pixel text-sm uppercase text-ink">
              {left?.username ?? '…'} vs {right?.username ?? 'open seat'}
            </h1>
            <p className="mt-2 font-code text-lg text-ink-dim">
              {match.status} · {match.items.length} quests · expires{' '}
              {new Date(match.expires_at).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ShareBar url={url} text="1v1 Rust quiz on Cratery. Your move." />
            <PixelButton size="sm" variant="secondary" onClick={() => void copyInvite()}>
              {copied ? 'Copied!' : 'Copy invite'}
            </PixelButton>
          </div>
        </div>
      </PixelPanel>

      <div className="grid gap-3 sm:grid-cols-2">
        <PlayerCard
          name={left?.username ?? 'Challenger'}
          avatarId={left?.id ?? 'challenger'}
          score={match.challenger_correct}
          winner={match.winner_username === left?.username}
        />
        <PlayerCard
          name={right?.username ?? 'Waiting…'}
          avatarId={right?.id ?? 'open'}
          score={match.opponent_correct}
          winner={match.winner_username === right?.username}
        />
      </div>

      {match.status === 'pending' && match.you === 'open' ? (
        <PixelPanel>
          <p className="read-body text-xl text-ink-dim">
            Sign in to take this seat. Both of you answer the same quests. Higher score wins.
          </p>
          <div className="mt-4">
            <PixelButton onClick={() => void accept()}>Accept challenge</PixelButton>
          </div>
        </PixelPanel>
      ) : null}

      {match.status === 'pending' && match.you === 'opponent' ? (
        <PixelPanel>
          <p className="read-body text-xl text-ink-dim">This challenge is for you.</p>
          <div className="mt-4">
            <PixelButton onClick={() => void accept()}>Accept</PixelButton>
          </div>
        </PixelPanel>
      ) : null}

      {match.status === 'pending' && match.you === 'challenger' ? (
        <PixelPanel>
          <p className="read-body text-xl text-ink-dim">
            Invite copied into the link above. Paste it in Slack. They must be logged in to accept.
          </p>
        </PixelPanel>
      ) : null}

      {match.status === 'active' && (match.you === 'challenger' || match.you === 'opponent') ? (
        <PixelPanel>
          {youDone ? (
            <p className="read-body text-xl text-ink-dim">
              You are done. Waiting on the other rustacean.
            </p>
          ) : nextItem ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="read-body text-xl text-ink-dim">Your next quest is ready.</p>
              <Link to={itemHref(nextItem.href, match.id)}>
                <PixelButton>Play next →</PixelButton>
              </Link>
            </div>
          ) : null}
        </PixelPanel>
      ) : null}

      {match.status === 'complete' ? (
        <PixelPanel className="border-gold">
          <div className="font-pixel text-sm uppercase text-gold">
            {match.winner_username ? `${match.winner_username} wins` : 'Draw'}
          </div>
          <p className="mt-2 read-body text-xl text-ink-dim">
            {match.challenger_correct}–{match.opponent_correct}. Put that on a profile card.
          </p>
        </PixelPanel>
      ) : null}

      <PixelPanel title="The set">
        <ul className="grid gap-2">
          {match.items.map((it, i) => {
            const done = match.answered.includes(it.question_id)
            return (
              <li key={it.question_id}>
                <Link
                  to={itemHref(it.href, match.id)}
                  className="pixel-ui flex items-center gap-2.5 sm:gap-3 border-3 border-night-edge bg-night-raised p-2.5 sm:p-3 shadow-pixel hover:border-ink-faint"
                >
                  <span className="font-pixel text-[9px] sm:text-[10px] text-ink-dim">{i + 1}</span>
                  <span className="min-w-0 flex-1 font-pixel text-[9px] sm:text-[10px] uppercase text-ink break-words">
                    {itemTitle(it.question_id, it.title)}
                  </span>
                  <span className="font-code text-xs sm:text-base text-ink-faint">{done ? 'done' : 'open'}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </PixelPanel>

      {error ? <p className="font-code text-base text-redstone">{error}</p> : null}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialTab="signup" />
    </div>
  )
}

function PlayerCard({
  name,
  avatarId,
  score,
  winner,
}: {
  name: string
  avatarId: string
  score: number
  winner: boolean
}) {
  return (
    <div
      className={`pixel-ui border-4 p-4 shadow-pixel ${
        winner ? 'border-gold bg-gold/10' : 'border-black/60 bg-night-panel'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden border-3 border-black/60">
          <img src={avatarUrl(avatarId)} alt="" className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-pixel text-[10px] uppercase text-ink">{name}</div>
          <div className="font-pixel text-xs text-gold">{score} correct</div>
        </div>
      </div>
    </div>
  )
}
