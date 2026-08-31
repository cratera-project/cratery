import type { Question } from '../lib/quiz'
import {
  ownershipMarkdownQuestions,
  borrowCheckerMarkdownQuestions,
  lifetimesMarkdownQuestions,
  traitsMarkdownQuestions,
  concurrencyMarkdownQuestions,
  pointersMarkdownQuestions,
  macrosMarkdownQuestions,
  errorHandlingMarkdownQuestions,
  iteratorsClosuresMarkdownQuestions,
} from './generated'

export const ownershipQuestions = ownershipMarkdownQuestions
export const borrowCheckerQuestions = borrowCheckerMarkdownQuestions
export const lifetimesQuestions = lifetimesMarkdownQuestions
export const traitsQuestions = traitsMarkdownQuestions
export const concurrencyQuestions = concurrencyMarkdownQuestions
export const pointersQuestions = pointersMarkdownQuestions
export const macrosQuestions = macrosMarkdownQuestions
export const errorHandlingQuestions = errorHandlingMarkdownQuestions
export const iteratorsClosuresQuestions = iteratorsClosuresMarkdownQuestions

export const questions: Question[] = [
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
