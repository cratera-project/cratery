import type { Question } from '../lib/quiz'

import { ownershipQuestions } from './questions/ownership'
import { lifetimesQuestions } from './questions/lifetimes'
import { traitsQuestions } from './questions/traits'
import { concurrencyQuestions } from './questions/concurrency'
import { pointersQuestions } from './questions/pointers'
import { macrosQuestions } from './questions/macros'
import { errorHandlingQuestions } from './questions/error-handling'
import { iteratorsClosuresQuestions } from './questions/iterators-closures'
import { borrowCheckerQuestions } from './questions/borrow-checker'

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
