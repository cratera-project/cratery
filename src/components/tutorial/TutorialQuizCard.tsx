import { useState } from 'react'
import type { TutorialQuizQuest } from '../../data/tutorial/types'
import { CodeBlock } from '../ui/CodeBlock'
import { MarkdownBody } from '../MarkdownBody'
import { InlineMarkdown } from '../ui/InlineMarkdown'
import { PixelButton } from '../ui/PixelButton'
import { useProgressStore } from '../../store/progressStore'
import { CheckCircle2, XCircle } from 'lucide-react'

type Props = {
  quest: TutorialQuizQuest
}

export function TutorialQuizCard({ quest }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const recordCodingSuccess = useProgressStore((s) => s.recordCodingSuccess)
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)

  const savedRecord = answersByQuestionId[quest.id]
  const isAlreadySolved = savedRecord?.isCorrect === true

  const isCorrect = submitted ? selectedIdx === quest.correctIndex : isAlreadySolved

  const handleSelect = (idx: number) => {
    if (submitted || isAlreadySolved) return
    setSelectedIdx(idx)
  }

  const handleSubmit = () => {
    if (selectedIdx === null) return
    setSubmitted(true)
    if (selectedIdx === quest.correctIndex) {
      recordCodingSuccess(quest.id, { xpEarned: quest.xpReward || 10 })
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setSelectedIdx(null)
  }

  return (
    <div className="pixel-ui border-4 border-black/60 bg-night-panel p-4 sm:p-5 shadow-pixel space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-night-edge pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] uppercase text-gold">
            Concept Check Quest
          </span>
          <span className="border border-gold/60 bg-gold/10 px-1.5 py-0.5 font-pixel text-[9px] text-gold">
            +{quest.xpReward || 10} XP
          </span>
        </div>
        {isAlreadySolved || (submitted && isCorrect) ? (
          <span className="flex items-center gap-1 font-pixel text-[9px] uppercase text-emerald">
            <CheckCircle2 className="h-3.5 w-3.5" /> Solved
          </span>
        ) : null}
      </div>

      {/* Prompt rendered with Markdown parser to format backticks and code snippets */}
      <div className="text-ink">
        <MarkdownBody>{quest.prompt}</MarkdownBody>
      </div>

      {/* Optional separate Code Snippet if present */}
      {quest.codeSnippet && (
        <CodeBlock code={quest.codeSnippet} language="rust" />
      )}

      {/* Retro Pixel Answer Options */}
      <div className="grid gap-2 pt-1" role="listbox" aria-label="Answer options">
        {quest.options.map((opt, idx) => {
          let containerStyle =
            'border-2 border-night-edge bg-night hover:border-ink-faint text-ink'
          let badgeStyle = 'border-night-edge bg-night-raised text-ink-dim'

          if (selectedIdx === idx && !submitted && !isAlreadySolved) {
            containerStyle = 'border-rust-orange bg-rust-orange/15 text-rust-orange font-medium'
            badgeStyle = 'border-rust-orange bg-rust-orange text-white'
          }

          if (submitted || isAlreadySolved) {
            if (idx === quest.correctIndex) {
              containerStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold'
              badgeStyle = 'border-emerald-500 bg-emerald-500 text-black font-bold'
            } else if (selectedIdx === idx && !isCorrect) {
              containerStyle = 'border-redstone bg-redstone/20 text-redstone'
              badgeStyle = 'border-redstone bg-redstone text-white'
            } else {
              containerStyle = 'border-night-edge/40 bg-night/30 text-ink-dim opacity-60'
              badgeStyle = 'border-night-edge/40 bg-night/20 text-ink-faint'
            }
          }

          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={submitted || isAlreadySolved}
              className={`pixel-ui flex w-full items-start gap-3 border-2 p-3 text-left transition-all ${containerStyle}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center border font-pixel text-[10px] ${badgeStyle}`}
              >
                {opt.label}
              </span>
              <span className="text-sm font-sans leading-snug pt-0.5">
                <InlineMarkdown text={opt.text} />
              </span>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-night-edge pt-3">
        <div className="flex items-center gap-2">
          {!submitted && !isAlreadySolved ? (
            <PixelButton
              size="sm"
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedIdx === null}
            >
              Submit Answer
            </PixelButton>
          ) : (
            <PixelButton size="sm" variant="secondary" onClick={handleReset}>
              Try Again
            </PixelButton>
          )}

          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="px-2 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-gold transition-colors"
          >
            {showHint ? 'Hide Hint' : 'Hint'}
          </button>
        </div>
      </div>

      {/* Hint Box */}
      {showHint && (
        <div className="border-3 border-gold bg-gold/10 p-3.5 shadow-pixel space-y-1">
          <div className="font-pixel text-[9px] uppercase text-gold">Hint:</div>
          <p className="text-xs font-sans text-ink leading-relaxed">{quest.hint}</p>
        </div>
      )}

      {/* Explanation Reveal */}
      {(submitted || isAlreadySolved) && (
        <div
          className={`border-3 p-4 shadow-pixel space-y-2 ${
            isCorrect
              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
              : 'border-redstone bg-redstone/10 text-redstone/95'
          }`}
        >
          <div className="flex items-center gap-1.5 font-pixel text-[10px] uppercase">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald" />
                <span className="text-emerald">Correct! +{quest.xpReward || 10} XP</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-redstone" />
                <span className="text-redstone">Incorrect</span>
              </>
            )}
          </div>
          <div className="text-xs sm:text-sm font-sans leading-relaxed text-ink">
            <MarkdownBody>{quest.explanation}</MarkdownBody>
          </div>
        </div>
      )}
    </div>
  )
}
