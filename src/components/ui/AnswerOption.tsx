import { cx } from '../../lib/cx'
import { InlineMarkdown } from './InlineMarkdown'

export type AnswerResult = 'correct' | 'wrong' | 'missed' | null

export function AnswerOption({
  label,
  text,
  selected,
  disabled,
  result = null,
  onSelect,
}: {
  label: string
  text: string
  selected: boolean
  disabled?: boolean
  result?: AnswerResult
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cx(
        'pixel-ui w-full text-left',
        'border-3 border-night-edge bg-night-raised',
        'shadow-pixel transition-all duration-100 ease-linear',
        !disabled && 'hover:-translate-y-0.5 hover:shadow-pixel-lg hover:border-ink-faint',
        'disabled:cursor-default',
        selected && !result && 'outline outline-2 outline-diamond',
        result === 'correct' && 'bg-emerald/10 outline outline-2 outline-emerald',
        result === 'wrong' && 'bg-redstone/10 outline outline-2 outline-redstone',
        result === 'missed' && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-2.5 p-2.5 sm:gap-4 sm:p-4 min-h-[48px]">
        <div
          className={cx(
            'mt-0.5 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center',
            'border-3 border-night-edge bg-night font-pixel text-[9px] sm:text-[10px] text-ink-dim',
            result === 'correct' && 'border-emerald bg-emerald text-stone-darkest',
            result === 'wrong' && 'border-redstone bg-redstone text-white',
            selected && !result && 'border-diamond text-diamond'
          )}
        >
          {result === 'correct' ? '✓' : result === 'wrong' ? '✗' : label}
        </div>
        <div className="min-w-0 flex-1 font-code text-base leading-relaxed tracking-normal text-ink break-words sm:text-lg">
          <InlineMarkdown text={text} />
        </div>
      </div>
    </button>
  )
}
