import { Link } from 'react-router-dom'
import { contests, getCurrentContest } from '../data/contests'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { difficultyLabel } from '../lib/quiz'
import { useProgressStore } from '../store/progressStore'
import { isContestSolvedLocally } from '../lib/grade'

function difficultyColor(d: number) {
  return d === 1 ? 'text-grass' : d === 2 ? 'text-gold' : 'text-redstone'
}

function statusLabel(opensAt: string, closesAt: string): string {
  const now = Date.now()
  if (now < Date.parse(opensAt)) return 'Upcoming'
  if (now < Date.parse(closesAt)) return 'Live'
  return 'Closed'
}

export function ContestListPage() {
  const current = getCurrentContest()
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const isContestSolved = (id: string) => Boolean(answersByQuestionId[id]?.isCorrect || isContestSolvedLocally(id))
  const isCurrentSolved = isContestSolved(current.id)

  return (
    <div className="space-y-5">
      <SEO
        title="Weekly Rust Contest"
        description="New Rust contest every Thursday. Write in-browser, run examples in the site judge, submit, and unlock the solution."
      />

      <PixelPanel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-sm uppercase tracking-[0.02em]">Weekly Contest</h1>
              {isCurrentSolved && (
                <span className="border border-emerald/60 bg-emerald/15 px-2 py-0.5 font-pixel text-[8px] uppercase tracking-wider text-emerald">
                  ✓ Solved
                </span>
              )}
            </div>
            <p className="mt-3 read-body text-xl text-ink-dim">
              New problem every Thursday. Lasts one week, then it rotates. Hard enough that juniors
              struggle, mids sweat the edges, and seniors still think. Problem on the left, editor on
              the right. Run and Submit in the browser judge. Closed weeks stay as a practice archive.
            </p>
            <p className="mt-2 font-pixel text-[9px] uppercase text-ink-dim">
              Resets every Thursday · {current.weekLabel}
            </p>
          </div>
          <div className="shrink-0">
            <Link to={`/contest/${current.id}`}>
              <PixelButton variant={isCurrentSolved ? 'success' : 'primary'}>
                {isCurrentSolved ? 'Review this week →' : 'This week →'}
              </PixelButton>
            </Link>
          </div>
        </div>
      </PixelPanel>

      <PixelPanel title="Weeks">
        <div className="space-y-2">
          {contests.map((c) => {
            const status = statusLabel(c.opensAt, c.closesAt)
            const isSolved = isContestSolved(c.id)
            return (
              <Link key={c.id} to={`/contest/${c.id}`} className="block">
                <div className={`pixel-ui border-3 shadow-pixel transition-all duration-100 hover:-translate-y-0.5 hover:shadow-pixel-lg ${
                  isSolved
                    ? 'border-emerald/60 bg-emerald/5 hover:border-emerald'
                    : 'border-black/60 bg-night-raised hover:border-ink-faint'
                }`}>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 sm:p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`font-pixel text-[9px] sm:text-[10px] uppercase break-words ${isSolved ? 'text-emerald-300' : 'text-ink'}`}>
                          {c.title}
                        </div>
                        {isSolved && (
                          <span className="inline-flex items-center border border-emerald/60 bg-emerald/15 px-1.5 py-0.2 font-pixel text-[7px] sm:text-[8px] uppercase tracking-wider text-emerald">
                            ✓ Solved
                          </span>
                        )}
                      </div>
                      <div className="read-body text-base sm:text-lg text-ink-dim">{c.weekLabel}</div>
                    </div>
                    <div
                      className={`shrink-0 border-2 border-black/60 px-1.5 sm:px-2 py-1 font-pixel text-[8px] sm:text-[9px] ${difficultyColor(c.difficulty)}`}
                    >
                      {difficultyLabel(c.difficulty).toUpperCase()}
                    </div>
                    <div className={`shrink-0 border-2 px-1.5 sm:px-2 py-1 font-pixel text-[8px] sm:text-[9px] uppercase ${
                      isSolved
                        ? 'border-emerald/60 bg-emerald/20 text-emerald'
                        : 'border-black/60 text-ink-dim'
                    }`}>
                      {isSolved ? 'Solved ✓' : status}
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
