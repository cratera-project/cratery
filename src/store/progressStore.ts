import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { customAuth } from '../lib/customAuth'
import { rankForXp } from '../lib/ranks'
import { questions } from '../data/questions'

export type AnswerRecord = {
  selectedIndex: number
  isCorrect: boolean
  answeredAt: number
  correctIndex?: number
  explanation?: string
}

type AnswerResult = {
  status: string
  alreadyAnswered?: boolean
  isCorrect?: boolean
  correctIndex?: number
  explanation?: string | null
  error?: string
  needsTurnstile?: boolean
  xpEarned?: number
  totalXp?: number
  rank?: string
}

type ProgressState = {
  answersByQuestionId: Record<string, AnswerRecord>
  ratingsByQuestionId: Record<string, number>
  streak: number
  rankUp: string | null
  clearRankUp: () => void
  answerQuestion: (args: {
    questionId: string
    selectedIndex: number
    turnstileToken?: string
  }) => Promise<AnswerResult>
  rateQuest: (args: { questionId: string; rating: number }) => Promise<{ status: string }>
  recordCodingSuccess: (questionId: string, result?: { xpEarned?: number; totalXp?: number }) => void
  loadUserProgress: () => Promise<void>
  clearProgress: () => void
}

function calcStreak(answersByQuestionId: Record<string, AnswerRecord>): number {
  const activityDates = new Set<number>()
  for (const answer of Object.values(answersByQuestionId)) {
    activityDates.add(new Date(answer.answeredAt).setHours(0, 0, 0, 0))
  }
  if (activityDates.size === 0) return 0

  const today = new Date().setHours(0, 0, 0, 0)
  const yesterday = today - 86400000
  let currentCheck = activityDates.has(today)
    ? today
    : activityDates.has(yesterday)
      ? yesterday
      : null

  let streak = 0
  if (currentCheck !== null) {
    while (activityDates.has(currentCheck)) {
      streak++
      currentCheck -= 86400000
    }
  }
  return streak
}

type ServerAnswer = {
  status: string
  answer?: {
    is_correct?: boolean
    correct_index?: number
    explanation?: string | null
    xp_earned?: number
    total_xp?: number
    rank?: string
  }
  error?: string
}

function storeLocalAnswer(
  set: (partial: Partial<ProgressState>) => void,
  get: () => ProgressState,
  questionId: string,
  selectedIndex: number,
  extra?: Partial<AnswerRecord>
) {
  const prev = get().answersByQuestionId[questionId]
  const answersByQuestionId = {
    ...get().answersByQuestionId,
    [questionId]: {
      selectedIndex,
      isCorrect: extra?.isCorrect ?? prev?.isCorrect ?? false,
      answeredAt: prev?.answeredAt ?? Date.now(),
      correctIndex: extra?.correctIndex ?? prev?.correctIndex,
      explanation: extra?.explanation ?? prev?.explanation,
    },
  }
  set({ answersByQuestionId, streak: calcStreak(answersByQuestionId) })
}

