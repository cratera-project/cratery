import { Link } from 'react-router-dom'
import { InventorySlot } from './ui/InventorySlot'
import { PixelButton } from './ui/PixelButton'
import { interactiveQuests } from '../data/interactiveQuests'
import { useProgressStore } from '../store/progressStore'
import { ProgressBar } from './ui/ProgressBar'
import { isContestSolvedLocally } from '../lib/grade'

export function InteractiveCategoryCard() {
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const isSolved = (id: string) => Boolean(answersByQuestionId[id]?.isCorrect || isContestSolvedLocally(id))
  const done = interactiveQuests.filter((q) => isSolved(q.id)).length
  const total = interactiveQuests.length
  const isCleared = done === total && total > 0

  return (
    <div className="col-span-full sm:col-span-2 lg:col-span-3">
      <Link to="/category/interactive" className="group block">
        <div className={`pixel-ui h-full border-3 p-3 shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-pixel-lg sm:p-4 ${
          isCleared
            ? 'border-emerald/60 bg-emerald/5 hover:border-emerald'
            : 'border-night-edge bg-night-raised hover:border-ink-faint'
        }`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <InventorySlot className="shrink-0">
                <span className="text-2xl">⚒️</span>
              </InventorySlot>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-pixel text-[10px] uppercase text-ink">Forge Trials</span>
                  <span className="border-2 border-black/60 bg-night px-1.5 py-0.5 font-pixel text-[8px] uppercase text-rust-orange">
                    Interactive Coding
                  </span>
                  {done > 0 && (
                    <span className="border border-emerald/60 bg-emerald/15 px-1.5 py-0.5 font-pixel text-[8px] uppercase text-emerald">
                      {done}/{total} Solved
                    </span>
                  )}
                </div>
                <p className="mt-1 read-body text-base text-ink-dim sm:text-lg">
                  Write real Rust in the browser editor. Step from single-line warmups to full systems with instant test feedback.
                </p>
                {done > 0 && (
                  <div className="mt-2 max-w-xs">
                    <ProgressBar value={done} max={total} />
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 self-end sm:self-center">
              <PixelButton size="sm" variant={isCleared ? 'success' : 'primary'}>
                {isCleared ? 'Cleared ✓' : done > 0 ? 'Continue →' : 'Start coding →'}
              </PixelButton>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
