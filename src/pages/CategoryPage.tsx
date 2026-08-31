import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categories } from '../data/categories'
import { questions } from '../data/questions'
import { interactiveQuests } from '../data/interactiveQuests'
import { difficultyLabel } from '../lib/quiz'
import { PixelPanel } from '../components/ui/PixelPanel'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useProgressStore } from '../store/progressStore'
import { PixelButton } from '../components/ui/PixelButton'
import { InventorySlot } from '../components/ui/InventorySlot'
import { PixelArrowLeft } from '../components/ui/PixelArrowLeft'
import { SEO } from '../components/SEO'
import { buildBreadcrumbSchema, buildCourseSchema } from '../components/seo-schemas'
import { getQuestStatsBatch, type QuestAnswerStats } from '../lib/userQuests'
import { isContestSolvedLocally } from '../lib/grade'

type OfficialSort =
  | 'difficulty'
  | 'most_solved'
  | 'least_solved'
  | 'most_attempts'
  | 'least_attempts'
  | 'newest'

const SORT_OPTIONS: { value: OfficialSort; label: string }[] = [
  { value: 'difficulty', label: 'By difficulty' },
  { value: 'most_solved', label: 'Most solved' },
  { value: 'least_solved', label: 'Least solved' },
  { value: 'most_attempts', label: 'Most attempted' },
  { value: 'least_attempts', label: 'Least attempted' },
  { value: 'newest', label: 'Newest' },
]

