export const TURNSTILE_SITE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TURNSTILE_SITE_KEY) ||
  '0x4AAAAAAEKJyPPGdDIHbIKG'

export const TURNSTILE_ACTION = 'turnstile-spin-v2'

export const isLocalDev =
  import.meta.env.DEV ||
  (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0' ||
      window.location.hostname.endsWith('.localhost')))

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement | string,
        options: {
          sitekey: string
          action?: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: (error?: string | number) => void
          theme?: 'light' | 'dark' | 'auto'
          retry?: 'auto' | 'never'
          'retry-interval'?: number
          'refresh-expired'?: 'auto' | 'manual' | 'never'
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

let scriptPromise: Promise<void> | null = null

export function loadTurnstile(): Promise<void> {
  if (isLocalDev) return Promise.resolve()
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const fail = (err: Error) => {
      scriptPromise = null
      reject(err)
    }

    if (window.turnstile) {
      resolve()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-cf-turnstile]')
    if (existing) {
      if (window.turnstile) {
        resolve()
        return
      }
      let elapsed = 0
      const poll = setInterval(() => {
        elapsed += 50
        if (window.turnstile) {
          clearInterval(poll)
          resolve()
        } else if (elapsed > 4000) {
          clearInterval(poll)
          existing.remove()
          inject()
        }
      }, 50)
      return
    }

    inject()

    function inject() {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.cfTurnstile = '1'
      script.onload = () => {
        let elapsed = 0
        const poll = setInterval(() => {
          elapsed += 50
          if (window.turnstile) {
            clearInterval(poll)
            resolve()
          } else if (elapsed > 3000) {
            clearInterval(poll)
            resolve()
          }
        }, 50)
      }
      script.onerror = () => {
        script.remove()
        fail(new Error('Turnstile failed to load'))
      }
      document.head.appendChild(script)
    }
  })

  return scriptPromise
}
