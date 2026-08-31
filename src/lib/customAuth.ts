import { isLocalDev } from './turnstile'

const AUTH_API_BASE = '/auth'

export const LOCAL_DEV_USER: AuthUser = {
    id: 'local-dev-user-id',
    email: 'local@cratera.org',
    username: 'local_rustacean',
    display_name: 'Local Rustacean',
    newsletter_opt_in: true,
}

export const LOCAL_DEV_TOKEN = 'local-dev-offline-jwt-token'

export interface AuthUser {
    id: string
    email: string
    username: string
    display_name?: string
    newsletter_opt_in?: boolean
}

interface AuthResponse {
    user?: AuthUser
    token?: string
    error?: string
    message?: string
    requiresVerification?: boolean
}

class CustomAuthClient {
    private token: string | null = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
    private user: AuthUser | null = null
    private listeners = new Set<(user: AuthUser | null) => void>()

    constructor() {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('auth_user')
            if (stored) {
                try {
                    this.user = JSON.parse(stored)
                } catch {
                    this.user = null
                }
            } else if (isLocalDev) {
                this.user = LOCAL_DEV_USER
                this.token = LOCAL_DEV_TOKEN
                try {
                    localStorage.setItem('auth_user', JSON.stringify(LOCAL_DEV_USER))
                    localStorage.setItem('auth_token', LOCAL_DEV_TOKEN)
                } catch {
                    /* ignore */
                }
            }
            
            localStorage.removeItem('auth_access_token')
        } else if (isLocalDev) {
            this.user = LOCAL_DEV_USER
            this.token = LOCAL_DEV_TOKEN
        }
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T & { error?: string }> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string> | undefined),
            }
            if (this.token) headers.Authorization = `Bearer ${this.token}`

            const response = await fetch(`${AUTH_API_BASE}${endpoint}`, { ...options, headers })
            const contentType = response.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                return { error: `Server error: ${response.status}` } as T & { error: string }
            }

            const data = await response.json()
            if (!response.ok && !data.error) {
                data.error = `Request failed with status ${response.status}`
            }
            return data
        } catch {
            return { error: 'Network error. Is the auth server running?' } as T & { error: string }
        }
    }

    private setSession(token: string, user: AuthUser): void {
        this.token = token
        this.user = user
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        this.notifyListeners()
    }

    private clearSession(): void {
        if (isLocalDev) {
            this.token = LOCAL_DEV_TOKEN
            this.user = LOCAL_DEV_USER
            localStorage.setItem('auth_token', LOCAL_DEV_TOKEN)
            localStorage.setItem('auth_user', JSON.stringify(LOCAL_DEV_USER))
        } else {
            this.token = null
            this.user = null
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
        this.notifyListeners()
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener(this.user))
    }

    onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
        this.listeners.add(callback)
        callback(this.user)
        return () => {
            this.listeners.delete(callback)
        }
    }

    getUser(): AuthUser | null {
        if (!this.user && isLocalDev) {
            return LOCAL_DEV_USER
        }
        return this.user
    }

    getToken(): string | null {
        if (typeof localStorage === 'undefined') return isLocalDev ? LOCAL_DEV_TOKEN : null
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken !== this.token) this.token = storedToken
        if (!this.token && isLocalDev) {
            return LOCAL_DEV_TOKEN
        }
        return this.token
    }

    async signUp(
        email: string,
        password: string,
        username: string,
        turnstileToken: string,
        newsletterOptIn = true
    ): Promise<AuthResponse> {
        return this.request<AuthResponse>('/signup', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                username,
                newsletter_opt_in: newsletterOptIn,
                'cf-turnstile-response': turnstileToken,
            }),
        })
    }

    async verifyEmail(params: { token: string }): Promise<AuthResponse> {
        const result = await this.request<AuthResponse>('/verify', {
            method: 'POST',
            body: JSON.stringify(params),
        })
        if (result.token && result.user) this.setSession(result.token, result.user)
        return result
    }

    async signIn(email: string, password: string): Promise<AuthResponse> {
        const result = await this.request<AuthResponse>('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
        if (result.token && result.user) this.setSession(result.token, result.user)
        return result
    }

    async signOut(): Promise<void> {
        this.clearSession()
    }

    async forgotPassword(email: string, turnstileToken: string): Promise<AuthResponse> {
        return this.request<AuthResponse>('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email, 'cf-turnstile-response': turnstileToken }),
        })
    }

    async resetPassword(params: { password: string; token: string }): Promise<AuthResponse> {
        return this.request<AuthResponse>('/reset-password', {
            method: 'POST',
            body: JSON.stringify(params),
        })
    }

    async resendVerification(email: string, turnstileToken: string): Promise<AuthResponse> {
        return this.request<AuthResponse>('/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email, 'cf-turnstile-response': turnstileToken }),
        })
    }

    async getPreferences(): Promise<{ newsletter_opt_in?: boolean; error?: string }> {
        const token = this.token
        if (!token) return { error: 'Please sign in first' }
        try {
            const res = await fetch('/api/preferences', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok || data.status !== 'ok') {
                return { error: data.error || 'Failed to fetch preferences' }
            }
            if (this.user && data.preferences) {
                this.user = { ...this.user, newsletter_opt_in: Boolean(data.preferences.newsletter_opt_in) }
                localStorage.setItem('auth_user', JSON.stringify(this.user))
                this.notifyListeners()
            }
            return data.preferences
        } catch {
            return { error: 'Network error fetching preferences' }
        }
    }

    async updatePreferences(preferences: { newsletter_opt_in: boolean }): Promise<{ newsletter_opt_in?: boolean; error?: string }> {
        const token = this.token
        if (!token) return { error: 'Please sign in first' }
        try {
            const res = await fetch('/api/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(preferences),
            })
            const data = await res.json()
            if (!res.ok || data.status !== 'ok') {
                return { error: data.error || 'Failed to update preferences' }
            }
            if (this.user && data.preferences) {
                this.user = { ...this.user, newsletter_opt_in: Boolean(data.preferences.newsletter_opt_in) }
                localStorage.setItem('auth_user', JSON.stringify(this.user))
                this.notifyListeners()
            }
            return data.preferences
        } catch {
            return { error: 'Network error updating preferences' }
        }
    }
}

export const customAuth = new CustomAuthClient()