export function getLocalPassedContestIds(): Record<string, AnswerRecord> {
  const result: Record<string, AnswerRecord> = {}
  try {
    if (typeof localStorage === 'undefined') return result
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('cratery_contest_runs_')) {
        const contestId = key.slice('cratery_contest_runs_'.length)
        const raw = localStorage.getItem(key)
        if (raw) {
          const runs = JSON.parse(raw)
          if (Array.isArray(runs)) {
            const passedRun = runs.find(
              (r: { passed?: boolean; verdict?: string; status?: string; timestamp?: number }) =>
                r.passed === true || r.verdict === 'AC' || r.status === 'Passed'
            )
            if (passedRun) {
              result[contestId] = {
                selectedIndex: 0,
                isCorrect: true,
                answeredAt: passedRun.timestamp ?? Date.now(),
              }
            }
          }
        }
      }
    }
  } catch {
    /* ignore */
  }
  return result
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      answersByQuestionId: getLocalPassedContestIds(),
      ratingsByQuestionId: {},
      streak: 0,
      rankUp: null,
      clearRankUp: () => set({ rankUp: null }),

      answerQuestion: async ({ questionId, selectedIndex, turnstileToken }) => {
        const local = get().answersByQuestionId[questionId]
        
        
        if (local && local.isCorrect && local.correctIndex !== undefined) {
          return {
            status: 'ok',
            alreadyAnswered: true,
            isCorrect: local.isCorrect,
            correctIndex: local.correctIndex,
            explanation: local.explanation,
          }
        }

        const resolveLocalFallback = (): AnswerResult => {
          const q = questions.find((item) => item.id === questionId)
          if (q && typeof q.correctIndex === 'number') {
            const isCorrect = selectedIndex === q.correctIndex
            const correctIndex = q.correctIndex
            const explanation = q.explanation
            storeLocalAnswer(set, get, questionId, selectedIndex, {
              isCorrect,
              correctIndex,
              explanation,
            })
            return {
              status: 'ok',
              alreadyAnswered: false,
              isCorrect,
              correctIndex,
              explanation,
              xpEarned: isCorrect ? 10 : 0,
            }
          }
          storeLocalAnswer(set, get, questionId, selectedIndex)
          return { status: 'ok' }
        }

        
        
        try {
          const headers: Record<string, string> = { 'Content-Type': 'application/json' }
          const token = customAuth.getToken()
          if (token) headers.Authorization = `Bearer ${token}`

          const body: Record<string, unknown> = {
            question_id: questionId,
            selected_index: selectedIndex,
          }
          if (!token && turnstileToken) {
            body['cf-turnstile-response'] = turnstileToken
          }

          const response = await fetch('/api/quest-answer', {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            credentials: 'same-origin',
          })
          const result = (await response.json().catch(() => ({}))) as ServerAnswer

          if (response.status === 403) {
            return {
              status: 'error',
              needsTurnstile: true,
              error: result.error || 'forbidden',
            }
          }
          if (!response.ok) {
            return {
              status: 'error',
              error: result.error || `Request failed (${response.status})`,
            }
          }

          const correctIndex = result.answer?.correct_index
          if (typeof correctIndex !== 'number' || !Number.isInteger(correctIndex)) {
            return resolveLocalFallback()
          }
          const isCorrect = Boolean(result.answer?.is_correct)
          const explanation = result.answer?.explanation ?? undefined

          storeLocalAnswer(set, get, questionId, selectedIndex, {
            isCorrect,
            correctIndex,
            explanation,
          })

          const xpEarned = Number(result.answer?.xp_earned) || 0
          const totalXp = Number(result.answer?.total_xp)
          const already = result.status === 'already_answered' || Boolean(local)
          if (!already && xpEarned > 0 && Number.isFinite(totalXp) && totalXp >= xpEarned) {
            const prevName = rankForXp(totalXp - xpEarned).name
            const nextName = rankForXp(totalXp).name
            if (prevName !== nextName) set({ rankUp: nextName })
          }

          return {
            status: 'ok',
            alreadyAnswered: already,
            isCorrect,
            correctIndex,
            explanation,
            xpEarned: already ? 0 : xpEarned,
            totalXp: Number.isFinite(totalXp) ? totalXp : undefined,
            rank: result.answer?.rank,
          }
        } catch (err) {
          console.error('Sync error:', err)
          return resolveLocalFallback()
        }
      },

      rateQuest: async ({ questionId, rating }) => {
        set((state) => ({
          ratingsByQuestionId: {
            ...state.ratingsByQuestionId,
            [questionId]: rating,
          },
        }))

        const token = customAuth.getToken()
        if (!token) return { status: 'ok' }

        try {
          const response = await fetch('/api/quest-rating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ question_id: questionId, rating }),
          })
          if (!response.ok && response.status !== 503) return { status: 'error' }
          return { status: 'ok' }
        } catch (err) {
          console.error('Rating sync error:', err)
          return { status: 'error' }
        }
      },

      recordCodingSuccess: (questionId: string, result?: { xpEarned?: number; totalXp?: number }) => {
        const prev = get().answersByQuestionId[questionId]
        const answersByQuestionId = {
          ...get().answersByQuestionId,
          [questionId]: {
            selectedIndex: 0,
            isCorrect: true,
            answeredAt: prev?.answeredAt ?? Date.now(),
          },
        }
        const xpEarned = Number(result?.xpEarned) || 0
        const totalXp = Number(result?.totalXp)
        let rankUp = get().rankUp
        if (xpEarned > 0 && Number.isFinite(totalXp) && totalXp >= xpEarned) {
          const prevName = rankForXp(totalXp - xpEarned).name
          const nextName = rankForXp(totalXp).name
          if (prevName !== nextName) rankUp = nextName
        }
        set({
          answersByQuestionId,
          streak: calcStreak(answersByQuestionId),
          rankUp,
        })
      },

      loadUserProgress: async () => {
        const token = customAuth.getToken()
        if (!token) return

        try {
          
          const prev = get().answersByQuestionId
          const localToSync: Array<{
            question_id: string
            selected_index: number
            answered_at: number
          }> = []

          for (const [qid, rec] of Object.entries(prev)) {
            if (rec && rec.isCorrect && typeof rec.selectedIndex === 'number') {
              localToSync.push({
                question_id: qid,
                selected_index: rec.selectedIndex,
                answered_at: rec.answeredAt,
              })
            }
          }

          
          if (localToSync.length > 0) {
            try {
              await fetch('/api/sync-progress', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ answers: localToSync.slice(0, 250) }),
              })
            } catch (syncErr) {
              console.warn('Non-fatal local progress sync error:', syncErr)
            }
          }

          
          const response = await fetch('/api/my-progress', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!response.ok) return
          const body = (await response.json()) as {
            answers?: Array<{
              question_id: string
              selected_index: number
              is_correct: boolean
              answered_at: string
            }>
            ratings?: Array<{ question_id: string; rating: number }>
          }

          const answersByQuestionId: Record<string, AnswerRecord> = {}
          for (const answer of body.answers || []) {
            const prior = prev[answer.question_id]
            answersByQuestionId[answer.question_id] = {
              selectedIndex: answer.selected_index,
              isCorrect: answer.is_correct,
              answeredAt: new Date(answer.answered_at).getTime(),
              correctIndex: prior?.correctIndex,
              explanation: prior?.explanation,
            }
          }

          const ratingsByQuestionId: Record<string, number> = {}
          for (const r of body.ratings || []) {
            ratingsByQuestionId[r.question_id] = r.rating
          }

          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i)
              if (key && key.startsWith('cratery_contest_runs_')) {
                const contestId = key.slice('cratery_contest_runs_'.length)
                const raw = localStorage.getItem(key)
                if (raw) {
                  const runs = JSON.parse(raw)
                  if (Array.isArray(runs) && runs.some((r: { passed?: boolean; verdict?: string }) => r.passed === true || r.verdict === 'AC')) {
                    if (!answersByQuestionId[contestId]) {
                      const passedRun = runs.find((r: { passed?: boolean; verdict?: string; timestamp?: number }) => r.passed === true || r.verdict === 'AC')
                      answersByQuestionId[contestId] = {
                        selectedIndex: 0,
                        isCorrect: true,
                        answeredAt: passedRun?.timestamp ?? Date.now(),
                      }
                    }
                  }
                }
              }
            }
          } catch {
            /* ignore */
          }

          set({
            answersByQuestionId,
            ratingsByQuestionId,
            streak: calcStreak(answersByQuestionId),
          })
        } catch (err) {
          console.error('Error loading user progress:', err)
        }
      },

      clearProgress: () => {
        set({
          answersByQuestionId: {},
          ratingsByQuestionId: {},
          streak: 0,
          rankUp: null,
        })
      },
    }),
    {
      name: 'cratery-progress',
      partialize: (state) => ({
        answersByQuestionId: state.answersByQuestionId,
        ratingsByQuestionId: state.ratingsByQuestionId,
        streak: state.streak,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const localContests = getLocalPassedContestIds()
          const answersByQuestionId = { ...localContests, ...state.answersByQuestionId }
          state.answersByQuestionId = answersByQuestionId
          state.streak = calcStreak(answersByQuestionId)
        }
      },
    }
  )
)
