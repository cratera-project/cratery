import { useState, useEffect } from 'react'
import type { UserNote } from '../../lib/notes'
import { copyText, xIntentUrl, linkedInShareUrl } from '../../lib/share'
import { PixelButton } from '../ui/PixelButton'
import {
  X,
  Copy,
  Check,
  Share2,
  Globe,
  Lock,
  ExternalLink,
} from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  note: UserNote
}

export function ShareNoteModal({ isOpen, onClose, note }: Props) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedMarkdown, setCopiedMarkdown] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/notes/${note.slug || note.id}` : ''
  const shareText = `Check out "${note.title}" on Cratery - Interactive Rust Notebook with runnable code in microVM!`
  const markdownSnippet = `[${note.title}](${shareUrl}) · *Interactive Rust Note on Cratery*`
  const embedSnippet = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" title="${note.title}"></iframe>`

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCopy = async (text: string, setCopied: (v: boolean) => void) => {
    const ok = await copyText(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(
    shareUrl
  )}&title=${encodeURIComponent(note.title + ' [Interactive Rust Note]')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="pixel-ui relative w-full max-w-lg border-4 border-black/80 bg-night-panel p-6 shadow-pixel-lg space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-night-edge pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-rust-orange" />
            <h2 className="font-pixel text-sm uppercase text-ink">
              Share Interactive Note
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-ink-dim hover:text-ink cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Note Status Banner */}
        <div
          className={`flex items-center gap-2 border p-2.5 text-xs ${
            note.is_public
              ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300'
              : 'border-gold/60 bg-gold/15 text-gold'
          }`}
        >
          {note.is_public ? (
            <>
              <Globe className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>
                <strong>Public Note</strong>: Anyone with this link can view and run the interactive code cells without signing in.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 shrink-0 text-gold" />
              <span>
                <strong>Private Note</strong>: Only you can view this note while signed in. Set visibility to Public in edit mode to share.
              </span>
            </>
          )}
        </div>

        {/* Direct Link Share */}
        <div className="space-y-1.5">
          <label className="font-pixel text-[9px] uppercase text-ink-dim">
            Direct Shareable URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-[#14161b] px-3 py-2 font-code text-xs text-ink border border-night-edge focus:outline-none select-all"
            />
            <PixelButton
              size="sm"
              variant={copiedLink ? 'primary' : 'secondary'}
              onClick={() => void handleCopy(shareUrl, setCopiedLink)}
              className="shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3 w-3 text-emerald" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </PixelButton>
          </div>
        </div>

        {/* Social Share Intent Buttons */}
        <div className="space-y-1.5 pt-1">
          <label className="font-pixel text-[9px] uppercase text-ink-dim">
            Share on Developer Networks
          </label>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={xIntentUrl(shareUrl, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-ui flex items-center justify-center gap-1.5 border-2 border-night-edge bg-night px-3 py-2 font-pixel text-[9px] uppercase text-ink hover:border-ink-faint hover:text-rust-orange shadow-pixel text-center transition-colors"
            >
              <span>Share on X</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>

            <a
              href={linkedInShareUrl(shareUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-ui flex items-center justify-center gap-1.5 border-2 border-night-edge bg-night px-3 py-2 font-pixel text-[9px] uppercase text-ink hover:border-ink-faint hover:text-diamond shadow-pixel text-center transition-colors"
            >
              <span>LinkedIn</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>

            <a
              href={redditShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-ui flex items-center justify-center gap-1.5 border-2 border-night-edge bg-night px-3 py-2 font-pixel text-[9px] uppercase text-ink hover:border-ink-faint hover:text-gold shadow-pixel text-center transition-colors"
            >
              <span>Reddit</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Markdown & Discord Link Snippet */}
        <div className="space-y-1.5 pt-1">
          <label className="font-pixel text-[9px] uppercase text-ink-dim">
            Markdown Link (for Discord, GitHub & Blogs)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={markdownSnippet}
              className="w-full bg-[#14161b] px-3 py-1.5 font-code text-xs text-ink-dim border border-night-edge focus:outline-none select-all"
            />
            <button
              type="button"
              onClick={() => void handleCopy(markdownSnippet, setCopiedMarkdown)}
              className="shrink-0 border border-night-edge bg-night px-2.5 py-1.5 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors cursor-pointer"
            >
              {copiedMarkdown ? 'Copied' : 'Copy MD'}
            </button>
          </div>
        </div>

        {/* Embed iframe */}
        <div className="space-y-1.5 pt-1">
          <label className="font-pixel text-[9px] uppercase text-ink-dim">
            HTML Embed Code
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={embedSnippet}
              className="w-full bg-[#14161b] px-3 py-1.5 font-code text-xs text-ink-dim border border-night-edge focus:outline-none select-all"
            />
            <button
              type="button"
              onClick={() => void handleCopy(embedSnippet, setCopiedEmbed)}
              className="shrink-0 border border-night-edge bg-night px-2.5 py-1.5 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors cursor-pointer"
            >
              {copiedEmbed ? 'Copied' : 'Copy Embed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
