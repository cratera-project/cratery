import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { TutorialLesson } from '../../data/tutorial/types'
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Palette,
  Search,
  Terminal,
} from 'lucide-react'

import { InlineMarkdown } from '../ui/InlineMarkdown'

export type DocTheme = 'ayu' | 'coal' | 'navy' | 'rust' | 'light'

type Props = {
  currentLesson: TutorialLesson
  prevLesson?: TutorialLesson
  nextLesson?: TutorialLesson
  onToggleSidebar: () => void
  theme: DocTheme
  onSelectTheme: (theme: DocTheme) => void
  onOpenSearch: () => void
}

export function TutorialHeader({
  currentLesson,
  prevLesson,
  nextLesson,
  onToggleSidebar,
  theme,
  onSelectTheme,
  onOpenSearch,
}: Props) {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themes: Array<{ id: DocTheme; name: string; bg: string }> = [
    { id: 'ayu', name: 'Ayu Dark', bg: '#191f26' },
    { id: 'coal', name: 'Coal Charcoal', bg: '#141617' },
    { id: 'navy', name: 'Navy Blue', bg: '#161923' },
    { id: 'rust', name: 'Rust Warm', bg: '#2b2724' },
    { id: 'light', name: 'Light Paper', bg: '#faf8f5' },
  ]

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  return (
    <header className="sticky top-0 z-40 border-b-3 border-night-edge bg-night/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-3 sm:px-6">
        {/* Left: Sidebar Toggle & Search Command Palette */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center border-2 border-night-edge bg-night-raised text-ink transition-colors hover:border-rust-orange hover:text-rust-orange shadow-pixel cursor-pointer"
            title="Toggle Navigation Sidebar"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Quick Search Spotlight Bar */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex h-9 items-center gap-2.5 border-2 border-night-edge bg-night-raised px-3 font-sans text-xs text-ink-dim transition-all hover:border-rust-orange hover:text-ink w-44 sm:w-64 justify-between shadow-pixel cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="h-3.5 w-3.5 text-rust-orange shrink-0" />
              <span className="truncate">Search docs...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 border border-night-edge bg-night px-1.5 py-0.2 font-pixel text-[8px] text-ink-faint">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          </button>
        </div>

        {/* Center: Title / Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 font-pixel text-[10px] uppercase text-ink-dim truncate px-4">
          <Link to="/" className="text-ink hover:text-rust-orange transition-colors">
            Cratery
          </Link>
          <span>/</span>
          <span className="text-rust-orange">Learn</span>
          <span>/</span>
          <span className="text-ink truncate">
            {currentLesson.chapterNumber}.{currentLesson.lessonNumber} <InlineMarkdown text={currentLesson.title} variant="title" />
          </span>
        </div>

        {/* Right: Theme picker, Chevrons & Sandbox link */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              type="button"
              onClick={() => setThemeMenuOpen((open) => !open)}
              className="flex h-9 w-9 sm:w-auto sm:px-2.5 items-center justify-center gap-1.5 border-2 border-night-edge bg-night-raised font-pixel text-[9px] uppercase text-ink transition-colors hover:border-rust-orange hover:text-rust-orange shadow-pixel cursor-pointer"
              title="Change Documentation Theme"
            >
              <Palette className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{theme}</span>
            </button>

            {themeMenuOpen && (
              <div className="pixel-ui absolute right-0 top-11 z-50 min-w-[180px] border-4 border-black/60 bg-night-panel p-1.5 shadow-pixel-lg">
                <div className="px-2 py-1 font-pixel text-[8px] uppercase tracking-wider text-ink-faint border-b-2 border-night-edge mb-1">
                  Reading Theme
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onSelectTheme(t.id)
                      setThemeMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs transition-colors ${
                      theme === t.id
                        ? 'bg-rust-orange/20 text-rust-orange font-semibold border-l-2 border-rust-orange'
                        : 'text-ink hover:bg-night-raised'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span
                      className="h-3 w-3 border border-black shadow-xs"
                      style={{ backgroundColor: t.bg }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Chevrons */}
          <div className="flex items-center gap-1">
            {prevLesson ? (
              <Link
                to={`/learn/${prevLesson.id}`}
                className="flex h-9 w-9 items-center justify-center border-2 border-night-edge bg-night-raised text-ink transition-colors hover:border-rust-orange hover:text-rust-orange shadow-pixel"
                title={`Previous: ${prevLesson.title}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <button
                disabled
                className="flex h-9 w-9 items-center justify-center border-2 border-night-edge/30 bg-night/50 text-ink-faint/30 cursor-not-allowed shadow-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {nextLesson ? (
              <Link
                to={`/learn/${nextLesson.id}`}
                className="flex h-9 w-9 items-center justify-center border-2 border-night-edge bg-night-raised text-ink transition-colors hover:border-rust-orange hover:text-rust-orange shadow-pixel"
                title={`Next: ${nextLesson.title}`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                disabled
                className="flex h-9 w-9 items-center justify-center border-2 border-night-edge/30 bg-night/50 text-ink-faint/30 cursor-not-allowed shadow-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="hidden sm:block h-5 w-[1px] bg-night-edge mx-1" />

          <Link
            to="/category/interactive"
            className="hidden sm:inline-flex items-center gap-1.5 border-2 border-gold/70 bg-gold/15 px-2.5 py-1.5 font-pixel text-[9px] uppercase text-gold hover:border-gold hover:bg-gold/25 transition-colors shadow-pixel"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Sandbox</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
