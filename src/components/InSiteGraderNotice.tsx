import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PixelPanel } from './ui/PixelPanel'
import { PixelButton } from './ui/PixelButton'

const DISMISS_KEY = 'cratery_dismissed_insite_grader_v2'

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

function persistDismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function InSiteGraderNotice() {
  const [open, setOpen] = useState(() => !wasDismissed())

  const close = useCallback(() => {
    persistDismiss()
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="insite-grader-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="w-full max-w-md">
        <PixelPanel>
          <div className="mb-3 flex items-start gap-3 border-b-2 border-night-edge pb-3">
            <div className="min-w-0 flex-1">
              <div className="font-pixel text-[9px] uppercase tracking-wider text-rust-orange">
                What&apos;s new
              </div>
              <h2
                id="insite-grader-title"
                className="mt-2 font-pixel text-sm uppercase leading-relaxed text-ink"
              >
                Grade Rust on Cratery
              </h2>
            </div>
            <button
              type="button"
              className="shrink-0 font-pixel text-[10px] text-ink-dim hover:text-ink"
              onClick={close}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="read-body text-xl leading-relaxed text-ink-dim">
            Weekly contests and community coding quests both compile and run in the site judge.
            Hit <span className="text-ink">Run</span> or <span className="text-ink">Submit</span>{' '}
            in the editor (no Playground tab required).
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/contest" onClick={close}>
              <PixelButton size="sm">Try a contest</PixelButton>
            </Link>
            <Link to="/community" onClick={close}>
              <PixelButton size="sm" variant="secondary">
                Coding quests
              </PixelButton>
            </Link>
            <PixelButton size="sm" variant="secondary" onClick={close}>
              Got it
            </PixelButton>
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}
