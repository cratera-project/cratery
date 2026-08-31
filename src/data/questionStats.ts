import { questions } from './questions'
import { categories } from './categories'

export const TOTAL_BUILTIN_QUESTIONS = questions.length
export const CORE_BUILTIN_QUESTIONS = questions.length

export const TOTAL_CATEGORIES_COUNT = categories.length
export const TOPIC_CATEGORIES_COUNT = categories.filter((c) => !c.isInteractive).length

