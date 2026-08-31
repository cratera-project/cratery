import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllLessons, searchTutorialLessons } from '../../data/tutorial/curriculum'
import { Search, ArrowRight, X, Tag } from 'lucide-react'
import { InlineMarkdown } from '../ui/InlineMarkdown'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function DocSearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    if (!query.trim()) {
      return getAllLessons().slice(0, 8)
    }
    return searchTutorialLessons(query)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          navigate(`/learn/${results[selectedIndex].id}`)
          onClose()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, navigate, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="pixel-ui w-full max-w-2xl overflow-hidden border-4 border-black/60 bg-night-panel shadow-pixel-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b-2 border-night-edge bg-night-raised px-4 py-3">
          <Search className="h-4 w-4 text-rust-orange shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Rust documentation, syntax, errors, concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-ink-dim hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block border border-night-edge bg-night px-1.5 py-0.5 font-pixel text-[9px] text-ink-faint">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center font-pixel text-xs text-ink-dim uppercase">
              No lessons found for &ldquo;<span className="text-rust-orange">{query}</span>&rdquo;
            </div>
          ) : (
            results.map((lesson, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    navigate(`/learn/${lesson.id}`)
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`pixel-ui group flex items-start justify-between p-3 cursor-pointer border-2 transition-colors ${
                    isSelected
                      ? 'border-rust-orange bg-rust-orange/15 text-rust-orange shadow-pixel'
                      : 'border-transparent text-ink hover:border-night-edge hover:bg-night-raised'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-code text-xs font-bold opacity-75">
                        {lesson.chapterNumber}.{lesson.lessonNumber}
                      </span>
                      <span className="font-semibold text-sm truncate text-ink group-hover:text-rust-orange transition-colors">
                        <InlineMarkdown text={lesson.title} />
                      </span>
                      <span className="border border-night-edge bg-night px-1.5 py-0.2 font-pixel text-[8px] text-ink-dim uppercase">
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-ink-dim line-clamp-1">
                      <InlineMarkdown text={lesson.tagline} />
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {lesson.tags.slice(0, 4).map((t) => (
                        <span key={t} className="inline-flex items-center gap-0.5 text-[10px] text-ink-faint font-code">
                          <Tag className="h-2.5 w-2.5" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pt-1 text-ink-dim">
                    <span className="text-[11px] font-code text-ink-faint">
                      {lesson.readTimeMinutes}m
                    </span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? 'translate-x-1 text-rust-orange' : 'opacity-40'}`} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer Hotkeys Guide */}
        <div className="flex items-center justify-between border-t-2 border-night-edge bg-night px-4 py-2 text-xs text-ink-dim">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-pixel text-[8px] uppercase">
              <kbd className="border border-night-edge bg-night-raised px-1 py-0.5 font-code text-[9px]">↑</kbd>
              <kbd className="border border-night-edge bg-night-raised px-1 py-0.5 font-code text-[9px]">↓</kbd>
              <span>to move</span>
            </span>
            <span className="flex items-center gap-1 font-pixel text-[8px] uppercase">
              <kbd className="border border-night-edge bg-night-raised px-1 py-0.5 font-code text-[9px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="font-pixel text-[8px] text-ink-faint uppercase">
            {results.length} topics
          </span>
        </div>
      </div>
    </div>
  )
}
