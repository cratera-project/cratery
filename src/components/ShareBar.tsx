import { useEffect, useRef, useState } from 'react'
import { PixelButton } from './ui/PixelButton'
import {
  canNativeShare,
  copyText,
  linkedInShareUrl,
  xIntentUrl,
} from '../lib/share'

type Props = {
  url: string
  text: string
  
  size?: 'sm' | 'md'
  className?: string
}


export function ShareBar({ url, text, size = 'sm', className }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [native, setNative] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNative(canNativeShare({ url, title: text, text }))
  }, [url, text])

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onCopy = async () => {
    const ok = await copyText(url)
    setCopied(ok)
    if (ok) window.setTimeout(() => setOpen(false), 900)
  }

  const onNative = async () => {
    setOpen(false)
    try {
      await navigator.share({ url, title: text, text })
    } catch {
      /* cancelled */
    }
  }

  const itemClass =
    'block w-full px-3 py-2 text-left font-pixel text-[9px] uppercase text-ink hover:bg-night-edge hover:text-rust-orange'

  return (
    <div ref={rootRef} className={`relative inline-block ${className ?? ''}`}>
      <PixelButton size={size} variant="secondary" onClick={() => setOpen((v) => !v)}>
        {copied ? 'Copied!' : 'Share'}
      </PixelButton>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[11rem] max-w-[calc(100vw-2rem)] border-4 border-black/60 bg-night-panel shadow-pixel-lg"
        >
          <button type="button" role="menuitem" className={itemClass} onClick={() => void onCopy()}>
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <a
            role="menuitem"
            href={xIntentUrl(url, text)}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            Share on X
          </a>
          <a
            role="menuitem"
            href={linkedInShareUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            LinkedIn
          </a>
          {native ? (
            <button type="button" role="menuitem" className={itemClass} onClick={() => void onNative()}>
              More…
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
