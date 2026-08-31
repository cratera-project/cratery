import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PixelButton } from './ui/PixelButton'
import { AuthModal } from './AuthModal'
import { useAuth } from '../context/AuthContext'
import { copyText } from '../lib/share'
import { createRival, inviteUrl } from '../lib/rivals'

type Props = {
  questionIds?: string[]
  opponentUsername?: string
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

export function ChallengeButton({
  questionIds,
  opponentUsername,
  size = 'sm',
  label = 'Challenge a friend',
  className,
}: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    if (busy) return
    setBusy(true)
    setError(null)
    const res = await createRival({ questionIds, opponentUsername })
    setBusy(false)
    if (res.error || !res.rival) {
      setError(res.error ?? 'Could not create challenge')
      return
    }
    const url = inviteUrl(res.rival.id)
    const ok = await copyText(url)
    setCopied(ok)
    navigate(`/rival/${res.rival.id}`)
  }

  return (
    <>
      <PixelButton size={size} variant="secondary" className={className} onClick={() => void run()}>
        {busy ? 'Creating…' : copied ? 'Invite copied' : label}
      </PixelButton>
      {error ? <p className="mt-1 font-code text-base text-redstone">{error}</p> : null}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialTab="signup" />
    </>
  )
}
