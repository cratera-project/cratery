import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  saveActiveNoteDraft,
  loadActiveNoteDraft,
  clearActiveNoteDraft,
  NOTE_TEMPLATES,
  type NoteCell,
  type NoteDraft,
  type UserNote,
} from '../lib/notes'
import { NoteCellEditor } from '../components/notes/NoteCellEditor'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { AuthModal } from '../components/AuthModal'
import { SEO } from '../components/SEO'
import { isLocalDev } from '../lib/turnstile'
import {
  Save,
  Globe,
  Lock,
  ArrowLeft,
  Trash2,
  FileCode,
  FileText,
  Check,
  AlertTriangle,
} from 'lucide-react'

function createCellId(): string {
  return `cell_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

const DEFAULT_EMPTY_DRAFT: NoteDraft = {
  title: 'Untitled Rust Note',
  description: 'An interactive exploration of Rust with runnable code snippets.',
  is_public: true,
  tags: ['rust', 'notes'],
  cells: [
    {
      id: 'cell_init_1',
      type: 'markdown',
      content: `# Untitled Rust Note\n\nStart writing notes and explanations in Markdown...`,
    },
    {
      id: 'cell_init_2',
      type: 'code',
      content: `fn main() {\n    println!("Hello from Cratery Interactive Rust Notes!");\n}`,
      caption: 'Main Entry Point',
      language: 'rust',
    },
  ],
}

