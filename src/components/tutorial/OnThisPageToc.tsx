import { useState, useEffect } from 'react'
import type { TutorialLesson } from '../../data/tutorial/types'
import { Hash, ArrowUp, ThumbsUp, ThumbsDown, MessageSquare, Check, Send } from 'lucide-react'
import { InlineMarkdown } from '../ui/InlineMarkdown'
import {
  getLocalTutorialFeedback,
  submitTutorialFeedback,
  type TutorialFeedbackVote,
} from '../../lib/tutorialFeedback'

type Props = {
  lesson: TutorialLesson
}

export function OnThisPageToc({ lesson }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const [feedbackVote, setFeedbackVote] = useState<TutorialFeedbackVote | null>(() =>
    getLocalTutorialFeedback(lesson.id)
  )
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentSent, setCommentSent] = useState(false)

  
  useEffect(() => {
    setFeedbackVote(getLocalTutorialFeedback(lesson.id))
    setShowCommentBox(false)
    setCommentText('')
    setCommentSent(false)
  }, [lesson.id])

  
  useEffect(() => {
    const handleScroll = () => {
      const headings = lesson.sections.map((s) => s.id).concat(['mistakes', 'quests'])
      const scrollY = window.scrollY + 120

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i])
        if (el && el.offsetTop <= scrollY) {
          setActiveId(headings[i])
          return
        }
      }
      setActiveId(lesson.sections[0]?.id || '')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lesson])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleVote = async (vote: TutorialFeedbackVote) => {
    setFeedbackVote(vote)
    setShowCommentBox(true)
    await submitTutorialFeedback({
      lessonId: lesson.id,
      chapterNumber: lesson.chapterNumber,
      lessonNumber: lesson.lessonNumber,
      vote,
    })
  }

  const handleSendComment = async () => {
    if (!feedbackVote || !commentText.trim() || submitting) return
    setSubmitting(true)
    await submitTutorialFeedback({
      lessonId: lesson.id,
      chapterNumber: lesson.chapterNumber,
      lessonNumber: lesson.lessonNumber,
      vote: feedbackVote,
      comment: commentText,
    })
    setSubmitting(false)
    setCommentSent(true)
  }

  return (
    <div className="space-y-6 text-sm select-none">
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 font-pixel text-[10px] uppercase text-ink-dim">
          <Hash className="h-3.5 w-3.5 text-rust-orange" />
          <span>On this page</span>
        </div>

        <ul className="space-y-1 text-xs border-l-2 border-night-edge pl-3">
          {lesson.sections.map((sec) => {
            const isActive = activeId === sec.id
            return (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className={`block py-1 transition-colors ${
                    isActive
                      ? '-ml-[14px] border-l-2 border-rust-orange pl-[12px] font-semibold text-rust-orange'
                      : 'text-ink-dim hover:text-ink'
                  }`}
                >
                  <InlineMarkdown text={sec.title} />
                </a>
              </li>
            )
          })}

          {lesson.commonMistakes.length > 0 && (
            <li>
              <a
                href="#mistakes"
                className={`block py-1 transition-colors ${
                  activeId === 'mistakes'
                    ? '-ml-[14px] border-l-2 border-redstone pl-[12px] font-semibold text-redstone'
                    : 'text-ink-dim hover:text-redstone'
                }`}
              >
                Common Gotchas ({lesson.commonMistakes.length})
              </a>
            </li>
          )}

          {lesson.quests.length > 0 && (
            <li>
              <a
                href="#quests"
                className={`block py-1 transition-colors ${
                  activeId === 'quests'
                    ? '-ml-[14px] border-l-2 border-gold pl-[12px] font-semibold text-gold'
                    : 'text-ink-dim hover:text-gold'
                }`}
              >
                Practice Quests ({lesson.quests.length})
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Helpful Feedback Widget with Supabase & Local Persistence */}
      <div className="pixel-ui border-3 border-night-edge bg-night-panel p-3 space-y-2.5 shadow-pixel">
        <div className="font-pixel text-[9px] uppercase text-ink-dim">Was this lesson helpful?</div>

        {feedbackVote ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-emerald">
                <Check className="h-3.5 w-3.5" />
                <span>
                  {feedbackVote === 'yes' ? 'Helpful' : 'Feedback noted'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleVote(feedbackVote === 'yes' ? 'no' : 'yes')}
                className="font-pixel text-[8px] uppercase text-ink-faint hover:text-ink underline cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Optional Improvement Note */}
            {showCommentBox && !commentSent && (
              <div className="space-y-1.5 pt-1 border-t border-night-edge/60 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    feedbackVote === 'yes'
                      ? 'What did you like most? (optional)'
                      : 'How can we improve it? (optional)'
                  }
                  className="w-full border border-night-edge bg-night px-2 py-1 font-sans text-xs text-ink placeholder:text-ink-faint focus:border-rust-orange focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleSendComment()
                  }}
                />
                {commentText.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => void handleSendComment()}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-1 border border-rust-orange/80 bg-rust-orange/20 py-1 font-pixel text-[8px] uppercase text-rust-orange hover:bg-rust-orange hover:text-white transition-colors cursor-pointer"
                  >
                    <Send className="h-2.5 w-2.5" />
                    <span>{submitting ? 'Saving…' : 'Send Note'}</span>
                  </button>
                )}
              </div>
            )}

            {commentSent && (
              <div className="font-pixel text-[8px] uppercase text-ink-faint">
                Thanks for your feedback!
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleVote('yes')}
              className="flex items-center gap-1 border-2 border-night-edge bg-night px-2.5 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:border-emerald-500 hover:text-emerald transition-colors cursor-pointer"
              title="Mark lesson as helpful"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => void handleVote('no')}
              className="flex items-center gap-1 border-2 border-night-edge bg-night px-2.5 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:border-redstone hover:text-redstone transition-colors cursor-pointer"
              title="Mark lesson as needing improvement"
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="pt-2 border-t-2 border-night-edge space-y-2 text-xs text-ink-dim font-pixel text-[9px] uppercase">
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-ink-dim hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          <span>Back to top</span>
        </button>

        <a
          href="https://cratera.zulipchat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-ink-dim hover:text-[#5063f0] transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5 text-[#5063f0]" />
          <span>Zulip Community</span>
        </a>
      </div>
    </div>
  )
}
