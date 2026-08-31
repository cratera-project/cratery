import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { isLocalDev, loadTurnstile, TURNSTILE_ACTION, TURNSTILE_SITE_KEY } from '../lib/turnstile'

export type TurnstileHandle = {
  reset: () => void
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void
  
  onError?: () => void
  className?: string
}

export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ onToken, onError, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const onTokenRef = useRef(onToken)
    const onErrorRef = useRef(onError)
    onTokenRef.current = onToken
    onErrorRef.current = onError

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (isLocalDev) {
          onTokenRef.current('local-dev-turnstile-token')
          return
        }
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
        onTokenRef.current('')
      },
    }))

    useEffect(() => {
      if (isLocalDev) {
        onTokenRef.current('local-dev-turnstile-token')
        return
      }

      let cancelled = false

      const fail = () => {
        onTokenRef.current('')
        onErrorRef.current?.()
      }

      const mount = async () => {
        try {
          await loadTurnstile()
        } catch (err) {
          console.error(err)
          if (!cancelled) fail()
          return
        }
        if (cancelled || !containerRef.current || !window.turnstile) return

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: TURNSTILE_ACTION,
          theme: 'auto',
          retry: 'auto',
          'retry-interval': 1500,
          'refresh-expired': 'auto',
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': (error) => {
            console.warn('Turnstile challenge error:', error)
            fail()
          },
        })
      }

      void mount()

      return () => {
        cancelled = true
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }
      }
    }, [])

    return (
      <div
        ref={containerRef}
        className={`cf-turnstile ${className ?? ''}`}
        data-sitekey={TURNSTILE_SITE_KEY}
        data-action={TURNSTILE_ACTION}
      />
    )
  }
)
