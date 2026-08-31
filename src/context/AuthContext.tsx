import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'
import { customAuth, type AuthUser } from '../lib/customAuth'
import { isSupabaseConfigured, supabase, type Profile } from '../lib/supabase'
import { saveAvatar } from '../lib/userQuests'
import type { AvatarConfig } from '../lib/avatar'
import { useProgressStore } from '../store/progressStore'
import { isLocalDev } from '../lib/turnstile'
import {
    emailCooldownMessage,
    emailCooldownRemaining,
    markResendSent,
    PASSWORD_RESET_COOLDOWN_MS,
    RESEND_VERIFICATION_COOLDOWN_MS,
} from '../lib/authEmailCooldown'

const EMAIL_COOLDOWN_MS = PASSWORD_RESET_COOLDOWN_MS

type AuthContextType = {
    user: AuthUser | null
    profile: Profile | null
    loading: boolean
    error: string | null
    requiresVerification: boolean
    pendingEmail: string | null
    signUp: (
        email: string,
        password: string,
        username: string,
        turnstileToken: string,
        newsletterOptIn?: boolean
    ) => Promise<{ error: string | null }>
    signIn: (email: string, password: string) => Promise<{ error: string | null; requiresVerification?: boolean }>
    signOut: () => Promise<void>
    resetPassword: (email: string, turnstileToken: string) => Promise<{ error: string | null }>
    resendVerification: (
        turnstileToken: string,
        email?: string
    ) => Promise<{ error: string | null }>
    checkUsernameAvailable: (username: string) => Promise<boolean>
    updateAvatar: (avatar: AvatarConfig) => Promise<{ error: string | null }>
    updateNewsletterPreference: (optIn: boolean) => Promise<{ error: string | null }>
    clearError: () => void
    clearVerificationState: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

async function fetchProfile(userId: string): Promise<Profile | null> {
    const storedUser = customAuth.getUser()
    if (!storedUser || storedUser.id !== userId) return null

    try {
        const response = await fetch(`/api/public-profile?username=${encodeURIComponent(storedUser.username)}`)
        if (response.ok) {
            const body = (await response.json()) as {
                profile?: Profile
            }
            if (body.profile) return body.profile
        }
    } catch {
        /* ignore */
    }

    if (isLocalDev) {
        let localAvatar: AvatarConfig | null = null
        try {
            const raw = localStorage.getItem('cratery_local_avatar')
            if (raw) localAvatar = JSON.parse(raw)
        } catch {
            /* ignore */
        }
        return {
            id: storedUser.id,
            username: storedUser.username,
            avatar: localAvatar,
            created_at: new Date().toISOString(),
        }
    }

    return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => customAuth.getUser())
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(() => !!customAuth.getUser())
    const [error, setError] = useState<string | null>(null)
    const [requiresVerification, setRequiresVerification] = useState(false)
    const [pendingEmail, setPendingEmail] = useState<string | null>(null)
    const lastEmailSentRef = useRef<number>(0)

    useEffect(() => {
        const currentUser = customAuth.getUser()
        if (currentUser) {
            fetchProfile(currentUser.id)
                .then(setProfile)
                .finally(() => setLoading(false))
        }

        return customAuth.onAuthStateChange((authUser) => {
            setUser(authUser)
            if (authUser) {
                fetchProfile(authUser.id).then(setProfile)
                void useProgressStore.getState().loadUserProgress()
            } else {
                setProfile(null)
                useProgressStore.getState().clearProgress()
            }
        })
    }, [])

    const checkResendCooldown = (): string | null => {
        const elapsed = Date.now() - lastEmailSentRef.current
        if (elapsed < RESEND_VERIFICATION_COOLDOWN_MS) {
            const seconds = emailCooldownRemaining(lastEmailSentRef.current, RESEND_VERIFICATION_COOLDOWN_MS)
            return emailCooldownMessage(seconds)
        }
        return null
    }

    const checkCooldown = (): string | null => {
        const elapsed = Date.now() - lastEmailSentRef.current
        if (elapsed < EMAIL_COOLDOWN_MS) {
            const seconds = emailCooldownRemaining(lastEmailSentRef.current, EMAIL_COOLDOWN_MS)
            return emailCooldownMessage(seconds)
        }
        return null
    }

    const checkUsernameAvailable = async (username: string): Promise<boolean> => {
        if (!isSupabaseConfigured) return true
        const { data, error } = await supabase.rpc('check_custom_username_available', {
            p_username: username,
        })
        if (error) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username.toLowerCase())
                .single()
            return !profileData
        }
        return data as boolean
    }

    const signUp = async (
        email: string,
        password: string,
        username: string,
        turnstileToken: string,
        newsletterOptIn = true
    ) => {
        setError(null)
        const cooldown = checkCooldown()
        if (cooldown) {
            setError(cooldown)
            return { error: cooldown }
        }

        const available = await checkUsernameAvailable(username)
        if (!available) {
            const msg = 'Username is already taken'
            setError(msg)
            return { error: msg }
        }

        const result = await customAuth.signUp(email, password, username, turnstileToken, newsletterOptIn)
        if (result.error) {
            setError(result.error)
            return { error: result.error }
        }

        lastEmailSentRef.current = Date.now()
        if (result.requiresVerification) {
            setRequiresVerification(true)
            setPendingEmail(email)
        }
        return { error: null }
    }

    const resendVerification = async (turnstileToken: string, email?: string) => {
        setError(null)
        const targetEmail = (email ?? pendingEmail)?.trim().toLowerCase()
        if (!targetEmail) {
            const msg = 'Enter your email above to resend verification.'
            setError(msg)
            return { error: msg }
        }

        const cooldown = checkResendCooldown()
        if (cooldown) {
            setError(cooldown)
            return { error: cooldown }
        }

        const result = await customAuth.resendVerification(targetEmail, turnstileToken)
        if (result.error) {
            setError(result.error)
            return { error: result.error }
        }

        lastEmailSentRef.current = Date.now()
        markResendSent()
        return { error: null }
    }

    const signIn = async (email: string, password: string) => {
        setError(null)
        const result = await customAuth.signIn(email, password)
        if (result.error) {
            if (result.requiresVerification) {
                setRequiresVerification(true)
                setPendingEmail(email)
            }
            setError(result.error)
            return { error: result.error, requiresVerification: result.requiresVerification }
        }
        return { error: null }
    }

    const signOut = async () => {
        await customAuth.signOut()
        if (isLocalDev) {
            const devUser = customAuth.getUser()
            setUser(devUser)
            if (devUser) {
                fetchProfile(devUser.id).then(setProfile)
            }
        } else {
            setProfile(null)
        }
        setRequiresVerification(false)
        setPendingEmail(null)
    }

    const updateAvatar = async (avatar: AvatarConfig) => {
        if (isLocalDev) {
            try {
                localStorage.setItem('cratery_local_avatar', JSON.stringify(avatar))
            } catch {
                /* ignore */
            }
            setProfile((prev) => (prev ? { ...prev, avatar } : {
                id: 'local-dev-user-id',
                username: 'local_rustacean',
                avatar,
                created_at: new Date().toISOString(),
            }))
            return { error: null }
        }
        const res = await saveAvatar(avatar)
        if (res.error) return { error: res.error }
        setProfile((prev) => (prev ? { ...prev, avatar: res.avatar ?? avatar } : prev))
        return { error: null }
    }

    const updateNewsletterPreference = async (optIn: boolean) => {
        if (isLocalDev) {
            if (user) {
                user.newsletter_opt_in = optIn
            }
            return { error: null }
        }
        const res = await customAuth.updatePreferences({ newsletter_opt_in: optIn })
        if (res.error) return { error: res.error }
        return { error: null }
    }

    const resetPassword = async (email: string, turnstileToken: string) => {
        setError(null)
        const cooldown = checkCooldown()
        if (cooldown) {
            setError(cooldown)
            return { error: cooldown }
        }

        const result = await customAuth.forgotPassword(email, turnstileToken)
        if (result.error) {
            setError(result.error)
            return { error: result.error }
        }

        lastEmailSentRef.current = Date.now()
        return { error: null }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                error,
                requiresVerification,
                pendingEmail,
                signUp,
                signIn,
                signOut,
                resetPassword,
                resendVerification,
                checkUsernameAvailable,
                updateAvatar,
                updateNewsletterPreference,
                clearError: () => setError(null),
                clearVerificationState: () => {
                    setRequiresVerification(false)
                    setPendingEmail(null)
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
