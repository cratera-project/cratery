import { useState } from 'react'
import { Link } from 'react-router-dom'
import { avatarUrl } from '../lib/avatar'
import type { AvatarConfig } from '../lib/avatar'
import { nextRank, rankForXp } from '../lib/ranks'
import { ShareBar } from './ShareBar'
import { PixelButton } from './ui/PixelButton'
import { absoluteUrl, profileOgImageUrl } from '../lib/share'
import { ChallengeButton } from './ChallengeButton'
import { GitHubBadgeModal } from './GitHubBadgeModal'

type Props = {
  userId: string
  username: string
  avatar?: AvatarConfig | null
  xp: number
  questsAuthored?: number
  solvesTaught?: number
  rivalWins?: number
  rivalLosses?: number
  isSelf?: boolean
  showChallenge?: boolean
}

export function ProfileCard({
  userId,
  username,
  avatar,
  xp,
  questsAuthored = 0,
  solvesTaught = 0,
  rivalWins = 0,
  rivalLosses = 0,
  isSelf = false,
  showChallenge = true,
}: Props) {
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const rank = rankForXp(xp)
  const upcoming = nextRank(xp)
  const pfp = avatarUrl(userId || username, avatar)
  const url = absoluteUrl(`/${username}`)
  const og = profileOgImageUrl(username, `${xp}-${rank.name}`)

  return (
    <div className="pixel-ui overflow-hidden border-4 border-black/60 bg-night-panel shadow-pixel">
      <div className="h-3 bg-rust-orange" />
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5 sm:items-start">
        <div className="mx-auto h-20 w-20 shrink-0 overflow-hidden border-4 border-black/60 bg-night-raised sm:mx-0 sm:h-24 sm:w-24">
          <img src={pfp} alt={username} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
            <h1 className="font-pixel text-sm uppercase text-ink">{username}</h1>
            <span className="border-3 border-rust-orange bg-rust-orange/15 px-2 py-1 font-pixel text-[9px] uppercase text-rust-orange">
              {rank.name}
            </span>
          </div>
          <p className="mt-2 font-pixel text-xs uppercase text-gold">{xp} XP</p>
          <p className="mt-2 font-code text-base sm:text-lg text-ink-dim">
            {questsAuthored} quests authored · {solvesTaught} taught · {rivalWins}–{rivalLosses} vs
          </p>
          {upcoming ? (
            <p className="mt-1 font-code text-sm sm:text-base text-ink-faint">
              {upcoming.minXp - xp} XP to {upcoming.name}
            </p>
          ) : null}
          <p className="mt-2 font-code text-xs sm:text-base text-ink-faint break-all">{url.replace(/^https:\/\//, '')}</p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-center gap-2 sm:flex-col sm:items-end">
          <ShareBar url={url} text={`${username} is a ${rank.name} on Cratery with ${xp} XP.`} />
          <PixelButton
            size="sm"
            variant="secondary"
            onClick={() => setShowBadgeModal(true)}
          >
            GitHub Badge
          </PixelButton>
          {!isSelf && showChallenge ? (
            <ChallengeButton opponentUsername={username} size="sm" />
          ) : null}
          {isSelf ? (
            <Link to="/profile">
              <PixelButton size="sm" variant="secondary">
                Edit profile
              </PixelButton>
            </Link>
          ) : null}
        </div>
      </div>
      <img src={og} alt="" className="hidden" />
      <GitHubBadgeModal
        isOpen={showBadgeModal}
        username={username}
        onClose={() => setShowBadgeModal(false)}
      />
    </div>
  )
}
