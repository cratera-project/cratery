import { cx } from '../../lib/cx'

export function ProgressBar({
  value,
  max,
  className,
  hideLabel,
}: {
  value: number
  max: number
  className?: string
  hideLabel?: boolean
}) {
  const safeMax = Math.max(1, max)
  const ratio = Math.max(0, Math.min(1, value / safeMax))
  const blocks = 12
  const filled = Math.round(ratio * blocks)
  const text = `${'█'.repeat(filled)}${'░'.repeat(Math.max(0, blocks - filled))}`

  return (
    <div className={cx('pixel-ui flex items-center gap-3', className)}>
      <span className="font-code text-lg leading-none text-emerald">{text}</span>
      {!hideLabel && (
        <span className="font-pixel text-[10px] text-ink-dim">{value}/{max}</span>
      )}
    </div>
  )
}
