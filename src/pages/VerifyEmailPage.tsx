import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { customAuth } from '../lib/customAuth'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { TurnstileWidget, type TurnstileHandle } from '../components/TurnstileWidget'
import { SEO } from '../components/SEO'
import {
  emailCooldownMessage,
  getStoredResendCooldown,
  markResendSent,
  RESEND_VERIFICATION_COOLDOWN_MS,
} from '../lib/authEmailCooldown'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token')?.trim())
  const [status, setStatus] = useState<'working' | 'ok' | 'error'>(() =>
    token ? 'working' : 'error'
  )
  const [message, setMessage] = useState(() =>
    token
      ? 'Verifying your email…'
      : 'Missing or expired verification link. Request a new one below.'
  )
  const [email, setEmail] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [cooldownSec, setCooldownSec] = useState(() => getStoredResendCooldown())
  const turnstileRef = useRef<TurnstileHandle>(null)

  useEffect(() => {
    if (cooldownSec <= 0) return
    const id = window.setInterval(() => {
      setCooldownSec(getStoredResendCooldown())
    }, 1000)
    return () => window.clearInterval(id)
  }, [cooldownSec])

  useEffect(() => {
    
    window.history.replaceState({}, '', '/verify')

    if (!token) return

    let cancelled = false
    customAuth
      .verifyEmail({ token })
      .then((result) => {
        if (cancelled) return
        if (result.error) {
          setStatus('error')
          setMessage(`${result.error} You can request a new link below.`)
          return
        }
        setStatus('ok')
        setMessage('Email verified! You are signed in.')
        setTimeout(() => navigate('/', { replace: true }), 1500)
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error')
          setMessage('Verification failed. Request a new link below.')
        }
      })
    return () => {
      cancelled = true
    }
  }, [navigate, token])

  const handleResend = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !turnstileToken || resendLoading || cooldownSec > 0) return
    setResendLoading(true)
    setResendError(null)
    setResendMessage(null)
    const result = await customAuth.resendVerification(email.trim(), turnstileToken)
    if (result.error) {
      setResendError(result.error)
      turnstileRef.current?.reset()
      setTurnstileToken('')
    } else {
      markResendSent()
      setCooldownSec(Math.ceil(RESEND_VERIFICATION_COOLDOWN_MS / 1000))
      setResendMessage(
        result.message ?? 'If that email exists and is unverified, a new link has been sent.'
      )
      turnstileRef.current?.reset()
      setTurnstileToken('')
    }
    setResendLoading(false)
  }

  const showResend = status === 'error'
  const resendBlocked = cooldownSec > 0

  return (
    <PixelPanel title="Verify email">
      <SEO title="Verify Email" noIndex />
      <p
        className={`font-code text-lg ${
          status === 'error' ? 'text-redstone' : status === 'ok' ? 'text-emerald' : 'text-ink-dim'
        }`}
      >
        {message}
      </p>

      {showResend && (
        <form onSubmit={(e) => void handleResend(e)} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block font-pixel text-[10px] uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-3 border-night-edge bg-night px-3 py-2 font-code text-lg focus:outline-none focus:ring-2 focus:ring-diamond"
              required
              autoComplete="email"
            />
          </div>
          <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} />
          {resendError && (
            <div className="border-2 border-redstone bg-redstone/20 p-2 font-code text-sm text-redstone">
              {resendError}
            </div>
          )}
          {resendMessage && (
            <div className="border-2 border-emerald bg-emerald/20 p-2 font-code text-sm text-ink">
              {resendMessage}
            </div>
          )}
          {resendBlocked ? (
            <p className="font-code text-sm text-ink-dim">{emailCooldownMessage(cooldownSec)}</p>
          ) : null}
          <PixelButton
            type="submit"
            disabled={resendLoading || !turnstileToken || resendBlocked}
          >
            {resendLoading ? 'Sending…' : 'Send new verification link'}
          </PixelButton>
        </form>
      )}

      {status === 'error' && (
        <div className="mt-4">
          <Link to="/">
            <PixelButton variant="secondary">Home</PixelButton>
          </Link>
        </div>
      )}
    </PixelPanel>
  )
}
