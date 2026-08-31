import { supabase, isSupabaseConfigured } from './supabase'
import { customAuth } from './customAuth'

export type TutorialFeedbackVote = 'yes' | 'no'

export type TutorialFeedbackRecord = {
  lessonId: string
  chapterNumber: number
  lessonNumber: number
  isHelpful: boolean
  comment?: string
  vote: TutorialFeedbackVote
  timestamp: number
}

const STORAGE_KEY_PREFIX = 'cratery_tut_feedback_'


export function getLocalTutorialFeedback(lessonId: string): TutorialFeedbackVote | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + lessonId)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { vote: TutorialFeedbackVote }
    return parsed.vote === 'yes' || parsed.vote === 'no' ? parsed.vote : null
  } catch {
    return null
  }
}


export async function submitTutorialFeedback(params: {
  lessonId: string
  chapterNumber: number
  lessonNumber: number
  vote: TutorialFeedbackVote
  comment?: string
}): Promise<{ success: boolean; error?: string }> {
  const { lessonId, chapterNumber, lessonNumber, vote, comment } = params
  const isHelpful = vote === 'yes'
  const currentUser = customAuth.getUser()

  
  try {
    const record: TutorialFeedbackRecord = {
      lessonId,
      chapterNumber,
      lessonNumber,
      isHelpful,
      comment: comment?.trim(),
      vote,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + lessonId, JSON.stringify(record))
  } catch {
    /* ignore storage quota limits */
  }

  
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('tutorial_feedback').insert({
        lesson_id: lessonId,
        chapter_number: chapterNumber,
        lesson_number: lessonNumber,
        is_helpful: isHelpful,
        comment: comment?.trim() || null,
        user_id: currentUser?.id || null,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.warn('Supabase feedback insert warning:', error.message)
        // Even if table does not exist or network fails, local storage succeeded
      }
    } catch (err) {
      console.warn('Failed to send tutorial feedback to Supabase:', err)
    }
  }

  return { success: true }
}
