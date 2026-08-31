import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { questions } from '../data/questions'
import {
  TOTAL_BUILTIN_QUESTIONS,
  TOPIC_CATEGORIES_COUNT,
} from '../data/questionStats'
import { useProgressStore } from '../store/progressStore'
import { useAuth } from '../context/AuthContext'
import { getContinueTarget } from '../lib/continuePath'
import { PixelPanel } from '../components/ui/PixelPanel'
import { ProgressBar } from '../components/ui/ProgressBar'
import { InventorySlot } from '../components/ui/InventorySlot'
import { PixelButton } from '../components/ui/PixelButton'
import { AuthModal } from '../components/AuthModal'
import { SEO } from '../components/SEO'
import {
  getCommunityQuests,
  getSiteStats,
  type CommunityQuestCard,
  type SiteStats,
} from '../lib/userQuests'
import { questHref } from '../lib/communityNav'
import { getDailyQuestion, getDailyQuestionHref } from '../lib/daily'
import { InteractiveCategoryCard } from '../components/InteractiveCategoryCard'
import {
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildFAQSchema,
} from '../components/seo-schemas'
import { ZULIP_COMMUNITY_URL, DISCORD_BOT_INVITE_URL } from '../lib/constants'

function categoryStats(slug: string, answeredIds: Set<string>) {
  const qs = questions.filter((q) => q.categorySlug === slug)
  const done = qs.filter((q) => answeredIds.has(q.id)).length
  return { done, total: qs.length }
}

function FeatureRow({
  kicker,
  title,
  body,
  children,
  flip,
}: {
  kicker: string
  title: string
  body: string
  children: React.ReactNode
  flip?: boolean
}) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <div className={flip ? 'md:order-2' : ''}>
        <div className="font-pixel text-[9px] uppercase tracking-wider text-rust-orange">{kicker}</div>
        <h2 className="mt-2 font-pixel text-sm uppercase leading-relaxed text-ink">{title}</h2>
        <p className="mt-3 read-body text-xl leading-relaxed text-ink-dim">{body}</p>
      </div>
      <div className={flip ? 'md:order-1' : ''}>{children}</div>
    </div>
  )
}

