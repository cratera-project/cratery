import type { TutorialChapter, TutorialLesson } from './types'
import { compiledTutorialChapters } from '../generated/tutorials'

export const tutorialChapters: TutorialChapter[] = compiledTutorialChapters

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
