import { useEffect, useRef, useState } from 'react'
import { formatElapsed, useContestTimer } from '../hooks/useContestTimer'
import { PixelButton } from './ui/PixelButton'

export function ContestTimerButton({ contestId }: { contestId: string }) {
  const { elapsedMs, running, start, pause, reset } = useContestTimer(contestId)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const idle = !running && elapsedMs === 0

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`box-border flex h-9 w-9 items-center justify-center border-3 border-black/60 bg-night-panel shadow-pixel ${
          running ? 'text-rust-orange' : 'text-ink-dim'
        }`}
        aria-expanded={open}
        aria-label="Contest timer"
        title="Timer"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M12 9v4l2.5 1.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <div className="absolute left-0 z-30 mt-1 min-w-[10rem] border-3 border-black/60 bg-night-panel p-2 shadow-pixel">
          <div className="mb-2 text-center font-code text-lg tabular-nums text-ink">
            {formatElapsed(elapsedMs)}
          </div>
          <div className="flex flex-col gap-1.5">
            {running ? (
              <PixelButton size="sm" variant="secondary" onClick={pause}>
                Pause
              </PixelButton>
            ) : idle ? (
              <PixelButton size="sm" onClick={start}>
                Start
              </PixelButton>
            ) : (
              <PixelButton size="sm" onClick={start}>
                Resume
              </PixelButton>
            )}
            {!idle ? (
              <PixelButton size="sm" variant="secondary" onClick={reset}>
                Reset
              </PixelButton>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
