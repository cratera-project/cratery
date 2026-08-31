import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getAllLessons,
  getLessonById,
  getNextLesson,
  getPrevLesson,
  getChapterByLessonId,
} from '../data/tutorial/curriculum'
import { TutorialSidebar } from '../components/tutorial/TutorialSidebar'
import { TutorialHeader, type DocTheme } from '../components/tutorial/TutorialHeader'
import { DocSearchModal } from '../components/tutorial/DocSearchModal'
import { OnThisPageToc } from '../components/tutorial/OnThisPageToc'
import { TutorialQuestRunner } from '../components/tutorial/TutorialQuestRunner'
import { TutorialQuizCard } from '../components/tutorial/TutorialQuizCard'
import { CodeBlock } from '../components/ui/CodeBlock'
import { MarkdownBody } from '../components/MarkdownBody'
import { InlineMarkdown } from '../components/ui/InlineMarkdown'
import { stripMarkdown } from '../lib/markdown'
import { SEO } from '../components/SEO'
import { EditOnGitHub } from '../components/EditOnGitHub'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Hash,
  BookOpen,
  XCircle,
  CheckCircle2,
  Terminal,
} from 'lucide-react'

const THEME_STORAGE_KEY = 'cratery_doc_theme'

export function TutorialPage() {
  const { lessonId } = useParams<{ lessonId?: string }>()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [theme, setTheme] = useState<DocTheme>(() => {
    try {
      return (localStorage.getItem(THEME_STORAGE_KEY) as DocTheme) || 'ayu'
    } catch {
      return 'ayu'
    }
  })

  const handleSelectTheme = (newTheme: DocTheme) => {
    setTheme(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      /* ignore */
    }
  }

  const allLessons = useMemo(() => getAllLessons(), [])
  const currentLesson = useMemo(() => {
    if (!lessonId) return allLessons[0]
    return getLessonById(lessonId) || allLessons[0]
  }, [lessonId, allLessons])

  const chapter = useMemo(() => {
    return currentLesson ? getChapterByLessonId(currentLesson.id) : undefined
  }, [currentLesson])

  const nextLesson = useMemo(() => {
    return currentLesson ? getNextLesson(currentLesson.id) : undefined
  }, [currentLesson])

  const prevLesson = useMemo(() => {
    return currentLesson ? getPrevLesson(currentLesson.id) : undefined
  }, [currentLesson])

  const tutorialMarkdownPath = useMemo(() => {
    if (!currentLesson) return ''
    return (
      currentLesson.filePath ||
      (chapter
        ? `content/tutorials/chapter-${String(chapter.number).padStart(2, '0')}-${chapter.id}/${currentLesson.id}.md`
        : '')
    )
  }, [currentLesson, chapter])

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentLesson?.id])

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput = Boolean(
        target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable ||
            target.closest('.monaco-editor') !== null ||
            target.closest('input, textarea, select, [contenteditable="true"]') !== null)
      )

      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchModalOpen(true)
      } else if (e.key === '/' && !isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setSearchModalOpen(true)
      } else if ((e.key === 'b' || e.key === 'B') && (e.metaKey || e.ctrlKey) && !isInput) {
        e.preventDefault()
        setSidebarOpen((s) => !s)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!currentLesson) {
    return (
      <div className="py-12 text-center font-pixel text-xs text-ink-dim uppercase">
        Lesson not found.
      </div>
    )
  }

  const themeStyles = {
    ayu: 'bg-[#191f26] text-[#e6e1cf]',
    coal: 'bg-[#141617] text-[#c5c8c6]',
    navy: 'bg-[#161923] text-[#bcbdd0]',
    rust: 'bg-[#2b2724] text-[#e8e4e0]',
    light: 'bg-[#faf8f5] text-[#222222]',
  }

  const difficultyBadges = {
    beginner: 'border-emerald-500/70 bg-emerald-950/40 text-emerald-400',
    intermediate: 'border-gold/70 bg-gold/15 text-gold',
    advanced: 'border-rust-orange/70 bg-rust-orange/15 text-rust-orange',
  }

  return (
    <div className={`min-h-screen ${themeStyles[theme]} font-sans transition-colors duration-200`}>
      <SEO
        title={`${stripMarkdown(currentLesson.title)} · Rust Tutorial`}
        description={stripMarkdown(currentLesson.overview)}
      />

      {/* Global ⌘K Search Modal */}
      <DocSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Retro Pixel Documentation Header */}
      <TutorialHeader
        currentLesson={currentLesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      <div className="mx-auto max-w-[1600px] flex">
        {/* Left Navigation Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'
          } fixed bottom-0 top-14 z-30 transition-all duration-200 ease-in-out lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] shrink-0 overflow-hidden shadow-pixel-lg lg:shadow-none`}
        >
          <div className="h-full w-72">
            <TutorialSidebar
              currentLessonId={currentLesson.id}
              onSelectLesson={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
            />
          </div>
        </div>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-14 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Center Reading Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
          <article className="mx-auto max-w-3xl space-y-10">
            {/* Header Title & Breadcrumbs */}
            <div className="space-y-3 border-b-2 border-night-edge pb-6">
              <div className="flex flex-wrap items-center gap-2 font-pixel text-[9px] uppercase text-ink-dim">
                <Link to="/learn" className="hover:text-rust-orange transition-colors">
                  Tutorial
                </Link>
                <span>›</span>
                <span className="text-ink-faint">
                  Ch {currentLesson.chapterNumber}: <InlineMarkdown text={chapter?.title} />
                </span>
                <span>›</span>
                <span className="text-rust-orange font-bold">
                  {currentLesson.chapterNumber}.{currentLesson.lessonNumber}
                </span>
              </div>

              <h1 className="font-pixel text-lg sm:text-xl lg:text-2xl uppercase tracking-[0.02em] text-ink leading-tight">
                <InlineMarkdown text={currentLesson.title} variant="title" />
              </h1>

              <p className="text-base sm:text-lg text-ink-dim leading-relaxed font-sans">
                <InlineMarkdown text={currentLesson.tagline} />
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <span className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-dim">
                  <Clock className="h-3.5 w-3.5 text-rust-orange" />
                  <span>{currentLesson.readTimeMinutes} min read</span>
                </span>
                <span className={`border px-2 py-0.5 font-pixel text-[8px] uppercase ${difficultyBadges[currentLesson.difficulty]}`}>
                  {currentLesson.difficulty}
                </span>
                {currentLesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-night-edge bg-night-raised px-2 py-0.5 font-code text-[11px] text-ink-dim"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview Box */}
            <div className="pixel-ui border-4 border-black/60 bg-night-panel p-5 shadow-pixel space-y-2">
              <div className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-wider text-rust-orange">
                <BookOpen className="h-4 w-4" />
                <span>Overview</span>
              </div>
              <div className="text-stone-200">
                <MarkdownBody>{currentLesson.overview}</MarkdownBody>
              </div>
            </div>

            {/* Step-by-Step Sections */}
            <div className="space-y-10">
              {currentLesson.sections.map((section) => (
                <section key={section.id} id={section.id} className="space-y-3.5 scroll-mt-20">
                  <h2 className="group flex items-center gap-2 font-pixel text-sm sm:text-base uppercase text-ink tracking-wide">
                    <span><InlineMarkdown text={section.title} variant="title" /></span>
                    <a
                      href={`#${section.id}`}
                      className="opacity-0 group-hover:opacity-100 text-ink-dim hover:text-rust-orange transition-opacity"
                      aria-label={`Link to ${section.title}`}
                    >
                      <Hash className="h-3.5 w-3.5" />
                    </a>
                  </h2>

                  <div className="text-stone-200">
                    <MarkdownBody>{section.content}</MarkdownBody>
                  </div>

                  {section.codeSnippet && (
                    <CodeBlock
                      code={section.codeSnippet.code}
                      language="rust"
                      caption={section.codeSnippet.caption}
                      snippetId={section.id}
                      executable={section.codeSnippet.runnable !== false}
                    />
                  )}
                </section>
              ))}
            </div>

            {/* Common Mistakes & Compiler Gotchas */}
            {currentLesson.commonMistakes.length > 0 && (
              <section id="mistakes" className="space-y-6 pt-6 border-t-2 border-night-edge scroll-mt-20">
                <div className="flex items-center gap-2 font-pixel text-xs sm:text-sm uppercase text-redstone">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Common Mistakes & Compiler Gotchas</span>
                </div>

                <div className="space-y-6">
                  {currentLesson.commonMistakes.map((mistake, idx) => (
                    <div
                      key={idx}
                      className="pixel-ui border-4 border-black/60 bg-night-panel p-5 space-y-4 shadow-pixel"
                    >
                      <h3 className="font-pixel text-[11px] uppercase text-ink">
                        {idx + 1}. <InlineMarkdown text={mistake.title} variant="title" />
                      </h3>

                      <div className="space-y-4">
                        {/* Bad Approach (Full Width) */}
                        <div className="border-3 border-redstone bg-redstone/10 p-4 space-y-2.5 shadow-pixel">
                          <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase tracking-wider text-redstone">
                            <XCircle className="h-3.5 w-3.5 text-redstone" />
                            <span>Common Mistake (Compile Error / Anti-Pattern)</span>
                          </div>
                          <CodeBlock code={mistake.badCode} language="rust" snippetId={`mistake_bad_${currentLesson.id}_${idx}`} />
                          <div className="text-xs text-redstone/90 font-sans leading-relaxed">
                            <MarkdownBody>{mistake.badExplanation}</MarkdownBody>
                          </div>
                        </div>

                        {/* Good Approach (Full Width) */}
                        <div className="border-3 border-emerald bg-emerald-950/20 p-4 space-y-2.5 shadow-pixel">
                          <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase tracking-wider text-emerald">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                            <span>Idiomatic Rust Solution</span>
                          </div>
                          <CodeBlock code={mistake.goodCode} language="rust" snippetId={`mistake_good_${currentLesson.id}_${idx}`} />
                          <div className="text-xs text-emerald-300 font-sans leading-relaxed">
                            <MarkdownBody>{mistake.goodExplanation}</MarkdownBody>
                          </div>
                        </div>
                      </div>

                      {mistake.compilerErrorSnippet && (
                        <div className="border-2 border-night-edge bg-night p-3.5 shadow-inner">
                          <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-dim pb-1 border-b border-night-edge/60 mb-2">
                            <Terminal className="h-3 w-3 text-rust-orange" />
                            <span>Compiler Diagnostic (rustc)</span>
                          </div>
                          <pre className="font-code text-xs text-redstone whitespace-pre-wrap overflow-x-auto leading-relaxed">
                            {mistake.compilerErrorSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Takeaways */}
            <section className="pixel-ui border-4 border-black/60 bg-gold/10 p-5 shadow-pixel space-y-3 border-l-gold">
              <div className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-wider text-gold">
                <Lightbulb className="h-4 w-4" />
                <span>Key Takeaways</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base leading-relaxed text-ink/90 font-sans">
                {currentLesson.keyTakeaways.map((item, idx) => (
                  <li key={idx}>
                    <MarkdownBody>{item}</MarkdownBody>
                  </li>
                ))}
              </ul>
            </section>

            {/* Interactive Quests & Code Execution Bench */}
            <section id="quests" className="space-y-6 pt-6 border-t-2 border-night-edge scroll-mt-20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-pixel text-xs sm:text-sm uppercase text-ink">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span>Interactive Practice Quests ({currentLesson.quests.length})</span>
                </div>
                <span className="font-code text-xs text-ink-dim">
                  Run directly in the microVM judge to test your skills
                </span>
              </div>

              <div className="space-y-6">
                {currentLesson.quests.map((quest) => {
                  if (quest.type === 'coding') {
                    return <TutorialQuestRunner key={quest.id} quest={quest} />
                  }
                  return <TutorialQuizCard key={quest.id} quest={quest} />
                })}
              </div>
            </section>

            {tutorialMarkdownPath ? (
              <div className="flex justify-end pt-6 pb-2">
                <EditOnGitHub filePath={tutorialMarkdownPath} />
              </div>
            ) : null}

            {/* Next / Previous Chapter Navigation Cards */}
            <nav
              aria-label="Lesson navigation"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-night-edge"
            >
              {prevLesson ? (
                <Link
                  to={`/learn/${prevLesson.id}`}
                  className="pixel-ui group flex flex-col justify-between border-4 border-black/60 bg-night-panel p-4 sm:p-5 transition-all hover:border-rust-orange hover:bg-night-raised shadow-pixel"
                >
                  <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-dim group-hover:text-rust-orange transition-colors">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous Lesson</span>
                  </div>
                  <div className="mt-2 font-pixel text-xs uppercase text-ink group-hover:text-rust-orange transition-colors truncate">
                    {prevLesson.chapterNumber}.{prevLesson.lessonNumber} <InlineMarkdown text={prevLesson.title} variant="title" />
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  to={`/learn/${nextLesson.id}`}
                  className="pixel-ui group flex flex-col justify-between border-4 border-black/60 bg-night-panel p-4 sm:p-5 transition-all hover:border-rust-orange hover:bg-night-raised text-right sm:text-right shadow-pixel"
                >
                  <div className="flex items-center justify-end gap-1.5 font-pixel text-[9px] uppercase text-ink-dim group-hover:text-rust-orange transition-colors">
                    <span>Next Lesson</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="mt-2 font-pixel text-xs uppercase text-ink group-hover:text-rust-orange transition-colors truncate">
                    {nextLesson.chapterNumber}.{nextLesson.lessonNumber} <InlineMarkdown text={nextLesson.title} variant="title" />
                  </div>
                </Link>
              ) : (
                <Link
                  to="/category/interactive"
                  className="pixel-ui group flex flex-col justify-between border-4 border-black/60 bg-gold/15 p-4 sm:p-5 transition-all hover:bg-gold/25 text-right shadow-pixel"
                >
                  <div className="flex items-center justify-end gap-1.5 font-pixel text-[9px] uppercase text-gold">
                    <span>Tutorial Completed!</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="mt-2 font-pixel text-xs uppercase text-gold">
                    Enter Forge Trials →
                  </div>
                </Link>
              )}
            </nav>
          </article>
        </main>

        {/* Right Sidebar: "On this page" TOC */}
        <aside className="hidden xl:block w-64 shrink-0 px-6 py-12 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <OnThisPageToc lesson={currentLesson} />
        </aside>
      </div>
    </div>
  )
}