export function NoteEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [note, setNote] = useState<UserNote | null>(null)
  const [draft, setDraft] = useState<NoteDraft>(() => {
    const templateId = searchParams.get('template')
    if (templateId) {
      const tmpl = NOTE_TEMPLATES.find((t) => t.id === templateId)
      if (tmpl) return JSON.parse(JSON.stringify(tmpl.draft))
    }
    if (!id) {
      const saved = loadActiveNoteDraft()
      if (saved) return saved
    }
    return DEFAULT_EMPTY_DRAFT
  })

  const [tagsInput, setTagsInput] = useState(() => draft.tags.join(', '))
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  
  useEffect(() => {
    if (!id) return
    let isCancelled = false

    async function loadExisting() {
      const loaded = await getNote(id!)
      if (isCancelled) return

      if (loaded) {
        setNote(loaded)
        const loadedDraft: NoteDraft = {
          title: loaded.title,
          description: loaded.description,
          is_public: loaded.is_public,
          tags: loaded.tags,
          cells: loaded.cells,
        }
        setDraft(loadedDraft)
        setTagsInput(loaded.tags.join(', '))
      } else {
        setErrorMessage('Note not found.')
      }
    }

    void loadExisting()
    return () => {
      isCancelled = true
    }
  }, [id])

  
  useEffect(() => {
    if (!id) {
      saveActiveNoteDraft(draft)
    }
  }, [draft, id])

  const handleTagsChange = (val: string) => {
    setTagsInput(val)
    const parsed = val
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean)
    setDraft((prev) => ({ ...prev, tags: parsed }))
  }

  const handleAddCell = (type: 'markdown' | 'code') => {
    const newCell: NoteCell = {
      id: createCellId(),
      type,
      content:
        type === 'markdown'
          ? `### New Section\n\nAdd markdown explanation here...`
          : `fn main() {\n    // Interactive Rust snippet\n    println!("Executing code cell...");\n}`,
      caption: type === 'code' ? 'Code Snippet' : undefined,
      language: type === 'code' ? 'rust' : undefined,
    }
    setDraft((prev) => ({
      ...prev,
      cells: [...prev.cells, newCell],
    }))
  }

  const handleUpdateCell = (index: number, updated: NoteCell) => {
    setDraft((prev) => {
      const nextCells = [...prev.cells]
      nextCells[index] = updated
      return { ...prev, cells: nextCells }
    })
  }

  const handleDeleteCell = (index: number) => {
    if (draft.cells.length <= 1) return
    setDraft((prev) => {
      const nextCells = prev.cells.filter((_, i) => i !== index)
      return { ...prev, cells: nextCells }
    })
  }

  const handleMoveCell = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= draft.cells.length) return

    setDraft((prev) => {
      const nextCells = [...prev.cells]
      const [moved] = nextCells.splice(index, 1)
      nextCells.splice(targetIndex, 0, moved)
      return { ...prev, cells: nextCells }
    })
  }

  const handleDuplicateCell = (index: number) => {
    const cellToCopy = draft.cells[index]
    const duplicated: NoteCell = {
      ...cellToCopy,
      id: createCellId(),
    }
    setDraft((prev) => {
      const nextCells = [...prev.cells]
      nextCells.splice(index + 1, 0, duplicated)
      return { ...prev, cells: nextCells }
    })
  }

  const handleSave = async () => {
    if (!user && !isLocalDev) {
      setShowAuthModal(true)
      return
    }

    if (draft.title.trim().length < 2) {
      setErrorMessage('Please provide a title with at least 2 characters.')
      return
    }

    setSaving(true)
    setErrorMessage(null)

    try {
      if (id && note) {
        
        const res = await updateNote(id, draft)
        if (res.ok && res.note) {
          setSaveSuccess(true)
          setTimeout(() => setSaveSuccess(false), 2500)
          navigate(`/notes/${res.note.slug || res.note.id}`)
        } else {
          setErrorMessage(res.error || 'Failed to update note.')
        }
      } else {
        
        const res = await createNote(draft)
        if (res.ok && res.note) {
          clearActiveNoteDraft()
          navigate(`/notes/${res.note.slug || res.note.id}`)
        } else {
          setErrorMessage(res.error || 'Failed to create note.')
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id || (!user && !isLocalDev)) return
    setSaving(true)
    try {
      const res = await deleteNote(id)
      if (res.ok) {
        navigate('/notes')
      } else {
        setErrorMessage(res.error || 'Failed to delete note.')
      }
    } finally {
      setSaving(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <SEO
        title={`${id ? 'Edit Note' : 'Create Interactive Note'} · Cratery`}
        description="Author interactive Rust notebooks with runnable code cells and rich Markdown explanations."
      />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-night-edge pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/notes')}
            className="pixel-ui flex items-center gap-1.5 border-2 border-night-edge bg-night px-2.5 py-1 font-pixel text-[10px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Notes Hub</span>
          </button>

          <h1 className="font-pixel text-sm sm:text-base uppercase text-ink">
            {id ? 'Edit Interactive Note' : 'New Interactive Note'}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {id && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="pixel-ui flex items-center gap-1 border-2 border-night-edge bg-night px-2.5 py-1.5 font-pixel text-[9px] uppercase text-redstone hover:border-redstone transition-colors cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </button>
          )}

          <PixelButton
            size="sm"
            variant="primary"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-1.5"
          >
            {saving ? (
              <span>Saving…</span>
            ) : saveSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>{id ? 'Save Changes' : 'Publish Note'}</span>
              </>
            )}
          </PixelButton>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="border-2 border-redstone bg-redstone/15 p-3 flex items-center gap-2 text-xs text-redstone font-pixel uppercase">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Notebook Metadata Card */}
      <PixelPanel className="p-5 sm:p-6 space-y-4">
        {/* Title & Visibility Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label className="font-pixel text-[9px] uppercase text-ink-dim">
              Notebook Title
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Understanding Zero-Cost Abstractions in Rust"
              className="w-full bg-[#14161b] px-3 py-2 font-pixel text-xs sm:text-sm uppercase text-ink border border-night-edge focus:outline-none focus:border-rust-orange"
            />
          </div>

          {/* Visibility Switch */}
          <div className="space-y-1 sm:w-56 shrink-0">
            <label className="font-pixel text-[9px] uppercase text-ink-dim">
              Visibility Status
            </label>
            <button
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, is_public: !prev.is_public }))}
              className={`pixel-ui flex w-full items-center justify-between border-2 px-3 py-2 font-pixel text-[10px] uppercase transition-colors cursor-pointer ${
                draft.is_public
                  ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300'
                  : 'border-gold/80 bg-gold/15 text-gold'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {draft.is_public ? (
                  <Globe className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-gold" />
                )}
                <span>{draft.is_public ? 'Public' : 'Private'}</span>
              </div>
              <span className="font-code text-[9px] text-ink-faint">
                (Click to toggle)
              </span>
            </button>
          </div>
        </div>

        {/* Description & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-pixel text-[9px] uppercase text-ink-dim">
              Description / Summary (for previews & social sharing)
            </label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
              placeholder="Brief summary of what this note explores..."
              className="w-full bg-[#14161b] p-2.5 font-sans text-xs text-ink border border-night-edge focus:outline-none focus:border-rust-orange"
            />
          </div>

          <div className="space-y-1">
            <label className="font-pixel text-[9px] uppercase text-ink-dim">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="rust, memory, lifetimes, concurrency"
              className="w-full bg-[#14161b] px-3 py-2 font-code text-xs text-ink border border-night-edge focus:outline-none focus:border-rust-orange"
            />
            <p className="font-code text-[10px] text-ink-faint">
              Tags help other Rustaceans discover your notebook in the community gallery.
            </p>
          </div>
        </div>
      </PixelPanel>

      {/* Ordered Cells Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-pixel text-xs uppercase text-ink">
            Notebook Cells ({draft.cells.length})
          </span>
          <span className="font-code text-xs text-ink-dim">
            Drag, edit, run, and arrange your content
          </span>
        </div>

        <div className="space-y-4">
          {draft.cells.map((cell, idx) => (
            <NoteCellEditor
              key={cell.id}
              cell={cell}
              index={idx}
              totalCells={draft.cells.length}
              onChange={(updated) => handleUpdateCell(idx, updated)}
              onDelete={() => handleDeleteCell(idx)}
              onMoveUp={() => handleMoveCell(idx, 'up')}
              onMoveDown={() => handleMoveCell(idx, 'down')}
              onDuplicate={() => handleDuplicateCell(idx)}
            />
          ))}
        </div>

        {/* Add Cell Action Strip */}
        <div className="pixel-ui flex flex-wrap items-center justify-center gap-3 border-2 border-dashed border-night-edge bg-night/50 p-4">
          <button
            type="button"
            onClick={() => handleAddCell('markdown')}
            className="pixel-ui inline-flex items-center gap-1.5 border-2 border-diamond/60 bg-diamond/10 px-3.5 py-1.5 font-pixel text-[10px] uppercase text-diamond hover:bg-diamond/20 transition-colors cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>+ Add Markdown Cell</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddCell('code')}
            className="pixel-ui inline-flex items-center gap-1.5 border-2 border-rust-orange/60 bg-rust-orange/10 px-3.5 py-1.5 font-pixel text-[10px] uppercase text-rust-orange hover:bg-rust-orange/20 transition-colors cursor-pointer"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>+ Add Rust Code Cell</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="pixel-ui relative w-full max-w-md border-4 border-black/80 bg-night-panel p-6 shadow-pixel-lg space-y-4">
            <h3 className="font-pixel text-sm uppercase text-redstone">
              Delete Interactive Note?
            </h3>
            <p className="font-sans text-xs text-ink-dim leading-relaxed">
              Are you sure you want to delete <strong>&quot;{draft.title}&quot;</strong>? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-night-edge bg-night px-3 py-1.5 font-pixel text-[10px] uppercase text-ink-dim hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                className="border-2 border-redstone bg-redstone px-3 py-1.5 font-pixel text-[10px] uppercase text-white hover:bg-redstone/90 cursor-pointer shadow-pixel"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
