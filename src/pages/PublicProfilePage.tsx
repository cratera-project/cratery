import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { getPublicProfile, type PublicProfile } from '../lib/userQuests'
import { questHref, saveUserPlaylist } from '../lib/communityNav'
import { isReservedUsername } from '../lib/reserved'
import { rankForXp } from '../lib/ranks'
import { useAuth } from '../context/AuthContext'
import { difficultyLabel } from '../lib/quiz'
import { ProfileCard } from '../components/ProfileCard'
import { profileOgImageUrl } from '../lib/share'

export function PublicProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()
  const name = username ?? ''
  const reserved = isReservedUsername(name)
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(() => !reserved)

  useEffect(() => {
    if (reserved) {
      return
    }
    let cancelled = false
    getPublicProfile(name)
      .then((p) => {
        if (cancelled) return
        setProfile(p)
        if (p) {
          saveUserPlaylist(
            p.username,
            p.quests.map((q) => ({ username: p.username, slug: q.slug }))
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [name, reserved])

  if (loading) {
    return (
      <PixelPanel>
        <div className="animate-pulse font-code text-lg text-ink-dim">Loading profile…</div>
      </PixelPanel>
    )
  }

  if (reserved || !profile) {
    return (
      <PixelPanel title="Rustacean not found">
        <SEO title="Rustacean Not Found" noIndex />
        <p className="read-body text-lg text-ink-dim">
          No rustacean named <span className="text-ink">{name}</span> yet.
        </p>
        <div className="mt-4">
          <Link to="/">
            <PixelButton>Home</PixelButton>
          </Link>
        </div>
      </PixelPanel>
    )
  }

  const rank = rankForXp(profile.stats.total_xp)
  const isSelf = user?.username?.toLowerCase() === profile.username.toLowerCase()
  const ogVersion = `${profile.stats.total_xp}-${rank.name}`

  return (
    <div className="space-y-6">
      <SEO
        title={`${profile.username} · ${rank.name} · ${profile.stats.total_xp} XP`}
        description={`${profile.username} is a ${rank.name} on Cratery with ${profile.stats.total_xp} XP, ${profile.stats.quests_authored ?? profile.quests.length} authored quests, and ${profile.stats.solves_taught ?? 0} rustaceans taught.`}
        image={profileOgImageUrl(profile.username, ogVersion)}
      />

      <ProfileCard
        userId={profile.id || profile.username}
        username={profile.username}
        avatar={profile.avatar}
        xp={profile.stats.total_xp}
        questsAuthored={profile.stats.quests_authored ?? profile.quests.length}
        solvesTaught={profile.stats.solves_taught ?? 0}
        rivalWins={profile.stats.rival_wins ?? 0}
        rivalLosses={profile.stats.rival_losses ?? 0}
        isSelf={isSelf}
      />

      <PixelPanel title={`Quests by ${profile.username}`}>
        {profile.quests.length === 0 ? (
          <p className="read-body text-lg text-ink-dim">No quests authored yet.</p>
        ) : (
          <div className="grid gap-2">
            {profile.quests.map((q) => (
              <Link
                key={q.id}
                to={questHref({ username: profile.username, slug: q.slug }, 'user')}
                className="block"
              >
                <div className="pixel-ui border-3 border-night-edge bg-night-raised p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-pixel-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-pixel text-[10px] uppercase text-ink-dim">
                        {difficultyLabel(q.difficulty)}
                      </div>
                      <div className="read-body text-xl text-ink">{q.title}</div>
                    </div>
                    <div className="shrink-0 text-right font-code text-base text-ink-faint">
                      {q.solve_count} attempts · {q.correct_count} solved
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PixelPanel>
    </div>
  )
}
