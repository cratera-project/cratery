import { useCallback, useEffect, useState } from 'react'

const KEY = 'cratery_contest_timer_'

type Stored = {
  startedAt: number | null
  elapsedMs: number
}

function load(id: string): Stored {
  try {
    const raw = localStorage.getItem(KEY + id)
    if (!raw) return { startedAt: null, elapsedMs: 0 }
    const parsed = JSON.parse(raw) as Stored
    const elapsedMs = Number(parsed.elapsedMs)
    const startedAt = parsed.startedAt == null ? null : Number(parsed.startedAt)
    if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
      return { startedAt: null, elapsedMs: 0 }
    }
    if (startedAt != null && !Number.isFinite(startedAt)) {
      return { startedAt: null, elapsedMs }
    }
    return { startedAt, elapsedMs }
  } catch {
    return { startedAt: null, elapsedMs: 0 }
  }
}

function save(id: string, state: Stored) {
  try {
    localStorage.setItem(KEY + id, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

function nowElapsed(state: Stored, now: number): number {
  if (state.startedAt == null) return state.elapsedMs
  return state.elapsedMs + Math.max(0, now - state.startedAt)
}

export function formatElapsed(ms: number): string {
  const total = Math.floor(Math.max(0, ms) / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}


export function useContestTimer(contestId: string) {
  const [state, setState] = useState<Stored>(() =>
    contestId ? load(contestId) : { startedAt: null, elapsedMs: 0 }
  )
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!contestId) {
      setState({ startedAt: null, elapsedMs: 0 })
      return
    }
    const next = load(contestId)
    setState(next)
    setNow(Date.now())
    save(contestId, next)
  }, [contestId])

  useEffect(() => {
    if (!contestId) return
    save(contestId, state)
  }, [contestId, state])

  const running = Boolean(contestId) && state.startedAt != null

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [running])

  const elapsedMs = nowElapsed(state, now)

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.startedAt != null) return prev
      return { startedAt: Date.now(), elapsedMs: prev.elapsedMs }
    })
  }, [])

  const pause = useCallback(() => {
    setState((prev) => {
      if (prev.startedAt == null) return prev
      return { startedAt: null, elapsedMs: nowElapsed(prev, Date.now()) }
    })
  }, [])

  const reset = useCallback(() => {
    setState({ startedAt: null, elapsedMs: 0 })
    setNow(Date.now())
  }, [])

  return { elapsedMs, running, start, pause, reset }
}
