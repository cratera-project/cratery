import { useState, useEffect } from 'react'
import type { TutorialCodingQuest } from '../../data/tutorial/types'
import { MonacoEditor } from '../ui/MonacoEditor'
import { PixelButton } from '../ui/PixelButton'
import { GradeResultPanel } from '../GradeResultPanel'
import { CodeBlock } from '../ui/CodeBlock'
import { MarkdownBody } from '../MarkdownBody'
import { gradeRun, type GradeRunResult } from '../../lib/grade'
import { useProgressStore } from '../../store/progressStore'
import { Play, RotateCcw, HelpCircle, Eye, CheckCircle2, Terminal } from 'lucide-react'

type Props = {
  quest: TutorialCodingQuest
}

const TUT_DRAFT_PREFIX = 'cratery_tut_draft_'

export function TutorialQuestRunner({ quest }: Props) {
  const recordCodingSuccess = useProgressStore((s) => s.recordCodingSuccess)
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)

  const isAlreadySolved = answersByQuestionId[quest.id]?.isCorrect === true

  const [code, setCode] = useState(() => {
    try {
      return localStorage.getItem(TUT_DRAFT_PREFIX + quest.id) || quest.starterCode
    } catch {
      return quest.starterCode
    }
  })

  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<GradeRunResult | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  
  useEffect(() => {
    setShowSolution(false)
    setShowHint(false)
    setResult(null)
    setToast(null)
    try {
      setCode(localStorage.getItem(TUT_DRAFT_PREFIX + quest.id) || quest.starterCode)
    } catch {
      setCode(quest.starterCode)
    }
  }, [quest.id, quest.starterCode])

  useEffect(() => {
    try {
      localStorage.setItem(TUT_DRAFT_PREFIX + quest.id, code)
    } catch {
      /* ignore */
    }
  }, [code, quest.id])

  const handleRun = async () => {
    if (running) return
    setRunning(true)
    setResult(null)
    setToast(null)

    try {
      const res = await gradeRun({
        code,
        harness: quest.testHarness,
        language: 'rust',
      })
      setResult(res)
      if (res.passed) {
        recordCodingSuccess(quest.id, {
          xpEarned: quest.xpReward || 15,
        })
        setToast(`All tests passed! Quest Completed! +${quest.xpReward || 15} XP Earned!`)
      }
    } catch {
      setResult({ error: 'Network error communicating with judge engine' })
    } finally {
      setRunning(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset editor to original starter code?')) {
      setCode(quest.starterCode)
      setResult(null)
      setToast(null)
    }
  }

  return (
    <div className="pixel-ui border-4 border-black/60 bg-night-panel p-4 sm:p-5 shadow-pixel space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-night-edge pb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald" />
          <span className="font-pixel text-[10px] uppercase text-emerald">
            Interactive Code Quest
          </span>
          <span className="border border-emerald/60 bg-emerald/10 px-1.5 py-0.5 font-pixel text-[9px] text-emerald">
            +{quest.xpReward || 15} XP
          </span>
        </div>
        {isAlreadySolved ? (
          <span className="flex items-center gap-1 font-pixel text-[9px] uppercase text-emerald">
            <CheckCircle2 className="h-3.5 w-3.5" /> Solved
          </span>
        ) : null}
      </div>

      {/* Quest Title & Prompt */}
      <div className="space-y-2">
        <h4 className="font-pixel text-xs uppercase text-ink">{quest.title}</h4>
        <div className="text-sm font-sans leading-relaxed text-stone-200">
          <MarkdownBody>{quest.prompt}</MarkdownBody>
        </div>
        <div className="inline-block border border-night-edge bg-night px-2.5 py-1 font-code text-xs text-emerald-300">
          Signature: <code>{quest.signature}</code>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="pixel-ui border-3 border-night-edge overflow-hidden shadow-inner">
        <MonacoEditor value={code} onChange={setCode} height="280px" language="rust" />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <PixelButton
            size="sm"
            variant="primary"
            onClick={() => void handleRun()}
            disabled={running}
          >
            <span className="flex items-center gap-1.5">
              <Play className="h-3 w-3 fill-current" />
              <span>{running ? 'Running…' : 'Run Tests'}</span>
            </span>
          </PixelButton>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink transition-colors cursor-pointer"
            title="Reset to starter code"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {quest.hints && quest.hints.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="flex items-center gap-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-gold transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowSolution((s) => !s)}
            className="flex items-center gap-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-rust-orange transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{showSolution ? 'Hide Solution' : 'Solution'}</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div className="border-2 border-emerald-500 bg-emerald-950/40 p-2.5 font-code text-xs text-emerald-300">
          {toast}
        </div>
      )}

      {/* Judge Execution Output Panel */}
      <GradeResultPanel
        running={running}
        runningLabel="Executing tests in isolated microVM…"
        result={result}
        kind="run"
      />

      {/* Hints Dropdown */}
      {showHint && quest.hints && (
        <div className="border-3 border-gold bg-gold/10 p-3.5 shadow-pixel space-y-1.5">
          <div className="font-pixel text-[9px] uppercase text-gold">Hints:</div>
          <ul className="list-disc pl-4 space-y-1 text-xs font-sans text-ink">
            {quest.hints.map((h, idx) => (
              <li key={idx}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Solution Walkthrough Panel */}
      {showSolution && (
        <div className="border-3 border-rust-orange/60 bg-night p-4 shadow-pixel space-y-2.5">
          <div className="font-pixel text-[10px] uppercase text-rust-orange">
            Reference Solution & Walkthrough
          </div>
          <CodeBlock code={quest.solutionCode} language="rust" />
          <div className="text-xs font-sans leading-relaxed text-stone-300">
            <MarkdownBody>{quest.solutionWalkthrough}</MarkdownBody>
          </div>
        </div>
      )}
    </div>
  )
}