export function HomePage() {
  const { user } = useAuth()
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const answeredIds = new Set(Object.keys(answersByQuestionId))
  const totalDone = answeredIds.size
  const total = questions.length
  const cont = getContinueTarget(answersByQuestionId)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null)
  const [statsReady, setStatsReady] = useState(false)
  const [communityQuests, setCommunityQuests] = useState<CommunityQuestCard[]>([])

  useEffect(() => {
    let cancelled = false
    getSiteStats()
      .then((stats) => {
        if (!cancelled && stats) setSiteStats(stats)
      })
      .finally(() => {
        if (!cancelled) setStatsReady(true)
      })
    getCommunityQuests(6, { sort: 'most_attempts' }).then((rows) => {
      if (!cancelled) setCommunityQuests(rows)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const executionsLabel = siteStats ? siteStats.code_executions.toLocaleString() : (statsReady ? '0' : '…')
  const answeredLabel = siteStats ? siteStats.quests_answered.toLocaleString() : (statsReady ? '0' : '…')
  const createdLabel = siteStats ? siteStats.quests_created.toLocaleString() : (statsReady ? total.toLocaleString() : '…')
  const membersLabel = siteStats ? siteStats.members.toLocaleString() : (statsReady ? '0' : '…')

  return (
    <div className="space-y-12 pb-4">
      <SEO
        title="Rust Topic Quizzes: Ownership, Lifetimes, Traits & More"
        description={`Master Rust by topic: ${TOTAL_BUILTIN_QUESTIONS}+ questions across ${TOPIC_CATEGORIES_COUNT} topics. Code snippets, multiple choice, hints, and full explanations.`}
        structuredData={[
          buildWebSiteSchema(),
          buildOrganizationSchema(),
          buildFAQSchema([
            {
              question: 'What is Cratery?',
              answer:
                'Cratery is a Rust quiz and practice platform organized by topic: ownership, lifetimes, traits, concurrency, and more. Each question features a verified Rust snippet, asks a multiple-choice question, and explains the rule behind it.',
            },
            {
              question: 'Is Cratery free?',
              answer:
                `Yes. All ${TOTAL_BUILTIN_QUESTIONS}+ topic quizzes, community quests, and weekly contests are 100% free for everyone.`,
            },
            {
              question: 'Do I need an account?',
              answer:
                'No. Progress saves automatically in your browser. Sign in only if you want progress synced across devices, a public profile, or to publish your own quests.',
            },
            {
              question: 'What Rust topics does Cratery cover?',
              answer:
                'Ownership, lifetimes, traits, concurrency, smart pointers, macros, error handling, iterators & closures, and the borrow checker.',
            },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="pixel-ui relative overflow-hidden border-4 border-black/60 bg-night-panel shadow-pixel">
        <div className="absolute -right-10 -top-10 h-40 w-40 rotate-12 border-4 border-rust-orange/30" aria-hidden />
        <div className="relative px-4 py-7 sm:px-10 sm:py-14">
          <div className="font-pixel text-[9px] uppercase tracking-widest text-rust-orange sm:text-[10px]">
            Rust training ground
          </div>
          <h1 className="mt-3 max-w-xl font-pixel text-lg uppercase leading-relaxed text-ink sm:mt-4 sm:text-2xl">
            Master Rust one quest at a time
          </h1>
          <p className="mt-3 max-w-xl read-body text-xl leading-relaxed text-ink-dim sm:mt-4 sm:text-2xl">
            Solve short multiple-choice Rust snippets with real explanations, then take on community
            quests, climb the ranks, and make your own.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            {user || totalDone > 0 ? (
              <Link to={cont.href}>
                <PixelButton size="lg">{cont.label}</PixelButton>
              </Link>
            ) : (
              <Link to="/category/ownership">
                <PixelButton size="lg">Get started</PixelButton>
              </Link>
            )}
            <Link to="/quests">
              <PixelButton size="lg" variant="secondary">
                Official quests
              </PixelButton>
            </Link>
          </div>
          <p className="mt-4 font-code text-sm text-ink-faint sm:text-base">
            Free · no account needed · progress saves in your browser
          </p>
        </div>
      </section>

      {/* Daily Challenge Strip (Shared & 100% synced with Discord /daily) */}
      {(() => {
        const daily = getDailyQuestion()
        if (!daily) return null
        const dailyCat = categories.find((c) => c.slug === daily.categorySlug)
        const isDailySolved = Boolean(answersByQuestionId[daily.id]?.isCorrect)
        const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date())

        return (
          <PixelPanel className="!border-rust-orange/60 bg-gradient-to-r from-rust-orange/10 via-night-panel to-night-panel !p-3.5 sm:!p-4 shadow-pixel">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <InventorySlot className="h-11 w-11 shrink-0 border-rust-orange/50 bg-rust-orange/20">
                  <span className="text-xl">⭐</span>
                </InventorySlot>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[9px] uppercase tracking-wider text-rust-orange">
                      Daily · {formattedDate}
                    </span>
                    <span className="border border-gold/70 bg-gold/15 px-1.5 py-0.5 font-pixel text-[8px] uppercase text-gold">
                      +20 XP
                    </span>
                  </div>
                  <div className="mt-0.5 truncate font-pixel text-xs uppercase text-ink">
                    {daily.title}
                  </div>
                  <div className="truncate font-code text-xs text-ink-dim">
                    {dailyCat ? `${dailyCat.icon} ${dailyCat.name}` : 'Rust Challenge'} · Syncs with Discord <code className="text-rust-orange">/daily</code>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 sm:self-center">
                {isDailySolved ? (
                  <div className="flex items-center gap-2.5">
                    <span className="font-pixel text-[10px] uppercase text-emerald">
                      ✓ Solved Today
                    </span>
                    <Link to={getDailyQuestionHref()} className="shrink-0">
                      <PixelButton size="sm" variant="secondary">
                        Review
                      </PixelButton>
                    </Link>
                  </div>
                ) : (
                  <Link to={getDailyQuestionHref()} className="shrink-0">
                    <PixelButton size="sm" variant="primary">
                      Solve Daily (+20 XP) →
                    </PixelButton>
                  </Link>
                )}
              </div>
            </div>
          </PixelPanel>
        )
      })()}

      {/* Cratera Open Source Engine Announcement */}
      <PixelPanel className="!border-emerald/60 bg-gradient-to-r from-emerald/10 via-night-panel to-night-panel !p-3.5 sm:!p-4 shadow-pixel">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <InventorySlot className="h-11 w-11 shrink-0 border-emerald/50 bg-emerald/20">
              <span className="text-xl">🦀</span>
            </InventorySlot>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[9px] uppercase tracking-wider text-emerald">
                  Engine Update · Open Source
                </span>
                <span className="border border-emerald/70 bg-emerald/15 px-1.5 py-0.5 font-pixel text-[8px] uppercase text-emerald">
                  Cratera is Live
                </span>
              </div>
              <div className="mt-0.5 truncate font-pixel text-xs uppercase text-ink">
                Cratera microVM Code Execution Engine is Now Open Source
              </div>
              <div className="truncate font-code text-xs text-ink-dim">
                Hardware-isolated KVM sandbox built in Rust · 30 languages · Test or self-host it today
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 sm:self-center">
            <a
              href="https://cratera.org"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <PixelButton size="sm" variant="secondary">
                Live Demo ↗
              </PixelButton>
            </a>
            <a
              href="https://github.com/cratera-project/cratera"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <PixelButton size="sm" className="!bg-emerald hover:!bg-emerald/80 !text-black !border-black">
                GitHub Repo →
              </PixelButton>
            </a>
          </div>
        </div>
      </PixelPanel>

      {/* Continue strip for returning players */}
      {totalDone > 0 ? (
        <PixelPanel className="!py-3">
          <div className="flex flex-wrap items-center gap-4">
            <InventorySlot className="h-12 w-12">
              <span className="text-2xl">{cont.icon}</span>
            </InventorySlot>
            <div className="min-w-0 flex-1">
              <div className="font-pixel text-[9px] uppercase text-ink-dim">
                Pick up where you left off
              </div>
              <div className="font-pixel text-xs uppercase text-ink">{cont.categoryName}</div>
            </div>
            <div className="w-full sm:w-48">
              <ProgressBar value={totalDone} max={total} />
            </div>
            <Link to={cont.href}>
              <PixelButton size="sm">{cont.label} →</PixelButton>
            </Link>
          </div>
        </PixelPanel>
      ) : null}

      {/* Feature: sharpen skills (topic grid) */}
      <FeatureRow
        kicker="Sharpen your skills"
        title="Quests by topic"
        body={`Ownership, lifetimes, traits, concurrency and more. Over ${TOTAL_BUILTIN_QUESTIONS} practice quests built around real Rust snippets with deep rule explanations.`}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.slice(0, 4).map((c) => {
            const { done, total: catTotal } = categoryStats(c.slug, answeredIds)
            return (
              <Link key={c.slug} to={`/category/${c.slug}`} className="group block">
                <div className="pixel-ui h-full border-3 border-night-edge bg-night-raised p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-pixel-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span>
                    <span className="font-pixel text-[10px] uppercase text-ink">{c.name}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={done} max={catTotal} hideLabel />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </FeatureRow>

      {/* Feature: instant feedback */}
      <FeatureRow
        flip
        kicker="Instant feedback"
        title="Answer, then understand"
        body="Every quest reveals the correct answer with a full explanation of the Rust rule behind it, plus an optional hint if you want a nudge first."
      >
        <div className="pixel-ui border-4 border-black/60 bg-night-panel shadow-pixel">
          <div className="border-b-2 border-night-edge bg-night-raised px-3 py-1 font-pixel text-[9px] uppercase tracking-wider text-ink-dim">
            Example quest
          </div>
          <div className="space-y-3 p-4">
            <p className="read-body text-lg text-ink">What happens to `s` after the move?</p>
            <div className="border-3 border-emerald bg-emerald/10 p-3 read-body text-lg text-ink">
              ✓ It can no longer be used (ownership moved)
            </div>
            <div className="border-3 border-night-edge bg-night-raised p-3 read-body text-lg text-ink-dim opacity-60">
              It gets copied, so both bindings work
            </div>
          </div>
        </div>
      </FeatureRow>

      {/* Feature: ranks */}
      <FeatureRow
        kicker="Earn XP and ranks"
        title="Climb from Novice to Grandmaster"
        body="Correct answers earn XP. Ranks mark your progress, streaks keep you honest, and the leaderboard shows who is grinding hardest."
      >
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {['Novice', 'Apprentice', 'Adept', 'Expert', 'Master', 'Grandmaster'].map((name, i) => (
            <div
              key={name}
              className={`pixel-ui border-3 p-2.5 sm:p-3 text-center shadow-pixel ${
                i === 5
                  ? 'border-gold bg-gold/10'
                  : i >= 3
                    ? 'border-rust-orange bg-rust-orange/10'
                    : 'border-night-edge bg-night-raised'
              }`}
            >
              <div className="font-pixel text-[8px] uppercase text-ink">{name}</div>
            </div>
          ))}
        </div>
      </FeatureRow>

      {/* Community stats band */}
      <section className="pixel-ui border-4 border-black/60 bg-night-panel px-3 py-6 shadow-pixel sm:px-10 sm:py-8">
        <div className="font-pixel text-[9px] uppercase tracking-wider text-rust-orange text-center sm:text-left">
          The cratery community
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-4">
          <div>
            <div className="font-pixel text-sm text-ink xs:text-lg sm:text-2xl">{executionsLabel}</div>
            <div className="mt-1 font-code text-xs text-ink-dim sm:text-base">code executions</div>
          </div>
          <div>
            <div className="font-pixel text-sm text-ink xs:text-lg sm:text-2xl">{answeredLabel}</div>
            <div className="mt-1 font-code text-xs text-ink-dim sm:text-base">quests answered</div>
          </div>
          <div>
            <div className="font-pixel text-sm text-ink xs:text-lg sm:text-2xl">{createdLabel}</div>
            <div className="mt-1 font-code text-xs text-ink-dim sm:text-base">quests created</div>
          </div>
          <div>
            <div className="font-pixel text-sm text-ink xs:text-lg sm:text-2xl">{membersLabel}</div>
            <div className="mt-1 font-code text-xs text-ink-dim sm:text-base">rustaceans</div>
          </div>
        </div>
      </section>

      {/* Community quests preview */}
      {communityQuests.length > 0 ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-xs uppercase tracking-wider text-ink-dim">
                Most attempted
              </h2>
              <p className="mt-1 font-code text-base text-ink-faint">
                Community quests rustaceans try the most
              </p>
            </div>
            <Link to="/community" className="font-code text-lg text-rust-orange hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {communityQuests.map((q) => (
              <Link
                key={q.id}
                to={questHref({ username: q.username, slug: q.slug }, 'community')}
                className="pixel-ui block border-4 border-black/60 bg-night-panel p-4 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-pixel-lg"
              >
                <div className="font-pixel text-[10px] uppercase leading-relaxed text-ink">
                  {q.title}
                </div>
                <div className="mt-2 font-code text-base text-ink-dim">
                  by <span className="text-rust-orange">{q.username}</span>
                  <span className="text-ink-faint">
                    {' '}
                    · {q.difficulty === 1 ? 'Easy' : q.difficulty === 2 ? 'Medium' : 'Hard'}
                    {' '}
                    · {q.solve_count} attempts
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Create CTA */}
      <section className="pixel-ui relative overflow-hidden border-4 border-rust-orange bg-night-panel shadow-glow">
        <div className="px-5 py-10 text-center sm:px-10">
          <h2 className="font-pixel text-sm uppercase leading-relaxed text-ink sm:text-base">
            Create your own quest
          </h2>
          <p className="mx-auto mt-4 max-w-lg read-body text-xl leading-relaxed text-ink-dim">
            Found a borrow-checker trap that fooled you once? Turn it into a quest. Every quest you
            publish gets its own link,{' '}
            <span className="text-rust-orange">cratery.cratera.org/you/your-quest</span>, ready to
            share with friends, classmates, or your whole Discord.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/create">
              <PixelButton size="lg">Create a quest</PixelButton>
            </Link>
            <Link to="/community">
              <PixelButton size="lg" variant="secondary">
                Browse community
              </PixelButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="pixel-ui relative overflow-hidden border-4 border-[#5063f0]/60 bg-[#5063f0]/5 p-5 shadow-pixel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[9px] uppercase tracking-wider text-[#5063f0]">
                Cratera & Cratery Community
              </span>
              <span className="border border-[#5063f0]/50 bg-[#5063f0]/20 px-1.5 py-0.5 font-pixel text-[8px] uppercase text-[#5063f0]">
                Zulip Chat
              </span>
            </div>
            <div className="font-pixel text-xs uppercase text-ink">
              Join the Zulip Community
            </div>
            <p className="font-code text-xs text-ink-dim max-w-xl">
              Discuss rust quizzes, engine development, benchmarks, and share ideas directly with other rustaceans on Zulip.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
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
                + Add Discord Bot
              </PixelButton>
            </a>
          </div>
        </div>
      </section>

      {/* Full topic grid */}
      <div className="space-y-3">
        <h2 className="font-pixel text-xs uppercase tracking-wider text-ink-dim">
          Browse all topics
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InteractiveCategoryCard />
          {categories
            .filter((c) => !c.isInteractive)
            .map((c) => {
              const { done, total: catTotal } = categoryStats(c.slug, answeredIds)
              const pct = catTotal ? Math.round((done / catTotal) * 100) : 0
              const isComplete = done === catTotal && catTotal > 0
              return (
                <Link key={c.slug} to={`/category/${c.slug}`} className="group block">
                  <div className="pixel-ui h-full border-4 border-black/60 bg-night-panel shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-pixel-lg">
                    <div className="p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <InventorySlot
                          className={isComplete ? 'border-4 border-grass bg-grass/15' : ''}
                        >
                          <span className="text-2xl">{c.icon}</span>
                        </InventorySlot>
                        <div className="min-w-0 flex-1">
                          <div className="font-pixel text-xs uppercase text-ink">{c.name}</div>
                          <div className="read-body line-clamp-2 text-base text-ink-dim">
                            {c.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="mr-2 flex-1">
                          <ProgressBar value={done} max={catTotal} hideLabel />
                        </div>
                        <span
                          className={`font-pixel text-[10px] ${isComplete ? 'text-grass' : 'text-ink-dim'}`}
                        >
                          {isComplete ? '✓' : `${pct}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab="signup" />
    </div>
  )
}
