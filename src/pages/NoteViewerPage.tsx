import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNote, forkNote, type UserNote } from '../lib/notes'
import { NoteCellViewer } from '../components/notes/NoteCellViewer'
import { ShareNoteModal } from '../components/notes/ShareNoteModal'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { AuthModal } from '../components/AuthModal'
import { SEO } from '../components/SEO'
import {
  FileCode,
  Share2,
  GitFork,
  Edit3,
  Globe,
  Lock,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  Sparkles,
  Terminal,
  AlertTriangle,
} from 'lucide-react'

export function NoteViewerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [note, setNote] = useState<UserNote | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [forking, setForking] = useState(false)
  const [forkError, setForkError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)

    async function load() {
      const loaded = await getNote(id!)
      if (cancelled) return

      if (loaded) {
        setNote(loaded)
      } else {
        setErrorMessage('Note not found or you do not have permission to view it.')
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleFork = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (!note || forking) return

    setForking(true)
    setForkError(null)
    try {
      const res = await forkNote(note.id || note.slug)
      if (res.ok && res.note) {
        navigate(`/notes/${res.note.slug || res.note.id}/edit`)
      } else {
        const err = res.error || 'Failed to fork notebook. Please try again.'
        setForkError(err)
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Failed to fork notebook. Please try again.'
      setForkError(errMessage)
    } finally {
      setForking(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-24 text-center font-pixel text-xs text-gold uppercase animate-pulse">
        Loading notebook…
      </div>
    )
  }

  if (errorMessage || !note) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <PixelPanel className="p-8 space-y-4">
          <FileCode className="h-10 w-10 text-rust-orange mx-auto" />
          <h2 className="font-pixel text-sm uppercase text-ink">
            {errorMessage || 'Notebook Not Found'}
          </h2>
          <p className="font-sans text-xs text-ink-dim">
            The note you are looking for might be private, deleted, or the link may be incorrect.
          </p>
          <div className="pt-2">
            <Link to="/notes">
              <PixelButton size="sm" variant="primary">
                Browse Community Notes
              </PixelButton>
            </Link>
          </div>
        </PixelPanel>
      </div>
    )
  }

  const isAuthor = user && user.id === note.author_id
  const markdownCellsCount = note.cells.filter((c) => c.type === 'markdown').length
  const codeCellsCount = note.cells.filter((c) => c.type === 'code').length

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <SEO
        title={`${note.title} · Interactive Rust Note`}
        description={note.description || `Interactive Rust notebook by ${note.author_username} on Cratery.`}
      />

      {/* Navigation Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-night-edge pb-4">
        <div className="flex items-center gap-2">
          <Link
            to="/notes"
            className="pixel-ui flex items-center gap-1.5 border border-night-edge bg-night px-2.5 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>All Notes</span>
          </Link>
          <span className="font-pixel text-[9px] uppercase text-ink-faint">/</span>
          <span className="font-pixel text-[9px] uppercase text-ink-dim truncate max-w-[200px] sm:max-w-xs">
            {note.title}
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="pixel-ui flex items-center gap-1.5 border-2 border-rust-orange bg-rust-orange/15 px-3 py-1 font-pixel text-[9px] uppercase text-rust-orange hover:bg-rust-orange hover:text-white transition-colors cursor-pointer"
            title="Share note on social networks, copy link, or embed"
          >
            <Share2 className="h-3 w-3" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={() => void handleFork()}
            disabled={forking}
            className="pixel-ui flex items-center gap-1.5 border border-night-edge bg-night px-3 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors cursor-pointer"
            title="Fork this notebook into your personal workspace"
          >
            <GitFork className="h-3 w-3 text-gold" />
            <span>{forking ? 'Forking…' : 'Fork'}</span>
          </button>

          {isAuthor && (
            <Link
              to={`/notes/${note.id}/edit`}
              className="pixel-ui flex items-center gap-1.5 border border-night-edge bg-night px-3 py-1 font-pixel text-[9px] uppercase text-ink hover:border-ink-faint transition-colors"
            >
              <Edit3 className="h-3 w-3 text-diamond" />
              <span>Edit</span>
            </Link>
          )}
        </div>
      </div>

      {/* Fork Error Banner */}
      {forkError && (
        <div className="border-2 border-redstone bg-redstone/15 p-3 flex items-center justify-between gap-2 text-xs text-redstone font-pixel uppercase">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{forkError}</span>
          </div>
          <button
            type="button"
            onClick={() => setForkError(null)}
            className="text-redstone hover:text-white px-1 font-sans text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Notebook Header Card */}
      <PixelPanel className="p-6 sm:p-8 space-y-4 border-4 border-black/80">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {note.is_public ? (
              <span className="flex items-center gap-1 border border-emerald-500/60 bg-emerald-950/30 px-2 py-0.5 font-pixel text-[8px] uppercase text-emerald-300">
                <Globe className="h-2.5 w-2.5" />
                <span>Public Notebook</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 border border-gold/60 bg-gold/15 px-2 py-0.5 font-pixel text-[8px] uppercase text-gold">
                <Lock className="h-2.5 w-2.5" />
                <span>Private Notebook</span>
              </span>
            )}

            <div className="flex items-center gap-1.5 font-code text-xs text-ink-dim">
              <User className="h-3.5 w-3.5 text-ink-faint" />
              <span>Author:</span>
              <Link
                to={`/profile/${note.author_username}`}
                className="text-rust-orange hover:underline font-bold"
              >
                @{note.author_username}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 text-ink-dim font-code text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(note.created_at).toLocaleDateString()}</span>
            </span>
            {!(
              note.author_username === 'Cratery Core' ||
              note.author_id === 'cratery-team' ||
              note.id.startsWith('template-') ||
              note.id.startsWith('cratery-')
            ) && (
              <>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{note.views_count} views</span>
                </span>
                <span className="flex items-center gap-1">
                  <Terminal className="h-3 w-3 text-rust-orange" />
                  <span>{note.runs_count} runs</span>
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3 text-gold" />
                  <span>{note.forks_count} forks</span>
                </span>
              </>
            )}
          </div>
        </div>

        <h1 className="font-pixel text-xl sm:text-2xl uppercase text-ink leading-tight">
          {note.title}
        </h1>

        {note.description && (
          <p className="font-sans text-sm text-ink/90 leading-relaxed max-w-3xl">
            {note.description}
          </p>
        )}

        {/* Tags & Notebook Composition */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-night-edge">
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="border border-night-edge bg-night px-2 py-0.5 font-code text-[11px] text-ink-dim"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 font-pixel text-[8px] uppercase text-ink-faint">
            <span className="text-diamond">{markdownCellsCount} Markdown Sections</span>
            <span>·</span>
            <span className="text-rust-orange">{codeCellsCount} Runnable Code Cells</span>
          </div>
        </div>
      </PixelPanel>

      {/* Notebook Cells Container */}
      <div className="space-y-6">
        {note.cells.map((cell, idx) => (
          <NoteCellViewer key={cell.id} cell={cell} index={idx} noteId={note.id} />
        ))}
      </div>

      {/* Footer Share & Fork Callout */}
      <PixelPanel className="p-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 font-pixel text-xs uppercase text-gold">
          <Sparkles className="h-4 w-4" />
          <span>Enjoyed this interactive note?</span>
        </div>
        <p className="font-sans text-xs text-ink-dim max-w-md mx-auto">
          Share this notebook with fellow developers or fork it to add your own experiments.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <PixelButton size="sm" variant="primary" onClick={() => setShareModalOpen(true)}>
            Share Notebook
          </PixelButton>
          <PixelButton size="sm" variant="secondary" onClick={() => void handleFork()}>
            Fork to My Workspace
          </PixelButton>
        </div>
      </PixelPanel>

      <ShareNoteModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        note={note}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
