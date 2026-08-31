import { useState, useEffect } from 'react'
import { formatMemoryKb, formatRunMs, type GradeRunResult } from '../lib/grade'
import { PixelButton } from './ui/PixelButton'
import { copyText, contestBenchmarkShareText, xIntentUrl } from '../lib/share'
import { useAuth } from '../context/AuthContext'
import { AuthModal } from './AuthModal'
import { Sparkles } from 'lucide-react'

export function GradeResultPanel({
  running,
  runningLabel = 'Running in the judge…',
  result,
  kind = 'run',
}: {
  running: boolean
  runningLabel?: string
  result: GradeRunResult | null
  kind?: 'run' | 'submit'
}) {
  const { user } = useAuth()
  const [copiedFlex, setCopiedFlex] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!copiedFlex) return
    const id = window.setTimeout(() => setCopiedFlex(false), 2000)
    return () => window.clearTimeout(id)
  }, [copiedFlex])

  if (!running && !result) return null

  if (running) {
    return (
      <p className="shrink-0 border-t-2 border-black/60 px-3 py-2 read-body text-lg text-ink-dim">
        {runningLabel}
      </p>
    )
  }

  if (!result) return null

  
  if (result.error && !result.status && !result.verdict) {
    if (result.requiresSignup || result.requiresAuth || result.rateLimited) {
      return (
        <>
          <div className="shrink-0 border-t-2 border-black/60 p-3 space-y-2 bg-rust-orange/15 border-2 border-rust-orange text-ink">
            <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-rust-orange font-bold">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span>{result.requiresAuth ? 'Sign In Required' : 'Execution Notice'}</span>
            </div>
            <p className="font-sans text-xs leading-relaxed text-ink/90">
              {result.error}
            </p>
            {!user && (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="pixel-ui inline-flex items-center justify-center gap-1.5 border-2 border-rust-orange bg-rust-orange px-3 py-1 font-pixel text-[9px] uppercase text-white hover:bg-rust-orange/90 shadow-pixel cursor-pointer"
              >
                <span>Sign Up Free (+20 XP)</span>
              </button>
            )}
          </div>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
      )
    }

    return (
      <p className="shrink-0 border-t-2 border-black/60 px-3 py-2 read-body text-lg text-redstone">
        {result.error}
      </p>
    )
  }

  const ok = result.passed
  const compileFail = result.verdict === 'CE' || result.status === 'Compilation Error'
  const verdict = result.verdict || result.status || 'Result'
  const time =
    compileFail || typeof result.executionTime !== 'number'
      ? '-'
      : formatRunMs(result.executionTime)
  const memory =
    compileFail || typeof result.memoryKb !== 'number' || result.memoryKb < 32
      ? '-'
      : formatMemoryKb(result.memoryKb)
  const tests = kind === 'submit' ? 'Full harness' : 'First 3 tests'

  let note: string | null = null
  if (ok && kind === 'run') {
    note = 'Sample tests only. Submit, then open Stats to see the percent you beat.'
  } else if (ok && kind === 'submit' && result.scoreUpdated) {
    note = 'Personal best recorded. Open Stats for runtime and RAM vs other solvers.'
  } else if (ok && kind === 'submit') {
    note = 'Accepted. Stats keep your fastest run (then lowest memory).'
  }

  return (
    <div className="shrink-0 border-t-2 border-black/60 px-3 py-2">
      <div className={`font-pixel text-[10px] uppercase ${ok ? 'text-emerald' : 'text-redstone'}`}>
        {verdict}
        {result.status && result.verdict && result.status !== result.verdict
          ? ` · ${result.status}`
          : ''}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Stat label="Time" value={time} />
        <Stat label="Memory" value={memory} />
        <Stat label="Tests" value={tests} />
      </div>
      {phaseLine(result) ? (
        <p className="mt-2 read-body text-lg text-ink-dim">{phaseLine(result)}</p>
      ) : null}
      {note ? <p className="mt-2 read-body text-lg text-ink-dim">{note}</p> : null}
      {result.compilationError ? (
        <pre className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap font-code text-sm text-redstone">
          {result.compilationError}
        </pre>
      ) : null}
      {result.stdout ? (
        <pre className="mt-2 max-h-24 overflow-y-auto whitespace-pre-wrap font-code text-sm text-ink">
          {result.stdout}
        </pre>
      ) : null}
      {result.stderr ? (
        <pre className="mt-2 max-h-24 overflow-y-auto whitespace-pre-wrap font-code text-sm text-ink-dim">
          {result.stderr}
        </pre>
      ) : null}
      {ok && kind === 'submit' ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <PixelButton
            size="sm"
            variant="secondary"
            className="!text-[10px]"
            onClick={async () => {
              const text = contestBenchmarkShareText({
                title: 'Rust Challenge',
                url: window.location.href,
                runMs: time !== '-' ? time : undefined,
                memoryKb: memory !== '-' ? memory : undefined,
              })
              const ok = await copyText(text)
              if (ok) setCopiedFlex(true)
            }}
          >
            {copiedFlex ? 'Copied benchmark!' : 'Copy benchmark'}
          </PixelButton>
          <a
            href={xIntentUrl(
              window.location.href,
              contestBenchmarkShareText({
                title: 'Rust Challenge',
                url: window.location.href,
                runMs: time !== '-' ? time : undefined,
                memoryKb: memory !== '-' ? memory : undefined,
              })
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <PixelButton size="sm" variant="secondary" className="!text-[10px]">
              Share on X
            </PixelButton>
          </a>
        </div>
      ) : null}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/40 bg-night-raised px-2 py-1">
      <div className="font-pixel text-[8px] uppercase text-ink-faint">{label}</div>
      <div className="font-code text-sm font-semibold text-ink">{value}</div>
    </div>
  )
}

function phaseLine(result: GradeRunResult): string | null {
  const parts: string[] = []
  if (result.compileMs != null && result.compileMs > 0) {
    parts.push(`compile ${result.compileMs}ms`)
  }
  if (result.bootMs != null && result.bootMs > 0) {
    parts.push(`boot ${result.bootMs}ms`)
  }
  if (result.wallMs != null && result.wallMs > 0) {
    parts.push(`total ${result.wallMs}ms`)
  }
  if (result.restored) {
    parts.push('warm VM')
  }
  return parts.length > 0 ? parts.join(' · ') : null
}
