import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PixelPanel } from './ui/PixelPanel'
import { PixelButton } from './ui/PixelButton'
import { AuthModal } from './AuthModal'
import { TurnstileWidget, type TurnstileHandle } from './TurnstileWidget'
import { useAuth } from '../context/AuthContext'
import {
  createQuestComment,
  deleteQuestComment,
  formatCommentTime,
  listQuestComments,
  reportComment,
  updateQuestComment,
  type QuestComment,
} from '../lib/questComments'

type Props = {
  questionId: string
}

export function QuestComments({ questionId }: Props) {
  const { user } = useAuth()
  const [comments, setComments] = useState<QuestComment[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [reportId, setReportId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportToken, setReportToken] = useState('')
  const [reportError, setReportError] = useState<string | null>(null)
  const [reportSending, setReportSending] = useState(false)
  const [reportedIds, setReportedIds] = useState<Set<string>>(() => new Set())
  const reportTurnstileRef = useRef<TurnstileHandle>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setEditingId(null)
    setDeleteId(null)
    setReportId(null)
    listQuestComments(questionId)
      .then((rows) => {
        if (!cancelled) setComments(rows)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load comments')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [questionId])

  const post = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    const text = draft.trim()
    if (!text || posting) return
    setPosting(true)
    setError(null)
    const res = await createQuestComment(questionId, text)
    setPosting(false)
    if (res.error || !res.comment) {
      setError(res.error ?? 'Failed to post')
      return
    }
    setDraft('')
    setComments((prev) => [...prev, res.comment])
  }

  const saveEdit = async (id: string) => {
    const text = editDraft.trim()
    if (!text || busyId) return
    setBusyId(id)
    setError(null)
    const res = await updateQuestComment(id, text)
    setBusyId(null)
    if (res.error || !res.comment) {
      setError(res.error ?? 'Failed to edit')
      return
    }
    setComments((prev) => prev.map((c) => (c.id === id ? res.comment : c)))
    setEditingId(null)
  }

  const remove = async (id: string) => {
    if (busyId || deleteId !== id) return
    setBusyId(id)
    setError(null)
    const res = await deleteQuestComment(id)
    setBusyId(null)
    if (res.error) {
      setError(res.error)
      setDeleteId(null)
      return
    }
    setComments((prev) => prev.filter((c) => c.id !== id))
    setDeleteId(null)
    if (editingId === id) setEditingId(null)
  }

  const sendReport = async (commentId: string) => {
    if (reportSending || reportedIds.has(commentId)) return
    const text = reportReason.trim()
    if (text.length < 3) {
      setReportError('Say a bit more (at least 3 characters)')
      return
    }
    if (!reportToken) {
      setReportError('Complete the verification challenge first')
      return
    }
    setReportSending(true)
    setReportError(null)
    const res = await reportComment(commentId, text, reportToken)
    setReportSending(false)
    if (res.error) {
      setReportError(res.error)
      reportTurnstileRef.current?.reset()
      return
    }
    setReportedIds((prev) => new Set(prev).add(commentId))
    setReportId(null)
    setReportReason('')
    setReportToken('')
  }

  return (
    <PixelPanel title={`Comments · ${comments.length}`}>
      <div className="space-y-4">
        {loading ? (
          <p className="font-code text-lg text-ink-dim">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="read-body text-lg text-ink-dim">No comments yet. Be the first.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => {
              const mine = Boolean(user?.id && user.id === c.author_id)
              const reporting = reportId === c.id
              return (
                <li
                  key={c.id}
                  className="border-3 border-night-edge bg-night px-3 py-3 shadow-pixel"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <Link
                        to={`/${c.username}`}
                        className="font-pixel text-[10px] uppercase text-rust-orange hover:underline"
                      >
                        {c.username}
                      </Link>
                      <span className="ml-1 font-code text-sm text-ink-faint">
                        {formatCommentTime(c.created_at)}
                        {c.edited ? (
                          <span title={new Date(c.updated_at).toLocaleString()}>
                            {' '}
                            · edited {formatCommentTime(c.updated_at)}
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mine ? (
                        deleteId === c.id ? (
                          <>
                            <span className="font-pixel text-[9px] uppercase text-ink-dim">
                              Delete?
                            </span>
                            <button
                              type="button"
                              className="font-pixel text-[9px] uppercase text-redstone hover:underline"
                              disabled={busyId === c.id}
                              onClick={() => void remove(c.id)}
                            >
                              {busyId === c.id ? 'Deleting…' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              className="font-pixel text-[9px] uppercase text-ink-dim hover:text-rust-orange hover:underline"
                              disabled={busyId === c.id}
                              onClick={() => setDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="font-pixel text-[9px] uppercase text-ink-dim hover:text-rust-orange hover:underline"
                              onClick={() => {
                                setEditingId(c.id)
                                setEditDraft(c.body)
                                setReportId(null)
                                setDeleteId(null)
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="font-pixel text-[9px] uppercase text-ink-dim hover:text-redstone hover:underline"
                              disabled={busyId === c.id}
                              onClick={() => {
                                setDeleteId(c.id)
                                setEditingId(null)
                                setReportId(null)
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )
                      ) : reportedIds.has(c.id) ? (
                        <span className="font-pixel text-[9px] uppercase text-ink-faint">
                          Reported
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="font-pixel text-[9px] uppercase text-ink-dim hover:text-redstone hover:underline"
                          onClick={() => {
                            setReportId(reporting ? null : c.id)
                            setReportReason('')
                            setReportError(null)
                            setEditingId(null)
                          }}
                        >
                          Report
                        </button>
                      )}
                    </div>
                  </div>

                  {editingId === c.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        maxLength={2000}
                        rows={3}
                        className="w-full border-3 border-night-edge bg-night-panel px-3 py-2 font-code text-lg text-ink focus:border-diamond focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-2">
                        <PixelButton
                          size="sm"
                          onClick={() => void saveEdit(c.id)}
                          disabled={busyId === c.id || !editDraft.trim()}
                        >
                          {busyId === c.id ? 'Saving…' : 'Save'}
                        </PixelButton>
                        <PixelButton
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </PixelButton>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap read-body text-xl leading-relaxed text-ink">
                      {c.body}
                    </p>
                  )}

                  {reporting ? (
                    <div className="mt-3 space-y-2 border-t-2 border-night-edge pt-3">
                      <label className="block">
                        <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
                          Why report this comment?
                        </span>
                        <textarea
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          maxLength={1000}
                          rows={2}
                          className="w-full border-3 border-night-edge bg-night-panel px-3 py-2 font-code text-lg text-ink focus:border-diamond focus:outline-none"
                        />
                      </label>
                      <TurnstileWidget ref={reportTurnstileRef} onToken={setReportToken} />
                      {reportError ? (
                        <p className="font-code text-base text-redstone">{reportError}</p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        <PixelButton
                          size="sm"
                          variant="danger"
                          onClick={() => void sendReport(c.id)}
                          disabled={reportSending || !reportToken}
                        >
                          {reportSending ? 'Sending…' : 'Submit report'}
                        </PixelButton>
                        <PixelButton
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setReportId(null)
                            setReportError(null)
                          }}
                        >
                          Cancel
                        </PixelButton>
                      </div>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}

        <div className="space-y-2 border-t-3 border-night-edge pt-4">
          <label className="block">
            <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
              Add a comment
            </span>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder={user ? 'Share a tip, ask a question…' : 'Sign in to comment'}
              disabled={!user}
              className="w-full border-3 border-night-edge bg-night px-3 py-2 font-code text-lg text-ink placeholder:text-ink-faint focus:border-diamond focus:outline-none disabled:opacity-60"
            />
          </label>
          {error ? <p className="font-code text-base text-redstone">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            {user ? (
              <PixelButton size="sm" onClick={() => void post()} disabled={posting || !draft.trim()}>
                {posting ? 'Posting…' : 'Post comment'}
              </PixelButton>
            ) : (
              <PixelButton size="sm" onClick={() => setShowAuthModal(true)}>
                Sign in to comment
              </PixelButton>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="signup"
      />
    </PixelPanel>
  )
}
