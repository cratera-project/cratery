import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { questions } from '../data/questions'
import { useProgressStore } from '../store/progressStore'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { InventorySlot } from '../components/ui/InventorySlot'
import { SEO } from '../components/SEO'
import { difficultyLabel, type Question } from '../lib/quiz'
import { ChallengeButton } from '../components/ChallengeButton'
import { copyText, fatedFiveShareText, xIntentUrl, SITE_URL } from '../lib/share'

const SESSION_KEY = 'cratery_practice5_ids'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function loadPracticeIds(answeredIds: Set<string>): string[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) {
      const ids = JSON.parse(raw) as string[]
      if (Array.isArray(ids) && ids.length > 0) return ids
    }
  } catch {
    /* ignore */
  }

  const unsolved = questions.filter(
    (q) => !answeredIds.has(q.id)
  )
  if (unsolved.length === 0) return []
  const picked = shuffleArray(unsolved)
    .slice(0, Math.min(5, unsolved.length))
    .map((q) => q.id)
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(picked))
  } catch {
    /* ignore */
  }
  return picked
}

function difficultyColor(d: number) {
  return d === 1 ? 'text-grass' : d === 2 ? 'text-gold' : 'text-redstone'
}

export function FatedFivePage() {
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const answeredIds = useMemo(
    () => new Set(Object.keys(answersByQuestionId)),
    [answersByQuestionId]
  )
  const [seed, setSeed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [hydrated, setHydrated] = useState(() => useProgressStore.persist.hasHydrated())

  useEffect(() => {
    const unsub = useProgressStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])

  const practiceIds = useMemo(() => {
    if (!hydrated) return []
    void seed
    return loadPracticeIds(answeredIds)
    // Re-roll only on seed; answering must not reshuffle the set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, hydrated])

  const fatedQuests = useMemo(
    () =>
      practiceIds
        .map((id) => questions.find((q) => q.id === id))
        .filter((q): q is Question => Boolean(q)),
    [practiceIds]
  )

  const completedCount = fatedQuests.filter((q) => answersByQuestionId[q.id]).length
  const correctCount = fatedQuests.filter((q) => answersByQuestionId[q.id]?.isCorrect).length
  const allDone = fatedQuests.length > 0 && completedCount === fatedQuests.length
  const nextOpen = fatedQuests.find((q) => !answersByQuestionId[q.id])

  const rollNew = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
    setSeed((s) => s + 1)
    setCopied(false)
  }, [])

  const emojis = useMemo(
    () => fatedQuests.map((q) => (answersByQuestionId[q.id]?.isCorrect ? '🟩' : '🟥')).join(''),
    [fatedQuests, answersByQuestionId]
  )

  const shareText = useMemo(
    () => fatedFiveShareText({ correct: correctCount, total: fatedQuests.length, emojis }),
    [correctCount, fatedQuests.length, emojis]
  )

  const shareScore = useCallback(async () => {
    const ok = await copyText(shareText)
    setCopied(ok)
    if (ok) {
      setTimeout(() => setCopied(false), 2500)
    }
  }, [shareText])

  if (!hydrated) {
    return (
      <PixelPanel>
        <div className="py-8 text-center font-code text-xl text-ink-dim animate-pulse">
          Loading practice set…
        </div>
      </PixelPanel>
    )
  }

  if (fatedQuests.length === 0) {
    return (
      <div className="space-y-6">
        <SEO title="Practice 5: Cleared" description="All questions completed." />
        <PixelPanel>
          <div className="py-8 text-center">
            <div className="text-4xl">🎲</div>
            <div className="mt-4 font-pixel text-sm uppercase text-emerald">All clear</div>
            <p className="mt-3 read-body text-xl text-ink-dim">
              You&apos;ve answered every question. Browse topics to review, or check back for new
              ones.
            </p>
            <div className="mt-6">
              <Link to="/">
                <PixelButton>Home</PixelButton>
              </Link>
            </div>
          </div>
        </PixelPanel>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <SEO
        title="Practice 5: Random Unsolved Rust Quizzes"
        description="Training mode: five random unsolved Rust quiz questions across topics."
      />

      <PixelPanel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎲</span>
            <div>
              <h1 className="font-pixel text-sm uppercase tracking-[0.02em]">Practice 5</h1>
              <p className="read-body text-lg text-ink-dim">
                {completedCount}/{fatedQuests.length} done
                {allDone ? ` · ${correctCount} correct` : ''}
              </p>
            </div>
          </div>
          {nextOpen ? (
            <Link
              to={`/category/${nextOpen.categorySlug}/question/${nextOpen.id}?return=/fated-five`}
            >
              <PixelButton>{completedCount === 0 ? 'Start →' : 'Continue →'}</PixelButton>
            </Link>
          ) : null}
        </div>
      </PixelPanel>

      <PixelPanel title="Your set">
        <div className="space-y-2">
          {fatedQuests.map((quest, index) => {
            const isCompleted = Boolean(answersByQuestionId[quest.id])
            const wasCorrect = isCompleted && answersByQuestionId[quest.id].isCorrect

            return (
              <Link
                key={quest.id}
                to={`/category/${quest.categorySlug}/question/${quest.id}?return=/fated-five`}
                className="block"
              >
                <div
                  className={`pixel-ui border-3 shadow-pixel transition-all duration-100 hover:-translate-y-0.5 hover:shadow-pixel-lg ${
                    isCompleted
                      ? wasCorrect
                        ? 'border-emerald bg-emerald/10'
                        : 'border-redstone bg-redstone/10'
                      : 'border-night-edge bg-night-raised'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3">
                    <InventorySlot className="h-10 w-10 sm:h-11 sm:w-11">
                      <div className="font-pixel text-xs">
                        {isCompleted ? (wasCorrect ? '✓' : '✗') : index + 1}
                      </div>
                    </InventorySlot>
                    <div className="min-w-0 flex-1">
                      <div className="font-pixel text-[9px] sm:text-[10px] uppercase break-words">{quest.title}</div>
                      <div className="truncate read-body text-base sm:text-lg text-ink-dim">
                        {quest.prompt}
                      </div>
                    </div>
                    <div
                      className={`shrink-0 border-2 border-night-edge px-1.5 sm:px-2 py-1 font-pixel text-[8px] sm:text-[9px] ${difficultyColor(quest.difficulty)}`}
                    >
                      {difficultyLabel(quest.difficulty).toUpperCase()}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <PixelButton variant="secondary">Home</PixelButton>
          </Link>
          <PixelButton variant="secondary" onClick={rollNew}>
            Roll new five
          </PixelButton>
          <ChallengeButton questionIds={practiceIds} label="Challenge a friend" />
        </div>
      </PixelPanel>

      {allDone ? (
        <PixelPanel className="border-emerald bg-emerald/5">
          <div className="py-4 text-center">
            <div className="font-pixel text-sm uppercase text-emerald">Set complete</div>
            <p className="mt-2 read-body text-2xl text-ink">
              {correctCount}/{fatedQuests.length} correct
            </p>
            <div className="my-3 font-mono text-2xl tracking-widest">{emojis}</div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <PixelButton onClick={shareScore} variant={copied ? 'success' : 'primary'}>
                {copied ? '✓ Copied Grid!' : 'Copy Result Grid'}
              </PixelButton>
              <a
                href={xIntentUrl(`${SITE_URL}/fated-five`, `Cratery Practice 5 ⚡ ${correctCount}/${fatedQuests.length}\n${emojis}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PixelButton variant="secondary">Share on X</PixelButton>
              </a>
              <ChallengeButton questionIds={practiceIds} label="Challenge a friend" />
              <PixelButton variant="secondary" onClick={rollNew}>
                Roll another five
              </PixelButton>
            </div>
          </div>
        </PixelPanel>
      ) : null}
    </div>
  )
}
