import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { questions } from '../data/questions'
import { categories } from '../data/categories'
import { difficultyLabel, getHint, OPTION_LABELS } from '../lib/quiz'
import { rememberTopic } from '../lib/continuePath'
import { PixelPanel } from '../components/ui/PixelPanel'
import { CodeBlock } from '../components/ui/CodeBlock'
import { AnswerOption } from '../components/ui/AnswerOption'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelArrowLeft } from '../components/ui/PixelArrowLeft'
import { RatingControl } from '../components/ui/RatingControl'
import { useProgressStore } from '../store/progressStore'
import { useAuth } from '../context/AuthContext'
import { AuthModal } from '../components/AuthModal'
import { TurnstileWidget, type TurnstileHandle } from '../components/TurnstileWidget'
import { SEO } from '../components/SEO'
import { useGuestClearance } from '../hooks/useGuestClearance'
import { buildBreadcrumbSchema } from '../components/seo-schemas'
import { getQuestStats, type QuestAnswerStats } from '../lib/userQuests'
import { isDailyQuestion } from '../lib/daily'
import { optionDisplayOrder } from '../lib/optionOrder'
import { QuestComments } from '../components/QuestComments'
import { QuestReportPanel } from '../components/QuestReportPanel'
import { ShareBar } from '../components/ShareBar'
import { MarkdownBody } from '../components/MarkdownBody'
import { InlineMarkdown } from '../components/ui/InlineMarkdown'
import { ChallengeButton } from '../components/ChallengeButton'
import { absoluteUrl } from '../lib/share'
import { reportRivalAnswer } from '../lib/rivals'

import { MonacoEditor } from '../components/ui/MonacoEditor'
import { gradeRun, gradeSubmit, isContestSolvedLocally, type GradeRunResult } from '../lib/grade'
import { GradeResultPanel } from '../components/GradeResultPanel'

const DRAFT_PREFIX = 'cratery_question_coding_'

function loadCodingDraft(id: string, fallback: string): string {
  try {
    return localStorage.getItem(DRAFT_PREFIX + id) ?? fallback
  } catch {
    return fallback
  }
}

function saveCodingDraft(id: string, code: string) {
  try {
    localStorage.setItem(DRAFT_PREFIX + id, code)
  } catch {
    /* ignore */
  }
}

const KB_TIP_KEY = 'cratery_kb_tip_dismissed'

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-block border-2 border-night-edge bg-slot px-1.5 py-0.5 font-pixel text-[9px] uppercase text-ink">
      {children}
    </kbd>
  )
}

