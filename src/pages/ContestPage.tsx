import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  getContest,
  type ContestSolution,
  type SupportedLanguage,
  LANGUAGE_LABELS,
  LANGUAGE_MONACO_IDS,
  getContestLanguages,
  getStarterCode,
} from '../data/contests'
import { Header } from '../components/Header'
import { MonacoEditor } from '../components/ui/MonacoEditor'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { CodeBlock } from '../components/ui/CodeBlock'
import { MarkdownBody } from '../components/MarkdownBody'
import { InlineMarkdown } from '../components/ui/InlineMarkdown'
import { difficultyLabel } from '../lib/quiz'
import { ContestTimerButton } from '../components/ContestTimerButton'
import { gradeRun, gradeSubmit, saveContestRun, isContestSolvedLocally, type GradeRunResult } from '../lib/grade'
import { GradeResultPanel } from '../components/GradeResultPanel'
import { ContestStatsModal } from '../components/ContestStats'
import { QuestComments } from '../components/QuestComments'
import { EditOnGitHub } from '../components/EditOnGitHub'
import { useProgressStore } from '../store/progressStore'
import {
  formatUnlockCountdown,
  isSolutionLocked,
  solutionUnlocksAtMs,
} from '../lib/contestSchedule'

const DRAFT_PREFIX = 'cratery_contest_draft_'

function loadDraft(id: string, lang: string, fallback: string): string {
  try {
    return localStorage.getItem(`${DRAFT_PREFIX}${id}__${lang}`) ?? fallback
  } catch {
    return fallback
  }
}

