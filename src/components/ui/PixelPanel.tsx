import type { PropsWithChildren } from 'react'
import { cx } from '../../lib/cx'

export function PixelPanel({
  children,
  className,
  title,
}: PropsWithChildren<{ className?: string; title?: string }>) {
  return (
    <section
      className={cx(
        'pixel-ui bg-night-panel text-ink',
        'border-4 border-black/60 shadow-pixel',
        'p-4',
        className,
      )}
    >
      {title ? (
        <div className="mb-3 border-b-2 border-night-edge pb-2 font-pixel text-xs text-ink-dim">
          {title}
        </div>
      ) : null}
      {children}
    </section>
  )
}