export function QuestionPage() {
  const { categorySlug, questionId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showKbTip, setShowKbTip] = useState(() => {
    try {
      return localStorage.getItem(KB_TIP_KEY) !== '1'
    } catch {
      return true
    }
  })
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileFailed, setTurnstileFailed] = useState(false)
  const [turnstileKey, setTurnstileKey] = useState(0)
  const { checking: clearanceChecking, needsTurnstile, markCleared, invalidate } =
    useGuestClearance(!user)
  const turnstileRef = useRef<TurnstileHandle>(null)

  const retryTurnstile = () => {
    setTurnstileFailed(false)
    setTurnstileToken('')
    setTurnstileKey((k) => k + 1)
  }

  const dismissKbTip = () => {
    setShowKbTip(false)
    try {
      localStorage.setItem(KB_TIP_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const slug = categorySlug ?? ''
  const qid = questionId ?? ''
  const returnPath = searchParams.get('return')
  const fromPractice = returnPath === '/fated-five'

  const category = categories.find((c) => c.slug === slug)
  const qs = useMemo(
    () => questions.filter((q) => q.categorySlug === slug),
    [slug]
  )
  const idx = qs.findIndex((q) => q.id === qid)
  const q = idx >= 0 ? qs[idx] : questions.find((item) => item.id === qid)

  const record = useProgressStore((s) => s.answersByQuestionId[qid])
  const existingRating = useProgressStore((s) => s.ratingsByQuestionId[qid] ?? 0)
  const answerQuestion = useProgressStore((s) => s.answerQuestion)
  const rateQuest = useProgressStore((s) => s.rateQuest)

  const rivalId = searchParams.get('rival')

  const order = useMemo(
    () =>
      q && q.options && typeof q.correctIndex === 'number'
        ? optionDisplayOrder(
            qs
              .filter((item) => item.options && typeof item.correctIndex === 'number')
              .map((item) => ({
                id: item.id,
                correctIndex: item.correctIndex!,
                optionCount: item.options!.length,
              })),
            q.id
          )
        : [0, 1, 2, 3],
    [q, qs]
  )
  const correctDisplay = q && typeof q.correctIndex === 'number' ? order.indexOf(q.correctIndex) : -1

  const graded = Boolean(record && record.correctIndex !== undefined)
  const stateKey = `${qid}-${graded ? record!.selectedIndex : 'none'}`
  const initialDisplay =
    graded && record && q
      ? (() => {
          const di = order.indexOf(record.selectedIndex)
          return di >= 0 ? di : record.selectedIndex
        })()
      : null
  const initialSubmitted = graded

  
  const [selectedDisplay, setSelectedDisplay] = useState<number | null>(initialDisplay)
  const [localSubmitted, setLocalSubmitted] = useState(initialSubmitted)
  const [submitting, setSubmitting] = useState(false)
  const [lastStateKey, setLastStateKey] = useState(stateKey)
  const [stats, setStats] = useState<QuestAnswerStats>({ solve_count: 0, correct_count: 0 })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [xpFlash, setXpFlash] = useState<number | null>(null)
  const isCoding = q?.kind === 'coding'
  const [code, setCode] = useState(() => (q?.kind === 'coding' ? loadCodingDraft(qid, q.code ?? '') : ''))
  const [running, setRunning] = useState(false)
  const [submittingJudge, setSubmittingJudge] = useState(false)
  const [runResult, setRunResult] = useState<GradeRunResult | null>(null)
  const [gradeKind, setGradeKind] = useState<'run' | 'submit'>('run')
  const [toast, setToast] = useState<string | null>(null)

  const isSolvedLocally = isContestSolvedLocally(qid)

  if (lastStateKey !== stateKey) {
    setLastStateKey(stateKey)
    setSelectedDisplay(initialDisplay)
    setLocalSubmitted(initialSubmitted || isSolvedLocally || Boolean(record?.isCorrect))
    setSubmitting(false)
    setShowHint(false)
    setSubmitError(null)
    setTurnstileFailed(false)
    if (q?.kind === 'coding') {
      setCode(loadCodingDraft(qid, q.code ?? ''))
      setRunResult(null)
    }
  }

  useEffect(() => {
    if (q?.kind === 'coding') {
      setCode(loadCodingDraft(qid, q.code ?? ''))
      setRunResult(null)
      if (isSolvedLocally || record?.isCorrect) {
        setLocalSubmitted(true)
      }
    }
  }, [qid, q, isSolvedLocally, record])

  useEffect(() => {
    if (!q || q.kind !== 'coding' || !code) return
    saveCodingDraft(qid, code)
  }, [qid, q, code])

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const runTests = async () => {
    if (!q?.testHarness) return
    setGradeKind('run')
    setRunning(true)
    setRunResult(null)
    try {
      const result = await gradeRun({ code, harness: q.testHarness })
      setRunResult(result)
    } finally {
      setRunning(false)
    }
  }

  const submitTests = async () => {
    if (!q?.testHarness) return
    setGradeKind('submit')
    setSubmittingJudge(true)
    setRunResult(null)
    try {
      const result = await gradeSubmit({ code, harness: q.testHarness, contestId: q.id })
      setRunResult(result)
      if (result.passed) {
        useProgressStore.getState().recordCodingSuccess(q.id, {
          xpEarned: result.xpEarned,
          totalXp: result.totalXp,
        })
        setLocalSubmitted(true)
        if (result.xpEarned && result.xpEarned > 0) {
          flash(`🎉 Accepted! +${result.xpEarned} XP earned!`)
        } else {
          flash('🎉 Accepted! All tests passed.')
        }
      }
    } finally {
      setSubmittingJudge(false)
    }
  }

  useEffect(() => {
    if (slug) rememberTopic(slug)
  }, [slug])

  useEffect(() => {
    if (!qid) return
    setReportOpen(false)
    setReportSent(false)
    let cancelled = false
    getQuestStats(qid).then((live) => {
      if (!cancelled) setStats(live)
    })
    return () => {
      cancelled = true
    }
  }, [qid])

  const prev = idx > 0 ? qs[idx - 1] : null
  const next = idx >= 0 && idx < qs.length - 1 ? qs[idx + 1] : null
  const backTo = returnPath || `/category/${slug}`
  const backLabel = fromPractice ? 'Practice 5' : 'Topic'

  const [showCodingSolution, setShowCodingSolution] = useState(false)

  const submit = async () => {
    if (!q || selectedDisplay === null || localSubmitted || submitting) return
    const storedIndex = order[selectedDisplay]!
    setSubmitting(true)
    setSubmitError(null)
    const result = await answerQuestion({
      questionId: q.id,
      selectedIndex: storedIndex,
      turnstileToken: turnstileToken || undefined,
    })
    setSubmitting(false)
    if (result.status === 'error') {
      if (result.needsTurnstile) {
        invalidate()
        setTurnstileToken('')
        setTurnstileFailed(true)
      } else {
        setSubmitError('Could not submit. Check your connection and try again.')
      }
      return
    }
    if (!user) markCleared()
    setTurnstileToken('')
    setTurnstileFailed(false)
    setSubmitError(null)
    
    setLocalSubmitted(true)
    const correct =
      typeof result.isCorrect === 'boolean' ? result.isCorrect : storedIndex === q.correctIndex
    if (!result.alreadyAnswered) {
      setStats((s) => ({
        solve_count: s.solve_count + 1,
        correct_count: s.correct_count + (correct ? 1 : 0),
      }))
      if (result.xpEarned) setXpFlash(result.xpEarned)
    }
    if (rivalId && user) {
      const rival = await reportRivalAnswer(rivalId, q.id)
      if (rival.rival?.status === 'complete') {
        navigate(`/rival/${rivalId}`)
      }
    }
  }

  const goNext = () => {
    if (fromPractice) {
      navigate(backTo)
      return
    }
    if (next) navigate(`/category/${slug}/question/${next.id}`)
    else navigate(`/category/${slug}`)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return
      }

      const key = e.key.toLowerCase()

      if (!localSubmitted) {
        const map: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        }
        if (key in map && q && q.options && map[key] < q.options.length) {
          e.preventDefault()
          setSelectedDisplay(map[key])
          return
        }
        if (key === 'escape') {
          e.preventDefault()
          setSelectedDisplay(null)
          return
        }
        if (key === 'h') {
          e.preventDefault()
          setShowHint((open) => !open)
          return
        }
        if (key === 'enter') {
          e.preventDefault()
          void submit()
        }
        return
      }

      if (key === 'n' || key === 'enter') {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localSubmitted,
    selectedDisplay,
    q,
    next,
    fromPractice,
    slug,
    backTo,
    user,
    turnstileToken,
    needsTurnstile,
    clearanceChecking,
    turnstileFailed,
  ])

  if (!category || !q) {
    return (
      <PixelPanel title="Question not found">
        <SEO title="Question Not Found" noIndex />
        <div className="read-body text-lg">Unknown question.</div>
        <div className="mt-4">
          <Link to="/">
            <PixelButton>Home</PixelButton>
          </Link>
        </div>
      </PixelPanel>
    )
  }

  const isCorrect =
    localSubmitted && selectedDisplay !== null ? selectedDisplay === correctDisplay : false

  return (
    <div className="space-y-5 pb-24">
      <SEO
        title={`${q.title}: ${category.name} Rust Quiz`}
        description={`${q.prompt.substring(0, 150)}... Test your Rust knowledge on ${q.tags.join(', ')}.`}
        structuredData={buildBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: category.name, url: `/category/${slug}` },
          { name: q.title, url: `/category/${slug}/question/${q.id}` },
        ])}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase text-ink-dim hover:text-rust-orange hover:underline"
        >
          <PixelArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        <div className="text-right font-pixel text-[10px] uppercase text-ink-dim">
          <div>
            {category.icon} {category.name} · {idx + 1}/{qs.length} · {difficultyLabel(q.difficulty)}
          </div>
          <div className="mt-1 font-code text-base normal-case tracking-normal text-ink-faint">
            {stats.solve_count} attempts · {stats.correct_count} solved
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="min-w-0 font-pixel text-sm uppercase tracking-[0.02em] text-ink">
            {q.title}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {isDailyQuestion(q.id) && (
              <div className="inline-flex items-center gap-1.5 border border-rust-orange/70 bg-rust-orange/15 px-2 py-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-pixel text-rust-orange">
                  ⭐ Today's Daily · +20 XP
                </span>
              </div>
            )}
          </div>
        </div>
        {!reportOpen && !reportSent ? (
          <PixelButton size="sm" variant="danger" onClick={() => setReportOpen(true)}>
            Report
          </PixelButton>
        ) : null}
      </div>

      {!isCoding && q.code ? <CodeBlock code={q.code} language="rust" /> : null}

      {!isCoding && showKbTip ? (
        <div className="pixel-ui flex flex-col gap-2 border-3 border-diamond bg-diamond/10 px-3 py-2 shadow-pixel sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="read-body text-lg text-ink">
            <span className="mr-2 font-pixel text-[9px] uppercase text-diamond">Tip</span>
            <Kbd>1</Kbd>–<Kbd>4</Kbd> or <Kbd>A</Kbd>–<Kbd>D</Kbd> select · <Kbd>Esc</Kbd> clear ·{' '}
            <Kbd>Enter</Kbd> submit · <Kbd>H</Kbd> hint · <Kbd>N</Kbd> next
          </p>
          <button
            type="button"
            onClick={dismissKbTip}
            className="shrink-0 self-end font-pixel text-[9px] uppercase text-ink-dim hover:text-rust-orange hover:underline sm:self-auto"
          >
            Got it
          </button>
        </div>
      ) : null}

      {isCoding ? (
        <>
          <PixelPanel>
            <div className="mb-4 read-body text-2xl leading-snug whitespace-pre-wrap text-ink">
              {q.prompt}
            </div>
            {q.hint ? (
              <div className="mb-4 space-y-3">
                <PixelButton size="sm" variant="secondary" onClick={() => setShowHint((open) => !open)}>
                  Hint · H
                </PixelButton>
                {showHint ? (
                  <div className="border-3 border-gold bg-gold/10 p-4 shadow-pixel">
                    <div className="font-pixel text-[10px] uppercase text-gold">Hint</div>
                    <div className="mt-2 read-body text-xl leading-relaxed text-ink">{getHint(q)}</div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <MonacoEditor value={code} onChange={setCode} height="320px" />

            <div className="mt-4 flex flex-wrap gap-2">
              <PixelButton
                onClick={() => void runTests()}
                disabled={running || submittingJudge}
              >
                {running ? 'Running…' : 'Run'}
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => void submitTests()}
                disabled={running || submittingJudge}
              >
                {submittingJudge ? 'Submitting…' : 'Submit'}
              </PixelButton>
              <PixelButton
                size="sm"
                variant="secondary"
                onClick={() => setCode(q.code ?? '')}
              >
                Reset starter
              </PixelButton>
              {q.explanation && (
                <PixelButton
                  size="sm"
                  variant="gold"
                  onClick={() => setShowCodingSolution((s) => !s)}
                >
                  {showCodingSolution ? 'Hide Solution' : 'Solution & Explanation'}
                </PixelButton>
              )}
            </div>

            <GradeResultPanel
              running={running || submittingJudge}
              runningLabel={submittingJudge ? 'Submitting full tests…' : 'Running sample tests…'}
              result={runResult}
              kind={gradeKind}
            />

            {showCodingSolution && (
              <div className="mt-4 border-3 border-gold bg-gold/10 p-4 shadow-pixel space-y-3">
                <div className="font-pixel text-[10px] uppercase text-gold">Official Solution & Explanation</div>
                {q.solutionCode ? (
                  <div>
                    <div className="mb-1 font-pixel text-[10px] uppercase text-ink-dim">Solution Code</div>
                    <CodeBlock code={q.solutionCode} />
                    <div className="mt-2 flex gap-2">
                      <PixelButton
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setCode(q.solutionCode!)
                          setToast('Solution loaded into editor')
                        }}
                      >
                        Load into editor
                      </PixelButton>
                    </div>
                  </div>
                ) : null}
                {q.explanation ? (
                  <div className="text-ink">
                    <MarkdownBody>{q.explanation}</MarkdownBody>
                  </div>
                ) : null}
              </div>
            )}

            {toast ? <p className="mt-3 font-code text-base text-gold">{toast}</p> : null}
            <p className="mt-3 font-code text-base text-ink-faint">
              Run executes the first 3 tests. Submit runs the full harness.
            </p>
          </PixelPanel>

          <PixelPanel>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-code text-base text-ink-dim">
                Rate this challenge if it helped you practice.
              </p>
              <RatingControl
                rating={existingRating}
                onChange={(r) => {
                  if (!user) {
                    setShowAuthModal(true)
                    return
                  }
                  rateQuest({ questionId: q.id, rating: r })
                }}
              />
            </div>
          </PixelPanel>
        </>
      ) : (
        <>
          <PixelPanel>
            <div className="mb-4 read-body text-2xl leading-snug text-ink">{q.prompt}</div>

            <div className="grid gap-2.5" role="listbox" aria-label="Answer options">
              {order.map((storedIndex, displayIndex) => {
                const opt = q.options ? q.options[storedIndex] : null
                if (!opt) return null
                let result: 'correct' | 'wrong' | 'missed' | null = null
                if (localSubmitted) {
                  if (displayIndex === correctDisplay) result = 'correct'
                  else if (displayIndex === selectedDisplay) result = 'wrong'
                  else result = 'missed'
                }
                return (
                  <AnswerOption
                    key={`${storedIndex}-${OPTION_LABELS[displayIndex]}`}
                    label={OPTION_LABELS[displayIndex]!}
                    text={opt.text}
                    selected={selectedDisplay === displayIndex}
                    disabled={localSubmitted || submitting}
                    result={result}
                    onSelect={() => setSelectedDisplay(displayIndex)}
                  />
                )
              })}
            </div>

            {!localSubmitted ? (
              <div className="mt-4 space-y-3">
                {needsTurnstile && !turnstileFailed ? (
                  <TurnstileWidget
                    key={turnstileKey}
                    ref={turnstileRef}
                    onToken={(token) => {
                      setTurnstileToken(token)
                      setTurnstileFailed(false)
                    }}
                    onError={() => {
                      setTurnstileToken('')
                      setTurnstileFailed(true)
                    }}
                  />
                ) : null}
                {turnstileFailed ? (
                  <div className="flex flex-wrap items-center gap-3" role="alert">
                    <p className="font-code text-base text-redstone">Security check failed. Retry</p>
                    <PixelButton size="sm" variant="secondary" onClick={retryTurnstile}>
                      Retry
                    </PixelButton>
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-3">
                  <PixelButton
                    onClick={() => void submit()}
                    disabled={selectedDisplay === null || submitting}
                  >
                    {submitting ? 'Checking…' : 'Submit · Enter'}
                  </PixelButton>
                  <PixelButton
                    variant="secondary"
                    onClick={() => setSelectedDisplay(null)}
                    disabled={selectedDisplay === null || submitting}
                    title="Unselect the current option"
                  >
                    Clear · Esc
                  </PixelButton>
                  <PixelButton variant="secondary" onClick={() => setShowHint((open) => !open)}>
                    Hint · H
                  </PixelButton>
                </div>
                {submitError ? (
                  <p className="font-code text-base text-redstone" role="alert">
                    {submitError}
                  </p>
                ) : null}
              </div>
            ) : null}

            {showHint && !localSubmitted ? (
              <div className="mt-4 border-3 border-gold bg-gold/10 p-4 shadow-pixel">
                <div className="font-pixel text-[10px] uppercase text-gold">Hint</div>
                <div className="mt-2 read-body text-xl leading-relaxed text-ink">
                  {getHint(q)}
                </div>
              </div>
            ) : null}
          </PixelPanel>

          {localSubmitted ? (
            <div
              className={`pixel-ui border-4 shadow-pixel ${
                isCorrect
                  ? 'border-emerald bg-emerald/10'
                  : 'border-redstone bg-redstone/10'
              }`}
            >
              <div className="border-b-3 border-black/60 px-4 py-3 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-pixel text-sm uppercase text-ink">
                      {isCorrect ? '✓ Correct' : '✗ Not quite'}
                    </div>
                    {isCorrect ? (
                      <p className="mt-2 read-body text-xl text-ink-dim">
                        That rule sticks better when you earn it.
                        {xpFlash ? (
                          <span className="ml-2 font-pixel text-[10px] uppercase text-gold">+{xpFlash} XP</span>
                        ) : null}
                      </p>
                    ) : (
                      <p className="mt-2 font-code text-lg tracking-normal text-ink-dim">
                        Answer {OPTION_LABELS[correctDisplay]}:{' '}
                        <InlineMarkdown
                          text={
                            q.options && typeof q.correctIndex === 'number'
                              ? q.options[q.correctIndex]?.text
                              : ''
                          }
                        />
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-stretch gap-3 sm:items-end">
                    <RatingControl
                      rating={existingRating}
                      onChange={(r) => {
                        if (!user) {
                          setShowAuthModal(true)
                          return
                        }
                        rateQuest({ questionId: q.id, rating: r })
                      }}
                    />
                    <ShareBar
                      url={absoluteUrl(`/category/${slug}/question/${q.id}`)}
                      text={
                        isCorrect
                          ? `I got this Rust quiz: ${q.title}. Your turn.`
                          : `Rust quiz: ${q.title}. Can you get it right?`
                      }
                    />
                    <ChallengeButton questionIds={[q.id]} label="Challenge a friend" />
                  </div>
                </div>
              </div>

              <div className="bg-night-panel px-4 py-5 sm:px-6 sm:py-6">
                <div className="font-pixel text-[10px] uppercase tracking-wider text-ink-dim mb-3">
                  Explanation
                </div>
                <div className="text-ink">
                  <MarkdownBody>{q.explanation}</MarkdownBody>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      <QuestReportPanel
        key={q.id}
        questionId={q.id}
        title={q.title}
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSent={() => setReportSent(true)}
      />
      <QuestComments key={q.id} questionId={q.id} />

      {/* Sticky continue bar after submit */}
      {localSubmitted ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t-4 border-black/60 bg-night-panel px-3 py-2.5 sm:px-4 sm:py-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <span className="hidden font-code text-lg text-ink-dim sm:inline">
              Press N or Enter for next
            </span>
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
              <Link to={backTo} className="flex-1 sm:flex-none">
                <PixelButton variant="secondary" className="w-full sm:w-auto">
                  {backLabel}
                </PixelButton>
              </Link>
              {!fromPractice && prev ? (
                <Link to={`/category/${slug}/question/${prev.id}`}>
                  <PixelButton variant="secondary">Prev</PixelButton>
                </Link>
              ) : null}
              <PixelButton className="flex-1 sm:flex-none" onClick={goNext}>
                {fromPractice
                  ? 'Practice 5 →'
                  : next
                    ? 'Next →'
                    : 'Finish topic ✓'}
              </PixelButton>
            </div>
          </div>
        </div>
      ) : null}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="signup"
      />
    </div>
  )
}
