import {
  ownershipQuestions,
  lifetimesQuestions,
  traitsQuestions,
  concurrencyQuestions,
  pointersQuestions,
  macrosQuestions,
  errorHandlingQuestions,
  iteratorsClosuresQuestions,
  borrowCheckerQuestions,
} from '../../../src/data/questions'
import { interactiveQuests } from '../../../src/data/interactiveQuests'
import { categories } from '../../../src/data/categories'
import { getDailyQuestion } from '../../../src/lib/daily'
import type { Question } from '../../../src/lib/quiz'
import type { Contest } from '../../../src/data/contests'

export { categories }

export type DiscordQuizItem = {
  id: string
  title: string
  categorySlug: string
  categoryName: string
  difficulty: number
  kind: 'mcq' | 'coding'
  prompt: string
  code?: string
  options?: Array<{ label: string; text: string }>
  correctIndex?: number
  explanation: string
  testHarness?: string
  starterCode?: string
}

const CATEGORY_NAME_MAP = new Map(categories.map((c) => [c.slug, c.name]))

const rawQuestions: Question[] = [
  ...ownershipQuestions,
  ...lifetimesQuestions,
  ...traitsQuestions,
  ...concurrencyQuestions,
  ...pointersQuestions,
  ...macrosQuestions,
  ...errorHandlingQuestions,
  ...iteratorsClosuresQuestions,
  ...borrowCheckerQuestions,
]

export const allDiscordQuizzes: DiscordQuizItem[] = [
  ...rawQuestions.map((q): DiscordQuizItem => ({
    id: q.id,
    title: q.title,
    categorySlug: q.categorySlug,
    categoryName: CATEGORY_NAME_MAP.get(q.categorySlug) || q.categorySlug,
    difficulty: q.difficulty,
    kind: q.kind === 'coding' ? 'coding' : 'mcq',
    prompt: q.prompt,
    code: q.code,
    options: q.options?.map((opt, idx) => ({
      label: ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`,
      text: opt.text,
    })),
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    testHarness: q.testHarness,
    starterCode: q.code,
  })),
  ...interactiveQuests.map((t: Contest): DiscordQuizItem => ({
    id: t.id,
    title: t.title,
    categorySlug: 'interactive',
    categoryName: 'Forge Trials',
    difficulty: t.difficulty,
    kind: 'coding',
    prompt: t.prompt,
    code: t.starterCode,
    options: undefined,
    correctIndex: undefined,
    explanation: `Passed test harness for ${t.title}. Signature: ${t.signature || 'Rust function'}.`,
    testHarness: t.testHarness,
    starterCode: t.starterCode,
  })),
]

export function getRandomQuiz(options?: {
  categorySlug?: string
  kind?: 'mcq' | 'coding'
}): DiscordQuizItem | null {
  let pool = allDiscordQuizzes

  if (options?.categorySlug && options.categorySlug !== 'all') {
    pool = pool.filter((q) => q.categorySlug === options.categorySlug)
  }

  if (options?.kind) {
    pool = pool.filter((q) => q.kind === options.kind)
  }

  if (pool.length === 0) return null
  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex] ?? null
}

export function getDailyQuiz(): DiscordQuizItem | null {
  const daily = getDailyQuestion()
  if (!daily) return null
  return getQuizById(daily.id)
}

export function getQuizById(id: string): DiscordQuizItem | null {
  return allDiscordQuizzes.find((q) => q.id === id) ?? null
}
