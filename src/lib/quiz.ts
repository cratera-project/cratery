type Difficulty = 1 | 2 | 3

export const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export type Category = {
  slug: string
  name: string
  icon: string
  description: string
  isInteractive?: boolean
  tagline?: string
}

type QuizOption = {
  label: string
  text: string
}

export type QuestionKind = 'mcq' | 'coding'

export type Question = {
  id: string
  categorySlug: string
  title: string
  prompt: string
  kind?: QuestionKind
  code?: string
  testHarness?: string
  language: 'rust'
  options?: QuizOption[]
  correctIndex?: number
  
  hint?: string
  explanation: string
  difficulty: Difficulty
  tags: string[]
}

const CATEGORY_HINTS: Record<string, string> = {
  ownership: 'Track who owns the data after each assignment or function call.',
  lifetimes: 'Ask which reference is still valid when the function returns.',
  traits: 'Focus on what the trait bound requires of the concrete type.',
  concurrency: 'Consider Send/Sync and whether ownership or borrowing crosses the thread boundary.',
  pointers: 'Decide whether you need exclusive, shared, or interior-mutable access.',
  macros: 'Expand the macro mentally: what tokens does it actually produce?',
  'error-handling': 'Follow the Result/Option path: early return, map, or unwrap?',
  'iterators-closures': 'Check what the closure captures and whether it needs Fn, FnMut, or FnOnce.',
  'borrow-checker': 'Look for overlapping mutable borrows or a borrow that outlives its owner.',
}

export function getHint(question: Question): string {
  if (question.hint?.trim()) return question.hint
  return (
    CATEGORY_HINTS[question.categorySlug] ??
    'Identify the single Rust rule this snippet is testing, then eliminate options that break it.'
  )
}

export function difficultyLabel(d: number): string {
  return d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard'
}
