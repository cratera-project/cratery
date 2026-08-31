import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { questions } from '../data/questions'
import { useProgressStore } from '../store/progressStore'
import { getContinueTarget } from '../lib/continuePath'
import { PixelPanel } from '../components/ui/PixelPanel'
import { ProgressBar } from '../components/ui/ProgressBar'
import { InventorySlot } from '../components/ui/InventorySlot'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { InteractiveCategoryCard } from '../components/InteractiveCategoryCard'

function categoryStats(slug: string, answeredIds: Set<string>) {
  const qs = questions.filter((q) => q.categorySlug === slug)
  const done = qs.filter((q) => answeredIds.has(q.id)).length
  return { done, total: qs.length }
}

export function QuestsPage() {
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const answeredIds = new Set(Object.keys(answersByQuestionId))
  const totalDone = answeredIds.size
  const total = questions.length
  const cont = getContinueTarget(answersByQuestionId)
  const standardCategories = categories.filter((c) => !c.isInteractive)

  return (
    <div className="space-y-5">
      <SEO
        title="Official Rust Quests"
        description={`Practice ${questions.length} official Cratery Rust quizzes across ${categories.length} topics: ownership, lifetimes, traits, concurrency, and more.`}
      />

      <PixelPanel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-pixel text-sm uppercase tracking-[0.02em] text-ink">
              Official quests
            </h1>
            <p className="mt-1 text-sm text-ink-dim">
              Curated topic quizzes from Cratery: short snippets, multiple choice, hints, and full
              explanations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-44">
              <ProgressBar value={totalDone} max={total} />
            </div>
            <Link to={cont.href}>
              <PixelButton>{cont.label} →</PixelButton>
            </Link>
          </div>
        </div>
      </PixelPanel>

      <PixelPanel title="Topics">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InteractiveCategoryCard />
          {standardCategories.map((c) => {
            const { done, total: catTotal } = categoryStats(c.slug, answeredIds)
            const pct = catTotal ? Math.round((done / catTotal) * 100) : 0
            const isComplete = done === catTotal && catTotal > 0
            return (
              <Link key={c.slug} to={`/category/${c.slug}`} className="group block">
                <div className="pixel-ui h-full border-3 border-night-edge bg-night-raised p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-pixel-lg">
                  <div className="mb-3 flex items-center gap-3">
                    <InventorySlot
                      className={isComplete ? 'border-4 border-grass bg-grass/15' : ''}
                    >
                      <span className="text-2xl">{c.icon}</span>
                    </InventorySlot>
                    <div className="min-w-0 flex-1">
                      <div className="font-pixel text-[10px] uppercase text-ink">{c.name}</div>
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
              </Link>
            )
          })}
        </div>
      </PixelPanel>

      <p className="text-center font-code text-base text-ink-faint">
        Looking for player-made quizzes?{' '}
        <Link to="/community" className="text-rust-orange hover:underline">
          Browse community quests
        </Link>
      </p>
    </div>
  )
}