function saveDraft(id: string, lang: string, code: string) {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${id}__${lang}`, code)
  } catch {
    /* ignore */
  }
}


export function ContestPage() {
  const { contestId } = useParams()
  const contest = contestId ? getContest(contestId) : undefined
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const isSolved = contest ? Boolean(answersByQuestionId[contest.id]?.isCorrect || isContestSolvedLocally(contest.id)) : false
  const [language, setLanguage] = useState<SupportedLanguage>('rust')
  const [code, setCode] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [leftWidth, setLeftWidth] = useState(45)
  const [isResizing, setIsResizing] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [showSolutionConfirm, setShowSolutionConfirm] = useState(false)
  const [running, setRunning] = useState(false)
  const [submittingJudge, setSubmittingJudge] = useState(false)
  const [gradeKind, setGradeKind] = useState<'run' | 'submit'>('run')
  const [runResult, setRunResult] = useState<GradeRunResult | null>(null)
  const [statsTick, setStatsTick] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const [solution, setSolution] = useState<ContestSolution | null>(null)
  const [solutionLoading, setSolutionLoading] = useState(false)
  const [solutionError, setSolutionError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())

  
  useEffect(() => {
    if (!contest) return
    const langs = getContestLanguages(contest)
    const defaultLang = langs[0] ?? 'rust'
    queueMicrotask(() => {
      setLanguage(defaultLang)
      setCode(loadDraft(contest.id, defaultLang, getStarterCode(contest, defaultLang)))
      
      setSolution(null)
      setSolutionError(null)
      setShowSolutionConfirm(false)
      setSolutionOpen(false)
    })
  }, [contest])

  
  const handleLanguageChange = (lang: SupportedLanguage) => {
    if (!contest) return
    
    saveDraft(contest.id, language, code)
    setLanguage(lang)
    setCode(loadDraft(contest.id, lang, getStarterCode(contest, lang)))
    setRunResult(null)
  }

  useEffect(() => {
    if (!contest || !code) return
    saveDraft(contest.id, language, code)
  }, [contest, language, code])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const startResizing = useCallback(() => setIsResizing(true), [])
  const stopResizing = useCallback(() => setIsResizing(false), [])

  const resize = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isResizing) return
      const container = e.currentTarget.getBoundingClientRect()
      const next = ((e.clientX - container.left) / container.width) * 100
      if (next > 22 && next < 72) setLeftWidth(next)
    },
    [isResizing],
  )

  if (!contest) return <Navigate to="/contest" replace />

  const solutionLocked = isSolutionLocked(contest, now)
  const unlockLeft = Math.max(0, solutionUnlocksAtMs(contest) - now)

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const runTests = async () => {
    setGradeKind('run')
    setRunning(true)
    setRunResult(null)
    try {
      const result = await gradeRun({ code, harness: contest.testHarness, language })
      setRunResult(result)
      saveContestRun(contest.id, {
        kind: 'run',
        code,
        passed: result.passed,
        verdict: result.verdict,
        status: result.status,
        executionTime: result.executionTime,
        memoryKb: result.memoryKb,
        wallMs: result.wallMs,
        error: result.error,
        compilationError: result.compilationError,
      })
      setStatsTick((n) => n + 1)
    } finally {
      setRunning(false)
    }
  }

  const submitTests = async () => {
    setGradeKind('submit')
    setSubmittingJudge(true)
    setRunResult(null)
    try {
      const result = await gradeSubmit({
        code,
        harness: contest.testHarness,
        contestId: contest.id,
        language,
      })
      const passed = Boolean(result.passed || result.verdict === 'AC' || result.status === 'Passed')
      setRunResult(result)
      saveContestRun(contest.id, {
        kind: 'submit',
        code,
        passed,
        verdict: result.verdict,
        status: result.status,
        executionTime: result.executionTime,
        memoryKb: result.memoryKb,
        wallMs: result.wallMs,
        scoreUpdated: result.scoreUpdated,
        error: result.error,
        compilationError: result.compilationError,
      })
      setStatsTick((n) => n + 1)
      if (passed) {
        useProgressStore.getState().recordCodingSuccess(contest.id, {
          xpEarned: result.xpEarned,
          totalXp: result.totalXp,
        })

        if (result.xpEarned && result.xpEarned > 0) {
          flash(`🎉 Accepted! +${result.xpEarned} XP earned!`)
        } else if (result.scoreUpdated) {
          flash('🎉 Accepted! New personal best.')
        } else {
          flash('🎉 Accepted! All tests passed.')
        }
      }
    } finally {
      setSubmittingJudge(false)
    }
  }

  const confirmRevealSolution = async () => {
    if (!contest?.loadSolution) return
    if (isSolutionLocked(contest)) {
      setShowSolutionConfirm(false)
      return
    }
    const load = contest.loadSolution
    setShowSolutionConfirm(false)
    setSolutionLoading(true)
    setSolutionError(null)
    try {
      const loaded = await load()
      setSolution(loaded)
    } catch {
      setSolutionError('Could not load the solution. Try again.')
    } finally {
      setSolutionLoading(false)
    }
  }

  const isTrial =
    contest.weekLabel?.includes('Trial') ||
    contest.weekLabel === 'Advanced Quest' ||
    contest.weekLabel === 'Interactive Quest'

  return (
    <div className="flex min-h-screen flex-col bg-night text-ink lg:h-screen lg:overflow-hidden">
      <SEO
        title={`${contest.title} · ${isTrial ? 'Forge Trial' : 'Weekly Contest'}`}
        description={`${contest.title}. ${contest.weekLabel}.`}
      />

      <div className="shrink-0 px-2.5 pt-2.5 sm:px-4 sm:pt-4">
        <Header />
      </div>

      <div
        className="flex min-h-0 flex-1 select-none flex-col overflow-auto px-2.5 pb-2.5 sm:px-4 sm:pb-4 lg:flex-row lg:overflow-hidden"
        style={{ ['--left' as string]: `${leftWidth}%` }}
        onMouseMove={resize}
        onMouseUp={stopResizing}
        onMouseLeave={stopResizing}
      >
        {/* Left: problem */}
        <aside
          className="flex w-full shrink-0 flex-col overflow-hidden border-4 border-black/60 bg-night-panel shadow-pixel lg:h-full lg:w-[var(--left)]"
        >
          <div className="flex items-center justify-between gap-2 border-b-4 border-black/60 bg-night-raised px-3 py-2">
            <div className="min-w-0">
              <Link
                to={isTrial ? '/category/interactive' : '/contest'}
                className="font-pixel text-[9px] uppercase text-ink-dim hover:text-rust-orange"
              >
                {isTrial ? '← Forge Trials' : '← Weekly Contests'}
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="truncate font-pixel text-xs uppercase tracking-[0.02em]">
                  {contest.title}
                </h1>
                {isSolved && (
                  <span className="shrink-0 inline-flex items-center border border-emerald/60 bg-emerald/15 px-1.5 py-0.2 font-pixel text-[8px] uppercase tracking-wider text-emerald">
                    ✓ Solved
                  </span>
                )}
              </div>
            </div>
            <span className="shrink-0 border-2 border-black/60 bg-night-panel px-2 py-1 font-pixel text-[9px] uppercase text-ink-dim">
              {contest.weekLabel} · {difficultyLabel(contest.difficulty).toUpperCase()}
            </span>
          </div>

          <div className="min-h-0 flex-1 select-text overflow-y-auto p-3.5 space-y-4">
            <div className="border border-night-edge bg-night px-3 py-2">
              <span className="block font-pixel text-[8px] uppercase tracking-wider text-ink-dim mb-1">Signature</span>
              <code className="font-code text-xs sm:text-[13px] text-emerald-300 font-semibold break-all">
                {contest.signature}
              </code>
            </div>

            <MarkdownBody>{contest.prompt}</MarkdownBody>

            <div className="pt-2">
              <div className="mb-3 border-b-2 border-night-edge pb-1.5 font-pixel text-[10px] uppercase text-ink">
                Examples
              </div>
              <div className="space-y-4">
                {contest.examples.map((ex, i) => (
                  <div key={i} className="border-2 border-night-edge bg-night-raised p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[9px] uppercase text-gold">
                        Example {i + 1}
                      </span>
                    </div>

                    {/* Input Block */}
                    <div className="space-y-1">
                      <span className="block font-pixel text-[8px] uppercase tracking-wider text-stone-400">
                        Input
                      </span>
                      <pre className="overflow-x-auto border border-night-edge bg-night p-2.5 font-code text-xs leading-relaxed text-emerald-300">
                        {ex.input}
                      </pre>
                    </div>

                    {/* Output Block */}
                    <div className="space-y-1">
                      <span className="block font-pixel text-[8px] uppercase tracking-wider text-stone-400">
                        Output
                      </span>
                      <pre className="overflow-x-auto border border-night-edge bg-night p-2.5 font-code text-xs leading-relaxed text-gold font-bold">
                        {ex.output}
                      </pre>
                    </div>

                    {/* Explanation Callout */}
                    {ex.explanation ? (
                      <div className="border-l-2 border-rust-orange/80 bg-night/80 px-3 py-2 font-sans text-xs text-stone-300 leading-relaxed">
                        <strong className="text-white font-semibold">Explanation: </strong>
                        <InlineMarkdown text={ex.explanation} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 border-2 border-black/60">
              <button
                type="button"
                onClick={() => setSolutionOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 bg-night-raised px-3 py-2 text-left font-pixel text-[10px] uppercase transition-colors hover:bg-night-edge"
                aria-expanded={solutionOpen}
              >
                <span>Solution</span>
                <span className="text-ink-dim">
                  {solutionLocked
                    ? 'Locked'
                    : solutionOpen
                      ? 'Hide −'
                      : 'Show +'}
                </span>
              </button>
              {solutionOpen ? (
                <div className="border-t-2 border-black/60 p-3">
                  {solutionLocked ? (
                    <div className="border-2 border-dashed border-black/60 bg-night-raised px-4 py-6 text-center">
                      <p className="font-pixel text-[10px] uppercase text-gold">
                        Solution Locked During Contest
                      </p>
                      <p className="mt-3 read-body text-xl text-ink">
                        Official write-up unlocks in{' '}
                        <span className="font-code text-gold">
                          {formatUnlockCountdown(unlockLeft)}
                        </span>
                        . Run, Submit, and Stats are live now.
                      </p>
                    </div>
                  ) : solution ? (
                    <div className="space-y-4">
                      {solution.solutionWalkthrough ? (
                        <div className="border-b-2 border-black/60 pb-3">
                          <div className="mb-2 font-pixel text-[10px] uppercase text-ink-dim">
                            Walkthrough
                          </div>
                          <MarkdownBody className="text-base text-ink leading-relaxed">
                            {solution.solutionWalkthrough}
                          </MarkdownBody>
                        </div>
                      ) : null}
                      <div>
                        <div className="mb-2 font-pixel text-[10px] uppercase text-ink-dim">
                          Solution Code
                        </div>
                        <CodeBlock code={solution.solutionCode} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <PixelButton
                          variant="secondary"
                          onClick={() => setCode(solution.solutionCode)}
                        >
                          Load into editor
                        </PixelButton>
                        <PixelButton variant="secondary" onClick={() => setSolution(null)}>
                          Clear reveal
                        </PixelButton>
                      </div>
                    </div>
                  ) : !contest.loadSolution ? (
                    <div className="border-2 border-dashed border-black/60 bg-night-raised px-4 py-6 text-center">
                      <p className="read-body text-xl text-ink">
                        Official write-up is not posted yet. Keep grinding.
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-black/60 bg-night-raised px-4 py-6 text-center">
                      <p className="read-body text-xl text-ink">
                        Try the problem first. The official answer passes every harness test.
                      </p>
                      <div className="mt-3 flex flex-col items-center gap-2">
                        <PixelButton
                          variant="danger"
                          disabled={solutionLoading}
                          onClick={() => setShowSolutionConfirm(true)}
                        >
                          {solutionLoading ? 'Loading…' : 'Reveal solution'}
                        </PixelButton>
                        {solutionError ? (
                          <p className="read-body text-lg text-redstone">{solutionError}</p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {!isTrial ? (
              <div className="flex justify-end pt-2 pb-1">
                <EditOnGitHub filePath={`content/contests/${contest.id}.md`} />
              </div>
            ) : null}

            {/* Comments Section */}
            <div className="mt-4">
              <QuestComments key={contest.id} questionId={contest.id} />
            </div>
          </div>
        </aside>

        {/* Resize handle — same idea as the old contest page */}
        <div
          className="mx-1 hidden w-4 cursor-col-resize flex-col items-center justify-center transition-colors hover:bg-night-raised lg:flex"
          onMouseDown={startResizing}
          title="Drag to resize"
        >
          <div className="mb-1 h-8 w-1 rounded-full bg-night-edge" />
          <div className="mb-1 h-8 w-1 rounded-full bg-night-edge" />
          <div className="h-8 w-1 rounded-full bg-night-edge" />
        </div>

        {/* Right: editor */}
        <section className="mt-3 flex min-h-[70vh] w-full min-w-0 flex-1 flex-col overflow-hidden lg:mt-0 lg:h-full lg:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-4 border-black/60 bg-night-panel shadow-pixel">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-black/60 bg-night-raised px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] uppercase text-ink-dim">Your solution</span>
                <ContestTimerButton contestId={contest.id} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Language selector */}
                {getContestLanguages(contest).length > 1 && (
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                    disabled={running || submittingJudge}
                    className="border-2 border-black/60 bg-night px-2 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:border-rust-orange focus:border-rust-orange focus:outline-none disabled:opacity-50"
                    aria-label="Programming language"
                  >
                    {getContestLanguages(contest).map((lang) => (
                      <option key={lang} value={lang}>
                        {LANGUAGE_LABELS[lang]}
                      </option>
                    ))}
                  </select>
                )}
                <PixelButton
                  size="sm"
                  onClick={() => void runTests()}
                  disabled={running || submittingJudge}
                >
                  {running ? 'Running…' : 'Run'}
                </PixelButton>
                <PixelButton
                  size="sm"
                  variant="secondary"
                  onClick={() => void submitTests()}
                  disabled={running || submittingJudge}
                >
                  {submittingJudge ? 'Submitting…' : 'Submit'}
                </PixelButton>
                <PixelButton
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowStats(true)}
                >
                  Stats
                </PixelButton>
                <PixelButton
                  size="sm"
                  variant="secondary"
                  onClick={() => setCode(getStarterCode(contest, language))}
                >
                  Reset
                </PixelButton>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-night">
              <MonacoEditor value={code} onChange={setCode} height="100%" fill language={LANGUAGE_MONACO_IDS[language]} />
            </div>
            <GradeResultPanel
              running={running || submittingJudge}
              runningLabel={submittingJudge ? 'Submitting full tests…' : 'Running first 3 tests…'}
              result={runResult}
              kind={gradeKind}
            />
            {toast ? (
              <p className="border-t-2 border-black/60 px-3 py-2 read-body text-lg text-rust-orange">
                {toast}
              </p>
            ) : null}
          </div>
        </section>
      </div>

      {showStats ? (
        <ContestStatsModal
          contestId={contest.id}
          refreshToken={statsTick}
          onClose={() => setShowStats(false)}
          onLoadCode={(loadedCode) => {
            setCode(loadedCode)
            setShowStats(false)
            flash('Loaded run code into editor.')
          }}
        />
      ) : null}

      {showSolutionConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden border-4 border-redstone bg-night-panel shadow-pixel">
            <div className="bg-redstone px-3 py-2 font-pixel text-[10px] uppercase text-ink">
              Warning: spoilers ahead
            </div>
            <div className="p-5">
              <p className="read-body text-xl text-ink">
                Are you sure you want to view the official solution? Solving it yourself first is
                worth more. This cannot be undone for this session until you hide it again.
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <PixelButton
                  variant="secondary"
                  onClick={() => setShowSolutionConfirm(false)}
                >
                  Cancel
                </PixelButton>
                <PixelButton variant="danger" onClick={() => void confirmRevealSolution()}>
                  Reveal answer
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
