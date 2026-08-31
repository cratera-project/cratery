import { useEffect, useState } from 'react'
import { PixelButton } from './ui/PixelButton'
import { copyText, githubReadmeHtml, githubReadmeMarkdown, profileBadgeSvgUrl } from '../lib/share'

type Props = {
  isOpen: boolean
  username: string
  onClose: () => void
}

export function GitHubBadgeModal({ isOpen, username, onClose }: Props) {
  const [copiedFormat, setCopiedFormat] = useState<'md' | 'html' | 'url' | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!copiedFormat) return
    const id = window.setTimeout(() => setCopiedFormat(null), 2000)
    return () => window.clearTimeout(id)
  }, [copiedFormat])

  if (!isOpen) return null

  const svgUrl = profileBadgeSvgUrl(username)
  const mdSnippet = githubReadmeMarkdown(username)
  const htmlSnippet = githubReadmeHtml(username)

  const handleCopy = async (format: 'md' | 'html' | 'url') => {
    const text = format === 'md' ? mdSnippet : format === 'html' ? htmlSnippet : svgUrl
    const ok = await copyText(text)
    if (ok) setCopiedFormat(format)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden border-4 border-black/60 bg-night-panel shadow-pixel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b-4 border-black/60 bg-night-raised px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🦀</span>
            <span className="font-pixel text-xs uppercase text-ink">GitHub Profile Badge</span>
          </div>
          <PixelButton size="sm" variant="secondary" onClick={onClose}>
            Close
          </PixelButton>
        </div>

        <div className="space-y-4 overflow-y-auto p-4 sm:p-5">
          <p className="read-body text-base text-ink-dim">
            Showcase your Cratery rank, XP, and streak on your GitHub profile README or personal portfolio. Live stats update automatically.
          </p>

          {/* Live Preview */}
          <div>
            <div className="mb-1.5 font-pixel text-[9px] uppercase text-ink-dim">Live SVG Preview</div>
            <div className="flex items-center justify-center overflow-hidden border-2 border-black/60 bg-night p-3">
              <img
                src={svgUrl}
                alt={`${username}'s Cratery Badge`}
                className="max-w-full h-auto drop-shadow-md"
                loading="eager"
              />
            </div>
          </div>

          {/* Markdown Snippet */}
          <div>
            <div className="mb-1.5 flex items-center justify-between font-pixel text-[9px] uppercase text-ink-dim">
              <span>Markdown (GitHub README)</span>
              <button
                type="button"
                onClick={() => void handleCopy('md')}
                className="text-rust-orange hover:underline font-pixel text-[9px] uppercase"
              >
                {copiedFormat === 'md' ? '✓ Copied' : 'Copy Markdown'}
              </button>
            </div>
            <pre className="overflow-x-auto border-2 border-black/60 bg-night p-2.5 font-code text-xs text-emerald-300">
              {mdSnippet}
            </pre>
          </div>

          {/* HTML Snippet */}
          <div>
            <div className="mb-1.5 flex items-center justify-between font-pixel text-[9px] uppercase text-ink-dim">
              <span>HTML Embed</span>
              <button
                type="button"
                onClick={() => void handleCopy('html')}
                className="text-rust-orange hover:underline font-pixel text-[9px] uppercase"
              >
                {copiedFormat === 'html' ? '✓ Copied' : 'Copy HTML'}
              </button>
            </div>
            <pre className="overflow-x-auto border-2 border-black/60 bg-night p-2.5 font-code text-xs text-ink-dim">
              {htmlSnippet}
            </pre>
          </div>

          {/* Direct Image URL */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <PixelButton
              className="w-full sm:w-auto"
              variant={copiedFormat === 'md' ? 'success' : 'primary'}
              onClick={() => void handleCopy('md')}
            >
              {copiedFormat === 'md' ? '✓ Markdown Copied!' : 'Copy GitHub Markdown'}
            </PixelButton>
            <PixelButton
              size="sm"
              variant="secondary"
              onClick={() => void handleCopy('url')}
            >
              {copiedFormat === 'url' ? '✓ URL Copied' : 'Copy SVG URL'}
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  )
}
