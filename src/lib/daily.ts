import { questions } from '../data/questions'
import type { Question } from './quiz'


export function getDailyQuestion(date: Date = new Date()): Question | null {
  const mcqs = questions.filter((q) => q.kind !== 'coding')
  if (mcqs.length === 0) return null

  const today = date.toISOString().slice(0, 10) 
  let hash = 0
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % mcqs.length
  return mcqs[index] ?? null
}


export function isDailyQuestion(questionId: string, date: Date = new Date()): boolean {
  const daily = getDailyQuestion(date)
  return Boolean(daily && daily.id === questionId)
}


export function getDailyQuestionHref(date: Date = new Date()): string {
  const daily = getDailyQuestion(date)
  if (!daily) return '/quests'
  return `/category/${daily.categorySlug}/question/${daily.id}?daily=true`
}
