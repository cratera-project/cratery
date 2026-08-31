import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { customAuth } from '../lib/customAuth'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [token] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('token')?.trim() || null
  })
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', '/reset-password')
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!token) {
      setError('Missing or invalid reset link. Request a new one.')
      return
    }
    if (password.length < 8 || password.length > 128) {
      setError('Password must be 8-128 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const result = await customAuth.resetPassword({ token, password })
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/', { replace: true }), 2000)
  }

  return (
    <PixelPanel title="Reset password">
      <SEO title="Reset Password" noIndex />
      {!token && !done ? (
        <div className="space-y-4">
          <p className="font-code text-lg text-redstone">
            This reset link is missing or invalid. Request a new one from the login form.
          </p>
          <Link to="/">
            <PixelButton>Home</PixelButton>
          </Link>
        </div>
      ) : done ? (
        <p className="font-code text-lg text-emerald">
          Password updated. You can log in with your new password.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block font-pixel text-[10px] uppercase mb-2">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border-3 border-night-edge bg-night font-code text-lg focus:outline-none focus:ring-2 focus:ring-diamond"
              minLength={8}
              maxLength={128}
              required
            />
          </div>
          <div>
            <label className="block font-pixel text-[10px] uppercase mb-2">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 border-3 border-night-edge bg-night font-code text-lg focus:outline-none focus:ring-2 focus:ring-diamond"
              minLength={8}
              maxLength={128}
              required
            />
          </div>
          {error && (
            <div className="p-2 border-2 border-redstone bg-redstone/20 font-code text-sm text-redstone">
              {error}
            </div>
          )}
          <PixelButton type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Update password'}
          </PixelButton>
        </form>
      )}
    </PixelPanel>
  )
}
