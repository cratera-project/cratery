import { useEffect, useRef, useState } from 'react'
import { PixelPanel } from './ui/PixelPanel'
import { PixelButton } from './ui/PixelButton'
import { TurnstileWidget, type TurnstileHandle } from './TurnstileWidget'
import { reportQuest } from '../lib/questComments'
import { CONTACT_EMAIL } from '../lib/constants'


export function QuestReportPanel({
  questionId,
  title,
  open,
  onOpenChange,
  onSent,
}: {
  questionId: string
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSent?: () => void
}) {
  const [sent, setSent] = useState(false)
  const [reason, setReason] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileHandle>(null)

  useEffect(() => {
    setSent(false)
    setReason('')
    setError(null)
    setSending(false)
    setTurnstileToken('')
  }, [questionId])

  const send = async () => {
    if (sending || sent) return
    const text = reason.trim()
    if (text.length < 3) {
      setError('Say a bit more (at least 3 characters)')
      return
    }
    if (!turnstileToken) {
      setError('Complete the verification challenge first')
      return
    }
    setSending(true)
    setError(null)
    const res = await reportQuest(questionId, text, turnstileToken)
    setSending(false)
    if (res.error) {
      setError(res.error)
      turnstileRef.current?.reset()
      return
    }
    setReason('')
    onOpenChange(false)
    setSent(true)
    onSent?.()
  }

  if (sent) {
    return (
      <PixelPanel title="Report received">
        <p className="read-body text-lg text-emerald">
          Thanks. Your report was saved and will be reviewed. If it is urgent, email the developer at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline decoration-night-edge underline-offset-2 hover:text-rust-orange"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </PixelPanel>
    )
  }

  if (!open) return null

  return (
    <PixelPanel title="Report this quest">
      <div className="space-y-3">
        <p className="read-body text-lg leading-relaxed text-ink-dim">
          Tell us what is wrong (spam, off-topic, wrong answer, abusive, etc.). Reports go to the site
          review queue. You can also email the developer at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Report quest: ${title}`)}`}
            className="text-ink-dim underline decoration-night-edge underline-offset-2 hover:text-rust-orange"
          >
            {CONTACT_EMAIL}
          </a>{' '}
          if you need a direct reply.
        </p>
        <label className="block">
          <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
            Report message
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="What is wrong with this quest?"
            className="w-full border-3 border-night-edge bg-night px-3 py-2 font-code text-lg text-ink placeholder:text-ink-faint focus:border-diamond focus:outline-none"
          />
        </label>
        <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} />
        {error ? <p className="font-code text-base text-redstone">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <PixelButton
            size="sm"
            onClick={() => void send()}
            disabled={sending || !turnstileToken}
          >
            {sending ? 'Sending…' : 'Submit report'}
          </PixelButton>
          <PixelButton size="sm" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </PixelButton>
        </div>
      </div>
    </PixelPanel>
  )
}
