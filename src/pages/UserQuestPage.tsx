import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelArrowLeft } from '../components/ui/PixelArrowLeft'
import { CodeBlock } from '../components/ui/CodeBlock'
import { AnswerOption } from '../components/ui/AnswerOption'
import { RatingControl } from '../components/ui/RatingControl'
import { AuthModal } from '../components/AuthModal'
import { TurnstileWidget, type TurnstileHandle } from '../components/TurnstileWidget'
import { SEO } from '../components/SEO'
import { useGuestClearance } from '../hooks/useGuestClearance'
import { MonacoEditor } from '../components/ui/MonacoEditor'
import { useAuth } from '../context/AuthContext'
import { useProgressStore } from '../store/progressStore'
import {
  getCommunityQuests,
  getPublicProfile,
  getQuestStats,
  getUserQuest,
  userQuestQuestionId,
  type QuestAnswerStats,
  type UserQuest,
} from '../lib/userQuests'
import { QuestComments } from '../components/QuestComments'
import { QuestReportPanel } from '../components/QuestReportPanel'
import { ShareBar } from '../components/ShareBar'
import { MarkdownBody } from '../components/MarkdownBody'
import { InlineMarkdown } from '../components/ui/InlineMarkdown'
import { ChallengeButton } from '../components/ChallengeButton'
import { absoluteUrl } from '../lib/share'
import { reportRivalAnswer } from '../lib/rivals'
import {
  findAdjacent,
  loadStoredPlaylist,
  parseNavSource,
  questHref,
  saveCommunityPlaylist,
  saveUserPlaylist,
  type QuestNavItem,
  type QuestNavSource,
} from '../lib/communityNav'
import { isReservedUsername } from '../lib/reserved'
import { difficultyLabel, OPTION_LABELS } from '../lib/quiz'
import { shuffledIndices } from '../lib/optionOrder'
import { customAuth } from '../lib/customAuth'
import { avatarUrl } from '../lib/avatar'
import { gradeRun, gradeSubmit, type GradeRunResult } from '../lib/grade'
import { GradeResultPanel } from '../components/GradeResultPanel'

const DRAFT_PREFIX = 'cratery_uq_coding_'
const KB_TIP_KEY = 'cratery_uq_kb_tip_dismissed'

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

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-block border-2 border-night-edge bg-slot px-1.5 py-0.5 font-pixel text-[9px] uppercase text-ink">
      {children}
    </kbd>
  )
}

