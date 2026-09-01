import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  listCommunityNotes,
  listMyNotes,
  NOTE_TEMPLATES,
  type UserNote,
} from '../lib/notes'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { AuthModal } from '../components/AuthModal'
import { SEO } from '../components/SEO'
import { isLocalDev } from '../lib/turnstile'
import {
  FileCode,
  Plus,
  Search,
  Globe,
  Lock,
  Eye,
  GitFork,
  BookOpen,
  Sparkles,
  Terminal,
  User,
  ArrowRight,
} from 'lucide-react'

export function NotesListPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'explore' | 'mine'>('explore')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<'newest' | 'popular'>('newest')
  const [communityNotes, setCommunityNotes] = useState<UserNote[]>([])
  const [myNotes, setMyNotes] = useState<UserNote[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function loadData() {
      if (activeTab === 'explore') {
        const notes = await listCommunityNotes({
          q: searchQuery || undefined,
          tag: selectedTag || undefined,
          sort: sortMode,
        })
        if (!cancelled) {
          setCommunityNotes(notes)
          setLoading(false)
        }
      } else {
        if (!user && !isLocalDev) {
          if (!cancelled) {
            setMyNotes([])
            setLoading(false)
          }
          return
        }
        const notes = await listMyNotes()
        if (!cancelled) {
          setMyNotes(notes)
          setLoading(false)
        }
      }
    }

    void loadData()
    return () => {
      cancelled = true
    }
  }, [activeTab, searchQuery, selectedTag, sortMode, user])

  const maxQuota = 50
  const notesUnlimited = isLocalDev

  const handleCreateNew = () => {
    if (!user && !isLocalDev) {
      setShowAuthModal(true)
      return
    }
    if (!notesUnlimited && myNotes.length >= maxQuota) {
      alert('Limit of 50 notebooks reached. Please delete unused notebooks to create more.')
      return
    }
    navigate('/notes/new')
  }

  const allTags = useMemo(() => {
    const set = new Set<string>()
    communityNotes.forEach((n) => n.tags.forEach((t) => set.add(t)))
    return Array.from(set).slice(0, 10)
  }, [communityNotes])

  const displayedNotes = activeTab === 'explore' ? communityNotes : myNotes

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <SEO
        title="Interactive Rust Notes & Notebooks · Cratery"
        description="Google Colab style interactive notebooks for Rust. Write markdown explanations and execute Rust code snippets in isolated microVMs."
      />

      {/* Hero Banner */}
      <PixelPanel className="relative overflow-hidden p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 font-pixel text-xs uppercase text-rust-orange">
              <FileCode className="h-4 w-4" />
              <span>Interactive Notebooks</span>
              <span className="border border-gold/70 bg-gold/15 px-1.5 py-0.2 text-[8px] text-gold">
                New Feature
              </span>
            </div>
            <h1 className="font-pixel text-lg sm:text-2xl uppercase text-ink leading-tight">
              Interactive Rust Notes
            </h1>
            <p className="font-sans text-sm text-ink-dim leading-relaxed">
              Google Colab style notebooks tailored for Rustaceans. Combine rich Markdown explanations with runnable code cells, test concepts in isolated microVMs, and share your notes with the global Rust community.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <PixelButton
              size="md"
              variant="primary"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Note</span>
            </PixelButton>
          </div>
        </div>

        {/* Starter Templates Shelf */}
        <div className="pt-4 border-t border-night-edge">
          <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-faint mb-3">
            <Sparkles className="h-3 w-3 text-gold" />
            <span>Quick Start Templates</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {NOTE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  if (!user && !isLocalDev) {
                    setShowAuthModal(true)
                  } else {
                    navigate(`/notes/new?template=${tmpl.id}`)
                  }
                }}
                className="pixel-ui group border-2 border-night-edge bg-night p-3 space-y-1 hover:border-rust-orange transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[10px] uppercase text-ink group-hover:text-rust-orange transition-colors">
                    {tmpl.name}
                  </span>
                  <ArrowRight className="h-3 w-3 text-ink-faint group-hover:text-rust-orange transition-colors" />
                </div>
                <p className="font-sans text-xs text-ink-dim line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PixelPanel>

      {/* Tabs & Search Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-night-edge pb-3">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`pixel-ui flex items-center gap-2 border-2 px-3 py-1.5 font-pixel text-[10px] uppercase transition-colors cursor-pointer ${
                activeTab === 'explore'
                  ? 'border-rust-orange bg-rust-orange/15 text-rust-orange font-bold'
                  : 'border-night-edge bg-night text-ink-dim hover:text-ink'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Explore Community ({communityNotes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user && !isLocalDev) {
                  setShowAuthModal(true)
                } else {
                  setActiveTab('mine')
                }
              }}
              className={`pixel-ui flex items-center gap-2 border-2 px-3 py-1.5 font-pixel text-[10px] uppercase transition-colors cursor-pointer ${
                activeTab === 'mine'
                  ? 'border-rust-orange bg-rust-orange/15 text-rust-orange font-bold'
                  : 'border-night-edge bg-night text-ink-dim hover:text-ink'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>
                My Notes{' '}
                {notesUnlimited
                  ? `(${myNotes.length})`
                  : user
                    ? `(${myNotes.length}/${maxQuota})`
                    : ''}
              </span>
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2">
            {activeTab === 'explore' && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes or tags..."
                  className="bg-[#14161b] pl-8 pr-3 py-1.5 font-code text-xs text-ink border border-night-edge focus:outline-none focus:border-rust-orange/80 w-48 sm:w-60"
                />
              </div>
            )}

            {activeTab === 'explore' && (
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as 'newest' | 'popular')}
                className="bg-[#14161b] px-2.5 py-1.5 font-pixel text-[9px] uppercase text-ink border border-night-edge focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Viewed</option>
              </select>
            )}
          </div>
        </div>

        {/* My Notes Quota Banner */}
        {activeTab === 'mine' && (user || isLocalDev) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-night-edge bg-night p-3">
            <div className="flex items-center gap-2 font-pixel text-[9px] uppercase text-ink">
              <FileCode className="h-3.5 w-3.5 text-diamond" />
              <span>
                {notesUnlimited ? (
                  <>
                    Local Notebooks:{' '}
                    <strong className="text-rust-orange">{myNotes.length}</strong>{' '}
                    (no limit)
                  </>
                ) : (
                  <>
                    Notebook Quota:{' '}
                    <strong
                      className={
                        myNotes.length >= maxQuota ? 'text-heart' : 'text-rust-orange'
                      }
                    >
                      {myNotes.length}
                    </strong>{' '}
                    / {maxQuota} notebooks used
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Tag Filters */}
        {activeTab === 'explore' && allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-pixel text-[9px] uppercase text-ink-faint mr-1">
              Tags:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-2 py-0.5 font-pixel text-[8px] uppercase border transition-colors cursor-pointer ${
                selectedTag === null
                  ? 'border-rust-orange bg-rust-orange/20 text-rust-orange'
                  : 'border-night-edge bg-night text-ink-dim hover:text-ink'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 font-pixel text-[8px] uppercase border transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'border-rust-orange bg-rust-orange/20 text-rust-orange'
                    : 'border-night-edge bg-night text-ink-dim hover:text-ink'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="py-16 text-center font-pixel text-xs text-gold uppercase animate-pulse">
          Loading interactive notes…
        </div>
      ) : displayedNotes.length === 0 ? (
        <PixelPanel className="p-12 text-center space-y-4">
          <FileCode className="h-10 w-10 text-ink-faint mx-auto" />
          <div className="font-pixel text-sm uppercase text-ink">
            {activeTab === 'mine'
              ? "You haven't created any interactive notes yet."
              : 'No notes found matching your criteria.'}
          </div>
          <p className="font-sans text-xs text-ink-dim max-w-md mx-auto">
            {activeTab === 'mine'
              ? 'Start by creating your first interactive Rust note with explanations and runnable code snippets.'
              : 'Try clearing your search filters or create a new note to share with the community.'}
          </p>
          <div className="pt-2">
            <PixelButton size="sm" variant="primary" onClick={handleCreateNew}>
              Create Your First Note
            </PixelButton>
          </div>
        </PixelPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedNotes.map((note) => {
            const markdownCount = note.cells.filter((c) => c.type === 'markdown').length
            const codeCount = note.cells.filter((c) => c.type === 'code').length
            const isCore =
              note.author_username === 'Cratery Core' ||
              note.author_id === 'cratery-team' ||
              note.id.startsWith('template-') ||
              note.id.startsWith('cratery-')

            return (
              <div
                key={note.id}
                className="pixel-ui flex flex-col justify-between border-4 border-black/60 bg-night-panel p-5 shadow-pixel hover:border-night-edge transition-all space-y-4 group"
              >
                <div className="space-y-2.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {note.is_public ? (
                        <span className="flex items-center gap-1 border border-emerald-500/50 bg-emerald-950/30 px-1.5 py-0.2 font-pixel text-[8px] uppercase text-emerald-300">
                          <Globe className="h-2.5 w-2.5" />
                          <span>Public</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 border border-gold/50 bg-gold/15 px-1.5 py-0.2 font-pixel text-[8px] uppercase text-gold">
                          <Lock className="h-2.5 w-2.5" />
                          <span>Private</span>
                        </span>
                      )}

                      <span className="font-code text-[11px] text-ink-faint">
                        by {note.author_username}
                      </span>
                    </div>

                    {!isCore ? (
                      <div className="flex items-center gap-3 text-ink-dim font-code text-xs">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="h-3 w-3" />
                          <span>{note.views_count}</span>
                        </span>
                        <span className="flex items-center gap-1" title="Code Runs">
                          <Terminal className="h-3 w-3 text-rust-orange" />
                          <span>{note.runs_count}</span>
                        </span>
                        <span className="flex items-center gap-1" title="Forks">
                          <GitFork className="h-3 w-3 text-gold" />
                          <span>{note.forks_count}</span>
                        </span>
                      </div>
                    ) : (
                      <span className="border border-rust-orange/60 bg-rust-orange/15 px-1.5 py-0.2 font-pixel text-[8px] uppercase text-rust-orange">
                        Official Guide
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <Link
                    to={`/notes/${note.slug || note.id}`}
                    className="block group-hover:text-rust-orange transition-colors"
                  >
                    <h3 className="font-pixel text-sm uppercase text-ink line-clamp-1">
                      {note.title}
                    </h3>
                  </Link>

                  <p className="font-sans text-xs text-ink-dim line-clamp-2 leading-relaxed">
                    {note.description || 'No description provided.'}
                  </p>

                  {/* Cell Composition Badge */}
                  <div className="flex items-center gap-2 pt-1 font-pixel text-[8px] uppercase text-ink-faint">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-2.5 w-2.5 text-diamond" />
                      <span>{markdownCount} Markdown</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Terminal className="h-2.5 w-2.5 text-rust-orange" />
                      <span>{codeCount} Code Cells</span>
                    </span>
                  </div>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-night-edge bg-night px-1.5 py-0.2 font-code text-[10px] text-ink-dim"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between border-t border-night-edge pt-3">
                  <span className="font-code text-[10px] text-ink-faint">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {user && user.id === note.author_id && (
                      <Link
                        to={`/notes/${note.id}/edit`}
                        className="pixel-ui border border-night-edge bg-night px-2.5 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors"
                      >
                        Edit
                      </Link>
                    )}

                    <Link
                      to={`/notes/${note.slug || note.id}`}
                      className="pixel-ui border-2 border-rust-orange bg-rust-orange/15 px-3 py-1 font-pixel text-[9px] uppercase text-rust-orange hover:bg-rust-orange hover:text-white transition-colors"
                    >
                      Open Notebook →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