export function CategoryPage() {
  const { categorySlug } = useParams()
  const slug = categorySlug ?? ''

  const category = categories.find((c) => c.slug === slug)
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)

  const qs = questions.filter((q) => q.categorySlug === slug)
  const done = qs.filter((q) => Boolean(answersByQuestionId[q.id])).length
  const questionIds = qs.map((q) => q.id).join(',')

  const [sort, setSort] = useState<OfficialSort>('difficulty')
  const [statsById, setStatsById] = useState<Record<string, QuestAnswerStats>>({})

  useEffect(() => {
    let cancelled = false
    if (!questionIds) {
      setStatsById({})
      return
    }
    getQuestStatsBatch(questionIds.split(',')).then((stats) => {
      if (!cancelled) setStatsById(stats)
    })
    return () => {
      cancelled = true
    }
  }, [questionIds])

  if (!category) {
    return (
      <PixelPanel title="Topic not found">
        <SEO title="Topic Not Found" noIndex />
        <div className="read-body text-lg">Unknown topic: {slug}</div>
        <div className="mt-4">
          <Link to="/">
            <PixelButton>Home</PixelButton>
          </Link>
        </div>
      </PixelPanel>
    )
  }

  if (category.isInteractive) {
    const isQuestSolved = (id: string) => Boolean(answersByQuestionId[id]?.isCorrect || isContestSolvedLocally(id))
    const interactiveDone = interactiveQuests.filter((q) => isQuestSolved(q.id)).length
    const firstUnanswered = interactiveQuests.find((q) => !isQuestSolved(q.id))
    const firstUnansweredIndex = firstUnanswered ? interactiveQuests.findIndex((q) => q.id === firstUnanswered.id) + 1 : 1
    const ctaLabel = interactiveDone === 0 ? 'Start #1 →' : firstUnanswered ? `Continue #${firstUnansweredIndex} →` : null

    return (
      <div className="space-y-5">
        <SEO
          title={`${category.name}: In-Browser Rust Coding Trials & Quests`}
          description={category.description}
          structuredData={[
            buildBreadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: category.name, url: `/category/${slug}` },
            ]),
            buildCourseSchema(category.name, category.description, slug),
          ]}
        />

        <Link
          to="/quests"
          className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase text-ink-dim hover:text-rust-orange hover:underline"
        >
          <PixelArrowLeft className="h-4 w-4" />
          All topics
        </Link>

        <PixelPanel>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <InventorySlot className="h-12 w-12">
                  <span className="text-2xl">{category.icon}</span>
                </InventorySlot>
                <div>
                  <div className="font-pixel text-[10px] uppercase text-ink-dim">Topic</div>
                  <h1 className="font-pixel text-sm uppercase tracking-[0.02em] text-ink">
                    {category.name}
                  </h1>
                </div>
              </div>
              <p className="mt-3 read-body text-xl text-ink-dim">{category.description}</p>
            </div>

            <div className="flex flex-col items-stretch gap-2.5 sm:items-end">
              {firstUnanswered ? (
                <Link to={`/contest/${firstUnanswered.id}`}>
                  <PixelButton className="w-full sm:w-auto">
                    {ctaLabel}
                  </PixelButton>
                </Link>
              ) : (
                <PixelButton variant="success" disabled className="w-full sm:w-auto">
                  All {interactiveQuests.length} Cleared ✓
                </PixelButton>
              )}
              <div className="w-full sm:w-44">
                <ProgressBar value={interactiveDone} max={interactiveQuests.length} />
              </div>
            </div>
          </div>
        </PixelPanel>

        <PixelPanel title={`Forge Trials (${interactiveQuests.length} Challenges)`}>
          <div className="grid gap-2 sm:gap-3">
            {interactiveQuests.map((q, index) => {
              const isSolved = isQuestSolved(q.id)
              const diffClass =
                q.difficulty === 1 ? 'text-grass' : q.difficulty === 2 ? 'text-gold' : 'text-redstone'

              return (
                <Link
                  key={q.id}
                  to={`/contest/${q.id}`}
                  className="group block"
                >
                  <div className={`pixel-ui border-3 p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-pixel-lg sm:p-3.5 ${
                    isSolved
                      ? 'border-emerald/60 bg-emerald/5 hover:border-emerald'
                      : 'border-night-edge bg-night-raised hover:border-ink-faint'
                  }`}>
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-dim sm:text-[10px]">
                          <span>#{index + 1}</span>
                          <span>·</span>
                          <span className={diffClass}>{difficultyLabel(q.difficulty).toUpperCase()}</span>
                          <span>·</span>
                          <span className="text-ink-faint">{q.weekLabel || 'Official Quest'}</span>
                          {isSolved && (
                            <span className="ml-1 inline-flex items-center gap-1 border border-emerald/60 bg-emerald/15 px-1.5 py-0.2 font-pixel text-[8px] tracking-wider text-emerald">
                              ✓ Solved
                            </span>
                          )}
                        </div>
                        <h2 className={`mt-1 font-pixel text-xs uppercase break-words sm:text-sm ${isSolved ? 'text-emerald-300' : 'text-ink'}`}>
                          {q.title}
                        </h2>
                        {q.signature && (
                          <div className="mt-1 font-code text-xs text-ink-faint truncate">
                            {q.signature}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        <PixelButton size="sm" variant={isSolved ? 'success' : 'primary'}>
                          {isSolved ? 'Review →' : 'Open →'}
                        </PixelButton>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </PixelPanel>
      </div>
    )
  }

  const firstUnanswered = qs.find((q) => !answersByQuestionId[q.id])
  const ctaLabel = done === 0 ? 'Start →' : firstUnanswered ? 'Continue →' : null
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'By difficulty'

  const ranked = qs.map((q, index) => {
    const stats = statsById[q.id]
    return {
      q,
      index,
      solve_count: stats?.solve_count ?? 0,
      correct_count: stats?.correct_count ?? 0,
    }
  })
  ranked.sort((a, b) => {
    switch (sort) {
      case 'most_solved':
        return b.correct_count - a.correct_count || a.index - b.index
      case 'least_solved':
        return a.correct_count - b.correct_count || a.index - b.index
      case 'most_attempts':
        return b.solve_count - a.solve_count || a.index - b.index
      case 'least_attempts':
        return a.solve_count - b.solve_count || a.index - b.index
      case 'newest':
        return b.index - a.index
      case 'difficulty':
      default:
        return a.q.difficulty - b.q.difficulty || a.index - b.index
    }
  })

  return (
    <div className="space-y-5">
      <SEO
        title={`${category.name}: Rust ${category.name} Quiz`}
        description={`${category.description} Practice ${qs.length} Rust ${category.name.toLowerCase()} questions with real code and detailed explanations.`}
        structuredData={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: category.name, url: `/category/${slug}` },
          ]),
          buildCourseSchema(category.name, category.description, slug),
        ]}
      />

      <Link
        to="/quests"
        className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase text-ink-dim hover:text-rust-orange hover:underline"
      >
        <PixelArrowLeft className="h-4 w-4" />
        All topics
      </Link>

      <PixelPanel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <InventorySlot className="h-12 w-12">
                <span className="text-2xl">{category.icon}</span>
              </InventorySlot>
              <div>
                <div className="font-pixel text-[10px] uppercase text-ink-dim">Topic</div>
                <h1 className="font-pixel text-sm uppercase tracking-[0.02em] text-ink">
                  {category.name}
                </h1>
              </div>
            </div>
            <p className="mt-3 read-body text-xl text-ink-dim">{category.description}</p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-start">
            <ProgressBar value={done} max={qs.length} />
            {firstUnanswered && ctaLabel ? (
              <Link to={`/category/${slug}/question/${firstUnanswered.id}`}>
                <PixelButton className="w-full sm:w-auto">{ctaLabel}</PixelButton>
              </Link>
            ) : (
              <PixelButton variant="success" disabled>
                Topic cleared ✓
              </PixelButton>
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
              onChange={(e) => setSort(e.target.value as OfficialSort)}
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
        <div className="grid gap-2">
          {ranked.map(({ q, index, solve_count, correct_count }) => {
            const answer = answersByQuestionId[q.id]
            const status = answer ? (answer.isCorrect ? '✓' : '✗') : '○'

            return (
              <Link key={q.id} to={`/category/${slug}/question/${q.id}`} className="block">
                <div className="pixel-ui border-3 border-night-edge bg-night-raised p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-pixel-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 font-pixel text-[9px] sm:text-[10px] uppercase text-ink-dim">
                        <span>
                          {index + 1}/{qs.length} · {difficultyLabel(q.difficulty)}
                        </span>
                        {q.kind === 'coding' && (
                          <span className="inline-flex items-center gap-0.5 border border-diamond/60 bg-diamond/15 px-1 py-0.2 font-pixel text-[7px] sm:text-[8px] tracking-wider text-diamond">
                            ⌨ Code
                          </span>
                        )}
                        <span className="font-code text-xs sm:text-base normal-case tracking-normal text-ink-faint">
                          · {solve_count} attempts · {correct_count} solved
                        </span>
                      </div>
                      <div className="read-body text-lg sm:text-xl text-ink break-words">{q.title}</div>
                    </div>
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center border-3 border-black/60 font-code text-lg sm:text-xl shadow-pixel ${
                        answer?.isCorrect
                          ? 'bg-emerald text-stone-darkest'
                          : answer
                            ? 'bg-redstone text-white'
                            : 'bg-slot text-ink-dim'
                      }`}
                    >
                      {status}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </PixelPanel>
    </div>
  )
}
