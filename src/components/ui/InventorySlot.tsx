import type { PropsWithChildren } from 'react'
import { cx } from '../../lib/cx'

export function InventorySlot({
  children,
  className,
  selected,
}: PropsWithChildren<{ className?: string; selected?: boolean }>) {
  return (
    <div
      className={cx(
        'pixel-ui flex items-center justify-center',
        'h-16 w-16',
        'border-3 bg-slot shadow-pixel',
        selected ? 'border-rust-orange' : 'border-black/60',
        className,
      )}
    >
      {children}
    </div>
  )
}
