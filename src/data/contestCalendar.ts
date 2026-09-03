

export type ContestCalendarEntry = {
  id: string
  title: string
  weekLabel: string
  difficulty: 1 | 2 | 3
  opensAt: string
  closesAt: string
}


export const contestCalendar: ContestCalendarEntry[] = [
  {
    id: '2026-09-03-generational-arena',
    title: 'The Generational Slot Arena',
    weekLabel: 'Thu Sep 3 → Thu Sep 10, 2026',
    difficulty: 2,
    opensAt: '2026-09-03T00:00:00.000Z',
    closesAt: '2026-09-10T00:00:00.000Z',
  },
  {
    id: '2026-08-27-versioned-kv',
    title: 'The Multi-Version Key-Value Store',
    weekLabel: 'Thu Aug 27 → Thu Sep 3, 2026',
    difficulty: 2,
    opensAt: '2026-08-27T00:00:00.000Z',
    closesAt: '2026-09-03T00:00:00.000Z',
  },
  {
    id: '2026-08-20-frame-multiplexer',
    title: 'The MicroVM Frame Multiplexer',
    weekLabel: 'Thu Aug 20 → Thu Aug 27, 2026',
    difficulty: 3,
    opensAt: '2026-08-20T00:00:00.000Z',
    closesAt: '2026-08-27T00:00:00.000Z',
  },
  {
    id: '2026-08-13-lexicon',
    title: 'The Alien Lexicon',
    weekLabel: 'Thu Aug 13 → Thu Aug 20',
    difficulty: 2,
    opensAt: '2026-08-13T00:00:00.000Z',
    closesAt: '2026-08-20T00:00:00.000Z',
  },
  {
    id: '2026-08-06-scheduler',
    title: 'Interval Task Scheduler',
    weekLabel: 'Thu Aug 6 → next Thu Aug 13',
    difficulty: 3,
    opensAt: '2026-08-06T00:00:00.000Z',
    closesAt: '2026-08-13T00:00:00.000Z',
  },
  {
    id: '2026-02-12-dag-path',
    title: 'Maximum Path Value in Weighted DAG',
    weekLabel: 'Thu Feb 12 → Thu Feb 19, 2026',
    difficulty: 3,
    opensAt: '2026-02-12T00:00:00.000Z',
    closesAt: '2026-02-19T00:00:00.000Z',
  },
  {
    id: '2026-02-05-coalescer',
    title: 'Adaptive Request Coalescer',
    weekLabel: 'Thu Feb 5 → Thu Feb 12, 2026',
    difficulty: 3,
    opensAt: '2026-02-05T00:00:00.000Z',
    closesAt: '2026-02-12T00:00:00.000Z',
  },
  {
    id: '2026-01-29-cache',
    title: 'The Lifetime-Safe Cache',
    weekLabel: 'Thu Jan 29 → Thu Feb 5, 2026',
    difficulty: 3,
    opensAt: '2026-01-29T00:00:00.000Z',
    closesAt: '2026-02-05T00:00:00.000Z',
  },
]

export function contestCalendarEntry(id: string): ContestCalendarEntry {
  const entry = contestCalendar.find((c) => c.id === id)
  if (!entry) throw new Error(`unknown contest calendar id: ${id}`)
  return entry
}


export function getLiveContest(now = Date.now()): ContestCalendarEntry | undefined {
  return contestCalendar.find((c) => {
    const open = Date.parse(c.opensAt)
    const close = Date.parse(c.closesAt)
    return now >= open && now < close
  })
}
