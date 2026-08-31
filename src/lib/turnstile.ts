
export const TURNSTILE_SITE_KEY = '0x4AAAAAAEKJyPPGdDIHbIKG'

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
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
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

    const existing = document.querySelector<HTMLScriptElement>('script[data-cf-turnstile]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => fail(new Error('Turnstile failed to load')),
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.cfTurnstile = '1'
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      fail(new Error('Turnstile failed to load'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}
