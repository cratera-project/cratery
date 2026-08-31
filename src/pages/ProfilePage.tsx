import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/categories'
import { questions } from '../data/questions'
import { useProgressStore } from '../store/progressStore'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { listMyQuests, deleteUserQuest, getPublicProfile, type UserQuest } from '../lib/userQuests'
import { rankForXp } from '../lib/ranks'
import { avatarUrl } from '../lib/avatar'
import { AvatarPickerModal } from '../components/AvatarPickerModal'
import { ChallengeButton } from '../components/ChallengeButton'
import {
  listNotifications,
  markNotificationsRead,
  notificationHref,
  notificationText,
  type NotificationRow,
} from '../lib/notifications'
import { copyText, profileShareUrl } from '../lib/share'

export function ProfilePage() {
  const { user, profile, loading: authLoading, signOut, updateAvatar, updateNewsletterPreference } = useAuth()
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const [myQuests, setMyQuests] = useState<UserQuest[] | null>(null)
  const [copied, setCopied] = useState(false)
  const [editAvatar, setEditAvatar] = useState(false)
  const [newsletterOptIn, setNewsletterOptIn] = useState(() => user?.newsletter_opt_in !== false)
  const [updatingNewsletter, setUpdatingNewsletter] = useState(false)
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null)
  const [xp, setXp] = useState<number | null>(null)
  const [authored, setAuthored] = useState(0)
  const [taught, setTaught] = useState(0)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [notes, setNotes] = useState<NotificationRow[]>([])

  const username = profile?.username ?? user?.username ?? ''

  useEffect(() => {
    if (!user) return
    let cancelled = false
    useProgressStore.getState().loadUserProgress()
    listMyQuests()
      .then((quests) => {
        if (!cancelled) setMyQuests(quests)
      })
      .catch(() => {
        if (!cancelled) setMyQuests([])
      })
    getPublicProfile(username, true).then((p) => {
      if (cancelled || !p) return
      setXp(p.stats.total_xp)
      setAuthored(p.stats.quests_authored ?? p.quests.length)
      setTaught(p.stats.solves_taught ?? 0)
      setWins(p.stats.rival_wins ?? 0)
      setLosses(p.stats.rival_losses ?? 0)
    })
    listNotifications().then(({ notifications }) => {
      if (!cancelled) setNotes(notifications)
    })
    return () => {
      cancelled = true
    }
  }, [user, username])

  if (authLoading) {
    return (
      <PixelPanel>
        <div className="animate-pulse font-code text-lg text-ink-dim">Loading...</div>
      </PixelPanel>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  const answers = Object.entries(answersByQuestionId).map(([questionId, answer]) => {
    const question = questions.find((q) => q.id === questionId)
    return {
      questionId,
      categorySlug: question?.categorySlug ?? 'community',
      title: question?.title ?? 'Community quest',
      isCorrect: answer.isCorrect,
      answeredAt: answer.answeredAt,
    }
  })

  const correctCount = answers.filter((a) => a.isCorrect).length
  const wrongCount = answers.length - correctCount
  const authorBonus = (authored > 0 ? authored * 25 : 0) + taught * 5
  const displayXp = Math.max(xp ?? 0, correctCount * 10 + authorBonus)
  const rank = rankForXp(displayXp)

  const grouped = categories
    .map((category) => ({
      category,
      items: answers
        .filter((a) => a.categorySlug === category.slug)
        .sort((a, b) => b.answeredAt - a.answeredAt),
    }))
    .filter((g) => g.items.length > 0)

  const pfp = avatarUrl(user.id, profile?.avatar)

  const copyProfileLink = async () => {
    const ok = await copyText(profileShareUrl(username))
    setCopied(ok)
  }

  const removeQuest = async (id: string) => {
    const res = await deleteUserQuest(id)
    if (!res.error) setMyQuests((qs) => qs?.filter((q) => q.id !== id) ?? null)
  }

  const handleToggleNewsletter = async (checked: boolean) => {
    setNewsletterOptIn(checked)
    setUpdatingNewsletter(true)
    setNewsletterMsg(null)
    const res = await updateNewsletterPreference(checked)
    if (res.error) {
      setNewsletterOptIn(!checked)
      setNewsletterMsg(res.error)
    } else {
      setNewsletterMsg(checked ? 'Subscribed to emails.' : 'Unsubscribed from emails.')
      setTimeout(() => setNewsletterMsg(null), 3000)
    }
    setUpdatingNewsletter(false)
  }

  return (
    <div className="space-y-6">
      <SEO title={`${username} — Profile`} description={`Rust mastery stats and authored quests for ${username}.`} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PixelPanel title="Authored quests">
            {!myQuests ? (
              <div className="animate-pulse font-code text-lg text-ink-dim">Loading quests...</div>
            ) : myQuests.length === 0 ? (
              <div className="space-y-3">
                <p className="font-code text-lg text-ink-dim">You haven't authored any community quests yet.</p>
                <Link to="/create">
                  <PixelButton size="sm" variant="secondary">
                    Create your first quest (+25 XP)
                  </PixelButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-2">
                  {myQuests.map((q) => (
                    <div
                      key={q.id}
                      className="pixel-ui flex flex-wrap items-center gap-2 border-3 border-night-edge bg-night-raised p-3 shadow-pixel"
                    >
                      <Link
                        to={`/${username}/${q.slug}`}
                        className="min-w-0 flex-1 read-body text-xl text-ink hover:text-rust-orange hover:underline"
                      >
                        {q.title}
                      </Link>
                      <span className="font-code text-base text-ink-faint">
                        {q.kind === 'coding' ? 'coding' : 'quiz'} · /{q.slug}
                      </span>
                      <Link to={`/create/${q.id}`}>
                        <PixelButton size="sm" variant="secondary">
                          Edit
                        </PixelButton>
                      </Link>
                      <PixelButton size="sm" variant="danger" onClick={() => void removeQuest(q.id)}>
                        Delete
                      </PixelButton>
                    </div>
                  ))}
                </div>
                <Link to="/create">
                  <PixelButton size="sm" variant="secondary">
                    + New quest
                  </PixelButton>
                </Link>
              </div>
            )}
          </PixelPanel>

          <PixelPanel title="Completed quests">
            {answers.length === 0 ? (
              <div className="space-y-3">
                <p className="font-code text-lg text-ink-dim">No quests completed yet.</p>
                <Link to="/" className="font-code text-lg text-diamond underline">
                  Start a topic
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {grouped.map(({ category, items }) => (
                  <div
                    key={category.slug}
                    className="border-3 border-night-edge bg-night-raised p-3"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-pixel text-[10px] uppercase text-ink">{category.name}</span>
                      <span className="ml-auto font-code text-lg text-ink-dim">{items.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Link
                          key={item.questionId}
                          to={`/category/${item.categorySlug}/question/${item.questionId}`}
                          title={item.isCorrect ? 'Correct' : 'Wrong'}
                          className={`border-2 border-black/60 px-2 py-1 font-code text-sm transition-transform hover:scale-105 active:scale-95 ${
                            item.isCorrect
                              ? 'bg-emerald text-stone-darkest'
                              : 'bg-redstone text-white'
                          }`}
                        >
                          {item.title.length > 24 ? `${item.title.slice(0, 24)}…` : item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PixelPanel>
        </div>

        <div className="space-y-4">
          <PixelPanel>
            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setEditAvatar(true)}
                className="mb-4 h-24 w-24 overflow-hidden border-4 border-black/60 bg-night-raised shadow-pixel transition-transform hover:scale-105"
                title="Edit avatar"
              >
                <img src={pfp} alt={username} className="h-full w-full" />
              </button>
              <div className="font-pixel text-sm uppercase text-ink">{username}</div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <span className="border-3 border-rust-orange bg-rust-orange/15 px-2 py-1 font-pixel text-[9px] uppercase text-rust-orange">
                  {rank.name}
                </span>
              </div>
              <div className="mt-2 font-pixel text-xs uppercase text-gold">{displayXp} XP</div>
              <div className="mt-2 font-code text-lg text-ink-dim">{user.email}</div>
            </div>
            <div className="mt-4 space-y-2">
              <PixelButton size="sm" variant="secondary" className="w-full" onClick={() => setEditAvatar(true)}>
                Edit avatar
              </PixelButton>
              <Link to={`/${username}`} className="block">
                <PixelButton size="sm" variant="secondary" className="w-full">
                  View public profile
                </PixelButton>
              </Link>
              <PixelButton size="sm" variant="secondary" className="w-full" onClick={() => void copyProfileLink()}>
                {copied ? 'Link copied!' : 'Copy my link'}
              </PixelButton>
              <Link to="/developer" className="block">
                <PixelButton size="sm" variant="secondary" className="w-full !border-rust-orange/60 !text-rust-orange">
                  Developer API & Keys
                </PixelButton>
              </Link>
              <ChallengeButton className="w-full" label="Challenge a friend" />
            </div>
          </PixelPanel>

          <AvatarPickerModal
            isOpen={editAvatar}
            userId={user.id}
            initial={profile?.avatar}
            onClose={() => setEditAvatar(false)}
            onSave={updateAvatar}
          />

          <PixelPanel title="Preferences">
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newsletterOptIn}
                  disabled={updatingNewsletter}
                  onChange={(e) => void handleToggleNewsletter(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-2 border-night-edge bg-night text-rust-orange focus:ring-diamond accent-[#ff5722]"
                />
                <div className="flex-1">
                  <div className="font-code text-base font-bold text-ink">Newsletter & Updates</div>
                  <div className="font-code text-xs text-ink-dim">
                    Receive weekly contests, daily streak reminders, and quest announcements.
                  </div>
                </div>
              </label>
              {newsletterMsg && (
                <div className="mt-2 font-code text-xs text-emerald border border-emerald/30 bg-emerald/10 p-1.5">
                  {newsletterMsg}
                </div>
              )}
            </div>
          </PixelPanel>

          <PixelPanel title="Stats">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-night-edge pb-2">
                <span className="font-code text-lg text-ink-dim">XP</span>
                <span className="font-pixel text-sm text-gold">{displayXp}</span>
              </div>
              <div className="flex items-center justify-between border-b border-night-edge pb-2">
                <span className="font-code text-lg text-ink-dim">Taught</span>
                <span className="font-pixel text-sm text-ink">{taught}</span>
              </div>
              <div className="flex items-center justify-between border-b border-night-edge pb-2">
                <span className="font-code text-lg text-ink-dim">Authored</span>
                <span className="font-pixel text-sm text-ink">{authored}</span>
              </div>
              <div className="flex items-center justify-between border-b border-night-edge pb-2">
                <span className="font-code text-lg text-ink-dim">Rival</span>
                <span className="font-pixel text-sm text-ink">
                  {wins}–{losses}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-night-edge pb-2">
                <span className="font-code text-lg text-ink-dim">Correct</span>
                <span className="font-pixel text-sm text-emerald">{correctCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-code text-lg text-ink-dim">Wrong</span>
                <span className="font-pixel text-sm text-redstone">{wrongCount}</span>
              </div>
            </div>
          </PixelPanel>

          {notes.length > 0 ? (
            <PixelPanel title="Inbox">
              <ul className="space-y-2">
                {notes.slice(0, 8).map((n) => {
                  const href = notificationHref(n)
                  const unread = !n.read_at
                  const body = (
                    <span className={`font-code text-base ${unread ? 'text-ink' : 'text-ink-dim'}`}>
                      {notificationText(n)}
                    </span>
                  )
                  return (
                    <li key={n.id}>
                      {href ? (
                        <Link to={href} className="hover:underline" onClick={() => void markNotificationsRead()}>
                          {body}
                        </Link>
                      ) : (
                        body
                      )}
                    </li>
                  )
                })}
              </ul>
            </PixelPanel>
          ) : null}

          <PixelButton variant="danger" size="sm" className="w-full" onClick={() => signOut()}>
            Sign Out
          </PixelButton>
        </div>
      </div>
    </div>
  )
}
