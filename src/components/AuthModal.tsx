import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { PixelButton } from './ui/PixelButton'
import { PixelPanel } from './ui/PixelPanel'
import { TurnstileWidget, type TurnstileHandle } from './TurnstileWidget'

type AuthModalProps = {
    isOpen: boolean
    onClose: () => void
    initialTab?: Tab
}

type Tab = 'login' | 'signup' | 'reset' | 'verify'

export function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
    const {
        signIn,
        signUp,
        resetPassword,
        resendVerification,
        error,
        clearError,
        checkUsernameAvailable,
        requiresVerification,
        pendingEmail,
        clearVerificationState,
    } = useAuth()
    const [tab, setTab] = useState<Tab>(initialTab)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [newsletterOptIn, setNewsletterOptIn] = useState(true)
    const [turnstileToken, setTurnstileToken] = useState('')
    const turnstileRef = useRef<TurnstileHandle>(null)

    const resetForm = () => {
        setEmail('')
        setPassword('')
        setUsername('')
        setUsernameError(null)
        setNewsletterOptIn(true)
        setSuccessMessage(null)
        setTurnstileToken('')
        clearError()
        turnstileRef.current?.reset()
    }

    useEffect(() => {
        if (requiresVerification && pendingEmail) {
            queueMicrotask(() => setTab('verify'))
        }
    }, [requiresVerification, pendingEmail])

    useEffect(() => {
        if (isOpen) {
            queueMicrotask(() => {
                setTab(requiresVerification ? 'verify' : initialTab)
                
                if (!requiresVerification) resetForm()
                else {
                    setTurnstileToken('')
                    clearError()
                    turnstileRef.current?.reset()
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialTab, requiresVerification])

    if (!isOpen) return null

    const switchTab = (newTab: Tab) => {
        if (newTab !== 'verify') {
            clearVerificationState()
        }
        resetForm()
        setTab(newTab)
    }

    const validateUsername = (value: string) => {
        if (value.length < 3) return 'Username must be at least 3 characters'
        if (value.length > 20) return 'Username must be at most 20 characters'
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed'
        return null
    }

    const handleUsernameChange = async (value: string) => {
        setUsername(value)
        const validationError = validateUsername(value)

        if (validationError) {
            setUsernameError(validationError)
            return
        }

        const available = await checkUsernameAvailable(value)
        setUsernameError(available ? null : 'Username is taken')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccessMessage(null)
        clearError()

        try {
            if (tab === 'login') {
                const result = await signIn(email, password)
                if (result.requiresVerification) {
                    setSuccessMessage('Verify your email to finish signing in. You can resend the link below.')
                    return
                }
                if (!result.error) {
                    onClose()
                    resetForm()
                }
            } else if (tab === 'signup') {
                if (usernameError || !turnstileToken) {
                    setLoading(false)
                    return
                }
                const result = await signUp(email, password, username, turnstileToken, newsletterOptIn)
                if (result.error) {
                    turnstileRef.current?.reset()
                } else {
                    setSuccessMessage('Check your email for a verification link!')
                    turnstileRef.current?.reset()
                }
            } else if (tab === 'reset') {
                if (!turnstileToken) {
                    setLoading(false)
                    return
                }
                const result = await resetPassword(email, turnstileToken)
                if (result.error) {
                    turnstileRef.current?.reset()
                } else {
                    setSuccessMessage('Password reset email sent (if the account exists).')
                    turnstileRef.current?.reset()
                }
            }
        } catch (err) {
            console.error('Auth submit error:', err)
            turnstileRef.current?.reset()
        } finally {
            setLoading(false)
        }
    }

    const handleResendLink = async () => {
        if (!turnstileToken) return
        setLoading(true)
        const result = await resendVerification(turnstileToken)
        if (result.error) {
            turnstileRef.current?.reset()
        } else {
            setSuccessMessage('New verification link sent (if needed).')
            turnstileRef.current?.reset()
        }
        setLoading(false)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <PixelPanel>
                    <div className="flex gap-2 mb-4 border-b-2 border-night-edge pb-3">
                        {tab === 'verify' ? (
                            <span className="font-pixel text-[10px] uppercase px-3 py-2 bg-emerald text-white border-2 border-night-edge">
                                Verify Email
                            </span>
                        ) : (
                            <>
                                <button
                                    className={`font-pixel text-[10px] uppercase px-3 py-2 border-2 border-night-edge transition-colors ${
                                        tab === 'login'
                                            ? 'bg-rust-orange text-white'
                                            : 'bg-night-raised text-ink hover:bg-night-edge'
                                    }`}
                                    onClick={() => switchTab('login')}
                                >
                                    Login
                                </button>
                                <button
                                    className={`font-pixel text-[10px] uppercase px-3 py-2 border-2 border-night-edge transition-colors ${
                                        tab === 'signup'
                                            ? 'bg-rust-orange text-white'
                                            : 'bg-night-raised text-ink hover:bg-night-edge'
                                    }`}
                                    onClick={() => switchTab('signup')}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                        <div className="flex-1" />
                        <button
                            className="font-pixel text-[10px] text-ink-dim hover:text-ink"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>

                    {tab === 'verify' ? (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="font-code text-lg text-ink-dim mb-2">
                                    We sent a verification link to:
                                </p>
                                <p className="font-code text-lg font-bold text-ink">{pendingEmail}</p>
                                <p className="mt-3 font-code text-base text-ink-faint">
                                    Open the link in your email to finish signing up. It expires in 15
                                    minutes.
                                </p>
                            </div>

                            {error && (
                                <div className="p-2 border-2 border-redstone bg-redstone/20 font-code text-sm text-redstone">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="p-2 border-2 border-emerald bg-emerald/20 font-code text-sm text-ink">
                                    {successMessage}
                                </div>
                            )}

                            <TurnstileWidget
                                key="verify"
                                ref={turnstileRef}
                                onToken={setTurnstileToken}
                            />

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    type="button"
                                    className="font-code text-lg text-diamond hover:underline disabled:opacity-50"
                                    onClick={() => void handleResendLink()}
                                    disabled={loading || !turnstileToken}
                                >
                                    Resend link
                                </button>
                                <button
                                    type="button"
                                    className="font-code text-sm text-ink-dim hover:underline"
                                    onClick={() => switchTab('login')}
                                >
                                    Back to login
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                            {tab === 'signup' && (
                                <div>
                                    <label className="block font-pixel text-[10px] uppercase mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => void handleUsernameChange(e.target.value)}
                                        className="w-full px-3 py-2 border-3 border-night-edge bg-night font-code text-lg focus:outline-none focus:ring-2 focus:ring-diamond"
                                        required
                                    />
                                    {usernameError && (
                                        <p className="mt-1 font-code text-sm text-redstone">
                                            {usernameError}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block font-pixel text-[10px] uppercase mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border-3 border-night-edge bg-night font-code text-lg focus:outline-none focus:ring-2 focus:ring-diamond"
                                    required
                                />
                            </div>

                            {tab !== 'reset' && (
                                <div>
                                    <label className="block font-pixel text-[10px] uppercase mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 border-3 border-night-edge bg-night font-code text-lg focus:outline-none focus:ring-2 focus:ring-diamond"
                                        required
                                        minLength={8}
                                        maxLength={128}
                                    />
                                </div>
                            )}

                            {tab === 'signup' && (
                                <label className="flex items-start gap-3 cursor-pointer select-none py-1">
                                    <input
                                        type="checkbox"
                                        checked={newsletterOptIn}
                                        onChange={(e) => setNewsletterOptIn(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-2 border-night-edge bg-night text-rust-orange focus:ring-diamond accent-[#ff5722]"
                                    />
                                    <span className="font-code text-xs text-ink-dim leading-snug">
                                        Receive email updates on weekly contests, daily streak reminders, and new questions.
                                    </span>
                                </label>
                            )}

                            {tab === 'signup' || tab === 'reset' ? (
                                <TurnstileWidget
                                    key={tab}
                                    ref={turnstileRef}
                                    onToken={setTurnstileToken}
                                />
                            ) : null}

                            {error && (
                                <div className="p-2 border-2 border-redstone bg-redstone/20 font-code text-sm text-redstone">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="p-2 border-2 border-emerald bg-emerald/20 font-code text-sm text-ink">
                                    {successMessage}
                                </div>
                            )}

                            <div className="flex flex-col gap-3 pt-2">
                                <PixelButton
                                    type="submit"
                                    disabled={
                                        loading ||
                                        ((tab === 'signup' || tab === 'reset') && !turnstileToken)
                                    }
                                >
                                    {loading
                                        ? '…'
                                        : tab === 'login'
                                          ? 'Log in'
                                          : tab === 'signup'
                                            ? 'Create account'
                                            : 'Send reset link'}
                                </PixelButton>

                                {tab === 'login' && (
                                    <button
                                        type="button"
                                        className="font-code text-lg text-diamond hover:underline"
                                        onClick={() => switchTab('reset')}
                                    >
                                        Forgot password?
                                    </button>
                                )}
                                {tab === 'reset' && (
                                    <button
                                        type="button"
                                        className="font-code text-sm text-ink-dim hover:underline"
                                        onClick={() => switchTab('login')}
                                    >
                                        Back to login
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </PixelPanel>
            </div>
        </div>
    )
}
