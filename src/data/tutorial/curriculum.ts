import type { TutorialChapter, TutorialLesson } from './types'
import { chapter1Basics } from './chapters/chapter1Basics'
import { chapter2ControlFlow } from './chapters/chapter2ControlFlow'
import { chapter3Ownership } from './chapters/chapter3Ownership'
import { chapter4StructsEnums } from './chapters/chapter4StructsEnums'
import { chapter5Collections } from './chapters/chapter5Collections'
import { chapter6ErrorHandling } from './chapters/chapter6ErrorHandling'
import { chapter7GenericsTraits } from './chapters/chapter7GenericsTraits'
import { chapter8Lifetimes } from './chapters/chapter8Lifetimes'
import { chapter9IteratorsClosures } from './chapters/chapter9IteratorsClosures'
import { chapter10SmartPointers } from './chapters/chapter10SmartPointers'
import { chapter11Concurrency } from './chapters/chapter11Concurrency'
import { chapter12Macros } from './chapters/chapter12Macros'
import { chapter13Unsafe } from './chapters/chapter13Unsafe'

export const tutorialChapters: TutorialChapter[] = [
  chapter1Basics,
  chapter2ControlFlow,
  chapter3Ownership,
  chapter4StructsEnums,
  chapter5Collections,
  chapter6ErrorHandling,
  chapter7GenericsTraits,
  chapter8Lifetimes,
  chapter9IteratorsClosures,
  chapter10SmartPointers,
  chapter11Concurrency,
  chapter12Macros,
  chapter13Unsafe,
]

export function getAllLessons(): TutorialLesson[] {
  return tutorialChapters.flatMap((c) => c.lessons)
}

export function getLessonById(id: string): TutorialLesson | undefined {
  return getAllLessons().find((l) => l.id === id)
}

export function getChapterByLessonId(lessonId: string): TutorialChapter | undefined {
  return tutorialChapters.find((c) => c.lessons.some((l) => l.id === lessonId))
}

export function getNextLesson(currentId: string): TutorialLesson | undefined {
  const all = getAllLessons()
  const idx = all.findIndex((l) => l.id === currentId)
  if (idx >= 0 && idx + 1 < all.length) {
    return all[idx + 1]
  }
  return undefined
}

export function getPrevLesson(currentId: string): TutorialLesson | undefined {
  const all = getAllLessons()
  const idx = all.findIndex((l) => l.id === currentId)
  if (idx > 0) {
    return all[idx - 1]
  }
  return undefined
}

export function searchTutorialLessons(query: string): TutorialLesson[] {
  const q = query.trim().toLowerCase()
  if (!q) return getAllLessons()
  return getAllLessons().filter((l) => {
    return (
      l.title.toLowerCase().includes(q) ||
      l.tagline.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q)) ||
      l.overview.toLowerCase().includes(q)
    )
  })
}