export function UserQuestPage() {
  const { username, questSlug } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = username ?? ''
  const slug = questSlug ?? ''
  const navSource = parseNavSource(searchParams.get('from'))

  const [quest, setQuest] = useState<UserQuest | null>(null)
  const [loading, setLoading] = useState(() => !isReservedUsername(name))
  const [playlist, setPlaylist] = useState<QuestNavItem[]>([])
  const [showHint, setShowHint] = useState(false)
  const [selectedDisplay, setSelectedDisplay] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [stats, setStats] = useState<QuestAnswerStats>({ solve_count: 0, correct_count: 0 })
  const [reportOpen, setReportOpen] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileFailed, setTurnstileFailed] = useState(false)
  const [turnstileKey, setTurnstileKey] = useState(0)
  const { checking: clearanceChecking, needsTurnstile, markCleared, invalidate } =
    useGuestClearance(!user)
  const [code, setCode] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [submittingJudge, setSubmittingJudge] = useState(false)
  const [gradeKind, setGradeKind] = useState<'run' | 'submit'>('run')
  const [runResult, setRunResult] = useState<GradeRunResult | null>(null)
  const [showKbTip, setShowKbTip] = useState(() => {
    try {
      return localStorage.getItem(KB_TIP_KEY) !== '1'
    } catch {
      return true
    }
  })
  const turnstileRef = useRef<TurnstileHandle>(null)

  const retryTurnstile = () => {
    setTurnstileFailed(false)
    setTurnstileToken('')
    setTurnstileKey((k) => k + 1)
  }

  const answerQuestion = useProgressStore((s) => s.answerQuestion)
  const rateQuest = useProgressStore((s) => s.rateQuest)

  const questionId = quest ? userQuestQuestionId(quest.id) : ''
  const existingRating = useProgressStore((s) =>
    questionId ? (s.ratingsByQuestionId[questionId] ?? 0) : 0
  )
  const isCoding = quest?.kind === 'coding'

  const order = useMemo(
    () => (quest && !isCoding ? shuffledIndices(quest.options.length, quest.id) : [0, 1, 2, 3]),
    [quest, isCoding]
  )
  const correctDisplay = correctIndex === null ? -1 : order.indexOf(correctIndex)

  const { index: playlistIndex, prev, next } = useMemo(
    () => findAdjacent(playlist, name, slug),
    [playlist, name, slug]
  )

  const backTo = navSource === 'user' ? `/${name}` : '/community'
  const backLabel = navSource === 'user' ? name : 'Community'

  const dismissKbTip = () => {
    setShowKbTip(false)
    try {
      localStorage.setItem(KB_TIP_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const resetUi = () => {
    setShowHint(false)
    setSelectedDisplay(null)
    setSubmitting(false)
    setSubmitted(false)
    setIsCorrect(false)
    setCorrectIndex(null)
    setExplanation(null)
    setTurnstileToken('')
    setReportOpen(false)
    setReportSent(false)
    setToast(null)
    setCode('')
  }

  useEffect(() => {
    let cancelled = false
    const source: QuestNavSource = navSource ?? 'community'

    async function loadPlaylist() {
      const stored = loadStoredPlaylist(source, name)
      if (stored.length > 0) {
        if (!cancelled) setPlaylist(stored)
        return
      }
      if (source === 'community') {
        const rows = await getCommunityQuests(60)
        const items = rows.map((q) => ({ username: q.username, slug: q.slug }))
        saveCommunityPlaylist(items)
        if (!cancelled) setPlaylist(items)
        return
      }
      const profile = await getPublicProfile(name)
      if (!profile) {
        if (!cancelled) setPlaylist([])
        return
      }
      const items = profile.quests.map((q) => ({ username: profile.username, slug: q.slug }))
      saveUserPlaylist(profile.username, items)
      if (!cancelled) setPlaylist(items)
    }

    void loadPlaylist()
    return () => {
      cancelled = true
    }
  }, [navSource, name])

  useEffect(() => {
    if (isReservedUsername(name)) {
      return
    }
    let cancelled = false
    resetUi()
    setLoading(true)
    getUserQuest(name, slug)
      .then(async (q) => {
        if (cancelled) return
        setQuest(q)
        if (!q) return

        if (q.kind === 'coding') {
          setCode(loadCodingDraft(q.id, q.code ?? ''))
        }

        const qid = userQuestQuestionId(q.id)
        if (q.kind !== 'coding') {
          const rec = useProgressStore.getState().answersByQuestionId[qid]
          
          if (rec && rec.correctIndex !== undefined) {
            const displayOrder = shuffledIndices(q.options.length, q.id)
            const di = displayOrder.indexOf(rec.selectedIndex)
            setSelectedDisplay(di >= 0 ? di : rec.selectedIndex)
            setSubmitted(true)
            setIsCorrect(rec.isCorrect)
            setCorrectIndex(rec.correctIndex)
            if (rec.explanation) setExplanation(rec.explanation)
            else if (customAuth.getToken()) {
              const reveal = await useProgressStore.getState().answerQuestion({
                questionId: qid,
                selectedIndex: rec.selectedIndex,
              })
              if (!cancelled) {
                if (typeof reveal.correctIndex === 'number') setCorrectIndex(reveal.correctIndex)
                if (reveal.explanation) setExplanation(reveal.explanation)
                if (typeof reveal.isCorrect === 'boolean') setIsCorrect(reveal.isCorrect)
              }
            }
          }
        }

        const live = await getQuestStats(qid)
        if (!cancelled) setStats(live)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [name, slug])

  useEffect(() => {
    if (!quest || quest.kind !== 'coding' || !code) return
    saveCodingDraft(quest.id, code)
  }, [quest, code])

  const goTo = (item: QuestNavItem | null, fallback: string) => {
    if (item) navigate(questHref(item, navSource ?? 'community'))
    else navigate(fallback)
  }

  const goNext = () => {
    goTo(next, backTo)
  }

  const goPrev = () => {
    goTo(prev, backTo)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return
      }

      const key = e.key.toLowerCase()

      if (isCoding) {
        if (key === 'n' || (key === 'enter' && !e.shiftKey)) {
          e.preventDefault()
          goNext()
        }
        return
      }

      if (!submitted) {
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
        if (key in map && quest && map[key]! < quest.options.length) {
          e.preventDefault()
          setSelectedDisplay(map[key]!)
          return
        }
        if (key === 'escape') {
          e.preventDefault()
          setSelectedDisplay(null)
          return
        }
        if (key === 'h' && quest?.hint) {
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
    submitted,
    selectedDisplay,
    quest,
    next,
    prev,
    isCoding,
    navSource,
    backTo,
    turnstileToken,
    needsTurnstile,
    clearanceChecking,
    turnstileFailed,
  ])

  if (loading) {
    return (
      <PixelPanel>
        <div className="animate-pulse font-code text-lg text-ink-dim">Loading quest…</div>
      </PixelPanel>
    )
  }

  if (!quest) {
    return (
      <PixelPanel title="Quest not found">
        <SEO title="Quest Not Found" noIndex />
        <p className="read-body text-lg text-ink-dim">This quest does not exist.</p>
        <div className="mt-4 flex gap-3">
          <Link to={backTo}>
            <PixelButton variant="secondary">{backLabel}</PixelButton>
          </Link>
          <Link to="/">
            <PixelButton>Home</PixelButton>
          </Link>
        </div>
      </PixelPanel>
    )
  }

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const submit = async () => {
    if (selectedDisplay === null || submitted || submitting || isCoding) return
    const storedIndex = order[selectedDisplay]!
    setSubmitting(true)
    const result = await answerQuestion({
      questionId,
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
        flash('Could not submit. Check your connection and try again.')
      }
      return
    }
    const resolvedCorrect = typeof result.isCorrect === 'boolean' ? result.isCorrect : false
    const resolvedIndex = typeof result.correctIndex === 'number' ? result.correctIndex : storedIndex

    if (!user) markCleared()
    setTurnstileToken('')
    setTurnstileFailed(false)
    
    setIsCorrect(resolvedCorrect)
    setCorrectIndex(resolvedIndex)
    setExplanation(result.explanation ?? null)
    setSubmitted(true)
    if (!result.alreadyAnswered) {
      setStats((s) => ({
        solve_count: s.solve_count + 1,
        correct_count: s.correct_count + (resolvedCorrect ? 1 : 0),
      }))
    }
    const rivalId = searchParams.get('rival')
    if (rivalId && user) {
      const rival = await reportRivalAnswer(rivalId, questionId)
      if (rival.rival?.status === 'complete') {
        navigate(`/rival/${rivalId}`)
      }
    }
  }

  const runTests = async () => {
    if (!quest.test_harness) {
      flash('This quest has no test harness.')
      return
    }
    setGradeKind('run')
    setRunning(true)
    setRunResult(null)
    try {
      const result = await gradeRun({ code, harness: quest.test_harness })
      setRunResult(result)
    } finally {
      setRunning(false)
    }
  }

  const submitTests = async () => {
    if (!quest.test_harness) {
      flash('This quest has no test harness.')
      return
    }
    setGradeKind('submit')
    setSubmittingJudge(true)
    setRunResult(null)
    const qid = userQuestQuestionId(quest.id)
    try {
      const result = await gradeSubmit({ code, harness: quest.test_harness, contestId: qid })
      setRunResult(result)
      if (result.passed) {
        useProgressStore.getState().recordCodingSuccess(qid, {
          xpEarned: result.xpEarned,
          totalXp: result.totalXp,
        })
        setSubmitted(true)
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

  const showStickyNav = isCoding || submitted
  const positionLabel =
    playlistIndex >= 0 && playlist.length > 0
      ? `${playlistIndex + 1}/${playlist.length}`
      : null

  return (
    <div className="space-y-5 pb-24">
      <SEO
        title={`${quest.title} - quest by ${name}`}
        description={quest.prompt.substring(0, 150)}
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
            Community · {isCoding ? 'coding' : 'quiz'}
            {positionLabel ? ` · ${positionLabel}` : ''} · {difficultyLabel(quest.difficulty)}
          </div>
          {!isCoding ? (
            <div className="mt-1 font-code text-base normal-case tracking-normal text-ink-faint">
              {stats.solve_count} attempts · {stats.correct_count} solved
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="min-w-0 font-pixel text-sm uppercase tracking-[0.02em] text-ink">
          <InlineMarkdown text={quest.title} variant="title" />
        </h1>
        {isCoding ? (
          <ShareBar
            url={absoluteUrl(`/${name}/${slug}`)}
            text={`Rust quest by ${name}: ${quest.title}. Can you solve it?`}
          />
        ) : null}
      </div>

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
              <InlineMarkdown text={quest.prompt} />
            </div>
            {quest.hint ? (
              <div className="mb-4 space-y-3">
                <PixelButton size="sm" variant="secondary" onClick={() => setShowHint((open) => !open)}>
                  Hint
                </PixelButton>
                {showHint ? (
                  <div className="border-3 border-gold bg-gold/10 p-4 shadow-pixel">
                    <div className="font-pixel text-[10px] uppercase text-gold">Hint</div>
                    <div className="mt-2 read-body text-xl leading-relaxed text-ink">
                      <InlineMarkdown text={quest.hint} />
                    </div>
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
                onClick={() => setCode(quest.code ?? '')}
              >
                Reset starter
              </PixelButton>
            </div>
            <GradeResultPanel
              running={running || submittingJudge}
              runningLabel={submittingJudge ? 'Submitting full tests…' : 'Running first 3 tests…'}
              result={runResult}
              kind={gradeKind}
            />
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
                  rateQuest({ questionId, rating: r })
                }}
              />
            </div>
          </PixelPanel>
        </>
      ) : (
        <>
          {quest.code ? <CodeBlock code={quest.code} language="rust" /> : null}

          <PixelPanel>
            <div className="mb-4 read-body text-2xl leading-snug text-ink">
              <InlineMarkdown text={quest.prompt} />
            </div>

            <div className="grid gap-2.5" role="listbox" aria-label="Answer options">
              {order.map((storedIndex, displayIndex) => {
                const text = quest.options[storedIndex] ?? ''
                let result: 'correct' | 'wrong' | 'missed' | null = null
                if (submitted && correctDisplay >= 0) {
                  if (displayIndex === correctDisplay) result = 'correct'
                  else if (displayIndex === selectedDisplay) result = 'wrong'
                  else result = 'missed'
                }
                return (
                  <AnswerOption
                    key={`${storedIndex}-${OPTION_LABELS[displayIndex]}`}
                    label={OPTION_LABELS[displayIndex]!}
                    text={text}
                    selected={selectedDisplay === displayIndex}
                    disabled={submitted || submitting}
                    result={result}
                    onSelect={() => setSelectedDisplay(displayIndex)}
                  />
                )
              })}
            </div>

            {!submitted ? (
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
                  {quest.hint ? (
                    <PixelButton
                      variant="secondary"
                      onClick={() => setShowHint((open) => !open)}
                    >
                      Hint · H
                    </PixelButton>
                  ) : null}
                </div>
              </div>
            ) : null}

            {showHint && !submitted && quest.hint ? (
              <div className="mt-4 border-3 border-gold bg-gold/10 p-4 shadow-pixel">
                <div className="font-pixel text-[10px] uppercase text-gold">Hint</div>
                <div className="mt-2 read-body text-xl leading-relaxed text-ink">
                  <InlineMarkdown text={quest.hint} />
                </div>
              </div>
            ) : null}
          </PixelPanel>

          {submitted ? (
            <div
              className={`pixel-ui border-4 shadow-pixel ${
                isCorrect ? 'border-emerald bg-emerald/10' : 'border-redstone bg-redstone/10'
              }`}
            >
              <div className="border-b-3 border-black/60 px-4 py-3 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-pixel text-sm uppercase text-ink">
                      {isCorrect ? '✓ Correct' : '✗ Not quite'}
                    </div>
                    {!isCorrect && correctIndex !== null ? (
                      <p className="mt-2 font-code text-lg tracking-normal text-ink-dim">
                        Answer {OPTION_LABELS[correctDisplay]}:{' '}
                        <InlineMarkdown text={quest.options[correctIndex] ?? ''} />
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-stretch gap-3 sm:items-end">
                    <RatingControl
                      rating={existingRating}
                      onChange={(r) => {
                        if (!user) {
                          setShowAuthModal(true)
                          return
                        }
                        rateQuest({ questionId, rating: r })
                      }}
                    />
                    <ShareBar
                      url={absoluteUrl(`/${name}/${slug}`)}
                      text={
                        isCorrect
                          ? `I got this Rust quest: ${quest.title}. Your turn.`
                          : `Rust quest by ${name}: ${quest.title}. Can you solve it?`
                      }
                    />
                    <ChallengeButton questionIds={[questionId]} label="Challenge a friend" />
                  </div>
                </div>
              </div>

              <div className="bg-night-panel px-4 py-5 sm:px-6 sm:py-6">
                <div className="font-pixel text-[10px] uppercase tracking-wider text-ink-dim mb-3">
                  Explanation
                </div>
                <div className="text-ink">
                  <MarkdownBody>
                    {explanation?.trim()
                      ? explanation
                      : 'No explanation was provided for this quest.'}
                  </MarkdownBody>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      <PixelPanel className="border-rust-orange">
        <div className="flex flex-col items-center gap-4 py-2 text-center sm:flex-row sm:text-left">
          <div className="h-14 w-14 shrink-0 overflow-hidden border-4 border-black/60 bg-night-raised shadow-pixel">
            <img
              src={avatarUrl(quest.author_id || name, quest.author_avatar)}
              alt={name}
              className="h-full w-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-pixel text-[10px] uppercase text-ink">
              Quest by <span className="text-rust-orange">{name}</span>
            </div>
            <p className="mt-1 text-sm text-ink-dim">
              Enjoyed this one? Create your own Rust quest and get a shareable link of your own.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-2">
            <Link to={`/${name}`}>
              <PixelButton size="sm" variant="secondary">
                Author profile
              </PixelButton>
            </Link>
            <Link to="/create">
              <PixelButton size="sm">Create yours</PixelButton>
            </Link>
            {!reportOpen && !reportSent ? (
              <PixelButton size="sm" variant="danger" onClick={() => setReportOpen(true)}>
                Report
              </PixelButton>
            ) : null}
          </div>
        </div>
      </PixelPanel>

      {/* Community: Report button stays on the author strip; form expands below. */}
      <QuestReportPanel
        key={questionId}
        questionId={questionId}
        title={quest.title}
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSent={() => setReportSent(true)}
      />

      <QuestComments key={questionId} questionId={questionId} />

      {showStickyNav ? (
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
              {prev ? (
                <PixelButton variant="secondary" onClick={goPrev}>
                  Prev
                </PixelButton>
              ) : null}
              <PixelButton className="flex-1 sm:flex-none" onClick={goNext}>
                {next ? 'Next →' : `Back to ${backLabel} ✓`}
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
