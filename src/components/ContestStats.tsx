import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PixelButton } from './ui/PixelButton'
import { absoluteUrl, copyText, contestBenchmarkShareText, xIntentUrl } from '../lib/share'
import {
  clearContestRuns,
  formatMemoryKb,
  formatRunMs,
  getContestLeaderboard,
  getContestRuns,
  type ContestRunItem,
  type ContestStanding,
} from '../lib/grade'

export function ContestStatsModal({
  contestId,
  refreshToken = 0,
  onClose,
  onLoadCode,
}: {
  contestId: string
  refreshToken?: number
  onClose: () => void
  onLoadCode?: (code: string) => void
}) {
  const { user } = useAuth()
  const [entries, setEntries] = useState<ContestStanding[]>([])
  const [runs, setRuns] = useState<ContestRunItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'submit' | 'run'>('all')
  const [copiedChallenge, setCopiedChallenge] = useState(false)
  const [copiedFlex, setCopiedFlex] = useState(false)

  useEffect(() => {
    if (!copiedChallenge) return
    const id = window.setTimeout(() => setCopiedChallenge(false), 2000)
    return () => window.clearTimeout(id)
  }, [copiedChallenge])

  useEffect(() => {
    if (!copiedFlex) return
    const id = window.setTimeout(() => setCopiedFlex(false), 2000)
    return () => window.clearTimeout(id)
  }, [copiedFlex])

  const handleChallenge = async () => {
    const ok = await copyText(absoluteUrl(`/contest/${contestId}`))
    if (ok) setCopiedChallenge(true)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setRuns(getContestRuns(contestId))
    getContestLeaderboard(contestId, 100)
      .then((rows) => {
        if (!cancelled) setEntries(rows)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [contestId, refreshToken])

  const handleClearRuns = () => {
    clearContestRuns(contestId)
    setRuns([])
  }

  const mine = user
    ? entries.find((e) => e.username.toLowerCase() === user.username.toLowerCase())
    : undefined
  const others = mine ? entries.filter((e) => e !== mine) : entries

  const filteredRuns = runs.filter((r) => {
    if (activeTab === 'submit') return r.kind === 'submit'
    if (activeTab === 'run') return r.kind === 'run'
    return true
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden border-4 border-black/60 bg-night-panel shadow-pixel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 bg-night-raised px-3 py-2">
          <span className="font-pixel text-[10px] uppercase">Your stats & run history</span>
          <PixelButton size="sm" variant="secondary" onClick={onClose}>
            Close
          </PixelButton>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-4">
          {/* Best Benchmark Card */}
          <div>
            <div className="mb-2 font-pixel text-[9px] uppercase text-ink-dim">
              Personal Best (Official Standings)
            </div>
            {loading ? (
              <p className="font-code text-base text-ink-dim">Loading leaderboard stats…</p>
            ) : !user ? (
              <p className="read-body text-base text-ink-dim">Sign in to see how you compare with other solvers.</p>
            ) : !mine ? (
              <div className="border-2 border-dashed border-black/60 bg-night-raised p-3 text-center">
                <p className="read-body text-base text-ink-dim">
                  Submit an accepted solution to see your runtime and RAM percentile vs other solvers.
                </p>
              </div>
            ) : (() => {
              const runtimeBeat = beatPct(mine.run_ms, others.map((e) => e.run_ms))
              const ramBeat = beatPct(mine.memory_kb, others.map((e) => e.memory_kb))
              const shareFlex = async () => {
                const text = contestBenchmarkShareText({
                  title: contestId,
                  url: absoluteUrl(`/contest/${contestId}`),
                  runMs: formatRunMs(mine.run_ms),
                  memoryKb: formatMemoryKb(mine.memory_kb),
                  percentile: Math.max(runtimeBeat, ramBeat),
                })
                const ok = await copyText(text)
                if (ok) setCopiedFlex(true)
              }

              return (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <BeatStat
                      label="Runtime Beat"
                      pct={runtimeBeat}
                      detail={formatRunMs(mine.run_ms)}
                    />
                    <BeatStat
                      label="RAM Beat"
                      pct={ramBeat}
                      detail={formatMemoryKb(mine.memory_kb)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PixelButton
                      size="sm"
                      variant={copiedFlex ? 'success' : 'primary'}
                      onClick={() => void shareFlex()}
                    >
                      {copiedFlex ? '✓ Copied Flex!' : 'Copy Benchmark Flex'}
                    </PixelButton>
                    <a
                      href={xIntentUrl(
                        absoluteUrl(`/contest/${contestId}`),
                        contestBenchmarkShareText({
                          title: contestId,
                          url: absoluteUrl(`/contest/${contestId}`),
                          runMs: formatRunMs(mine.run_ms),
                          memoryKb: formatMemoryKb(mine.memory_kb),
                          percentile: Math.max(runtimeBeat, ramBeat),
                        })
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PixelButton size="sm" variant="secondary">
                        Share on X
                      </PixelButton>
                    </a>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Runs History */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/60 pb-2">
              <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-dim">
                <span>Recent Runs ({runs.length})</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2 py-0.5 font-pixel text-[8px] uppercase border border-black/60 transition-colors ${
                    activeTab === 'all' ? 'bg-gold text-black' : 'bg-night text-ink-dim hover:text-ink'
                  }`}
                >
                  All ({runs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('submit')}
                  className={`px-2 py-0.5 font-pixel text-[8px] uppercase border border-black/60 transition-colors ${
                    activeTab === 'submit' ? 'bg-gold text-black' : 'bg-night text-ink-dim hover:text-ink'
                  }`}
                >
                  Submissions ({runs.filter((r) => r.kind === 'submit').length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('run')}
                  className={`px-2 py-0.5 font-pixel text-[8px] uppercase border border-black/60 transition-colors ${
                    activeTab === 'run' ? 'bg-gold text-black' : 'bg-night text-ink-dim hover:text-ink'
                  }`}
                >
                  Runs ({runs.filter((r) => r.kind === 'run').length})
                </button>
                {runs.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleClearRuns}
                    className="ml-2 px-1.5 py-0.5 font-pixel text-[8px] uppercase text-ink-faint hover:text-redstone transition-colors"
                    title="Clear local run history"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-2 space-y-2">
              {filteredRuns.length === 0 ? (
                <div className="border-2 border-dashed border-black/60 bg-night-raised p-4 text-center">
                  <p className="read-body text-base text-ink-dim">
                    No {activeTab === 'all' ? 'runs' : activeTab === 'submit' ? 'submissions' : 'test runs'} recorded yet. Click <strong>Run</strong> or <strong>Submit</strong> in the editor.
                  </p>
                </div>
              ) : (
                filteredRuns.map((r) => (
                  <RunItemCard key={r.id} run={r} onLoadCode={onLoadCode} />
                ))
              )}
            </div>
          </div>

          <div className="pt-2">
            <PixelButton
              size="sm"
              variant="secondary"
              onClick={() => void handleChallenge()}
            >
              {copiedChallenge ? 'Link copied' : 'Challenge a friend'}
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function beatPct(mine: number, others: number[]): number {
  if (others.length === 0) return 100
  return Math.round((100 * others.filter((v) => v > mine).length) / others.length)
}

function formatRelativeTime(ts: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function BeatStat({ label, pct, detail }: { label: string; pct: number; detail: string }) {
  return (
    <div className="border-2 border-black/60 bg-night px-3 py-2">
      <div className="font-pixel text-[8px] uppercase text-ink-dim">{label}</div>
      <div className="mt-1 font-pixel text-sm uppercase text-gold">Beat {pct}%</div>
      <div className="mt-1 font-code text-base text-ink-faint">{detail}</div>
    </div>
  )
}

function RunItemCard({
  run,
  onLoadCode,
}: {
  run: ContestRunItem
  onLoadCode?: (code: string) => void
}) {
  const [showDetails, setShowDetails] = useState(false)
  const isOk = run.passed === true || run.verdict === 'AC'
  const verdict = run.verdict || run.status || (isOk ? 'AC' : 'Failed')
  const time =
    typeof run.executionTime === 'number' && run.executionTime >= 0
      ? formatRunMs(run.executionTime)
      : '-'
  const memory =
    typeof run.memoryKb === 'number' && run.memoryKb >= 32
      ? formatMemoryKb(run.memoryKb)
      : '-'

  return (
    <div className="border-2 border-black/60 bg-night-raised p-2.5 transition-colors hover:border-black/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-1.5 py-0.5 font-pixel text-[8px] uppercase border border-black/60 ${
              run.kind === 'submit' ? 'bg-gold/20 text-gold border-gold/40' : 'bg-night text-ink-dim'
            }`}
          >
            {run.kind === 'submit' ? 'Submit' : 'Run'}
          </span>
          <span
            className={`font-pixel text-[9px] uppercase font-bold ${
              isOk ? 'text-emerald' : 'text-redstone'
            }`}
          >
            {verdict}
          </span>
          {run.scoreUpdated ? (
            <span className="font-pixel text-[8px] text-gold uppercase">★ Personal Best</span>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-code text-xs text-ink-dim">
            <span>
              Time: <strong className="text-ink">{time}</strong>
            </span>
            <span>·</span>
            <span>
              RAM: <strong className="text-ink">{memory}</strong>
            </span>
          </div>
          <span className="font-pixel text-[8px] text-ink-faint">
            {formatRelativeTime(run.timestamp)}
          </span>
        </div>
      </div>

      {(run.code || run.error || run.compilationError) ? (
        <div className="mt-2 flex items-center justify-between border-t border-black/40 pt-1.5">
          <button
            type="button"
            onClick={() => setShowDetails((d) => !d)}
            className="font-pixel text-[8px] uppercase text-ink-dim hover:text-ink transition-colors"
          >
            {showDetails ? 'Hide details −' : 'Show details +'}
          </button>

          {run.code && onLoadCode ? (
            <button
              type="button"
              onClick={() => onLoadCode(run.code!)}
              className="font-pixel text-[8px] uppercase text-rust-orange hover:text-gold transition-colors"
            >
              Load this code
            </button>
          ) : null}
        </div>
      ) : null}

      {showDetails ? (
        <div className="mt-2 space-y-1.5 border-t border-black/60 pt-2 font-code text-xs">
          {run.error ? (
            <p className="text-redstone">{run.error}</p>
          ) : null}
          {run.compilationError ? (
            <pre className="max-h-28 overflow-y-auto whitespace-pre-wrap text-redstone bg-night p-1.5 border border-black/60">
              {run.compilationError}
            </pre>
          ) : null}
          {run.wallMs ? (
            <p className="text-ink-dim">Total wall time: {run.wallMs}ms</p>
          ) : null}
          {run.code ? (
            <div>
              <p className="text-ink-dim text-[10px] mb-1 font-pixel uppercase">Snapshot of Code:</p>
              <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap bg-night p-2 text-ink border border-black/60 text-[11px]">
                {run.code}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

