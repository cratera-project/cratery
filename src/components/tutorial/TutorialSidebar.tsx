import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tutorialChapters } from '../../data/tutorial/curriculum'
import { Search, CheckCircle2, ChevronDown, ChevronRight, X, Terminal } from 'lucide-react'
import { useProgressStore } from '../../store/progressStore'
import { InlineMarkdown } from '../ui/InlineMarkdown'

type Props = {
  currentLessonId?: string
  onSelectLesson?: () => void
  searchFocusSignal?: number
}

export function TutorialSidebar({ currentLessonId, onSelectLesson, searchFocusSignal }: Props) {
  const [search, setSearch] = useState('')
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({})
  const answersByQuestionId = useProgressStore((s) => s.answersByQuestionId)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchFocusSignal && searchFocusSignal > 0) {
      searchInputRef.current?.focus()
    }
  }, [searchFocusSignal])

  const toggleChapter = (chapterId: string) => {
    setCollapsedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }))
  }

  const query = search.trim().toLowerCase()

  const stats = useMemo(() => {
    let totalQuests = 0
    let completedQuests = 0

    tutorialChapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        lesson.quests.forEach((q) => {
          totalQuests++
          if (answersByQuestionId[q.id]?.isCorrect) {
            completedQuests++
          }
        })
      })
    })

    const pct = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0
    return { totalQuests, completedQuests, pct }
  }, [answersByQuestionId])

  return (
    <nav
      aria-label="Table of contents"
      className="pixel-ui flex h-full flex-col bg-night border-r-3 border-night-edge font-sans text-sm select-none"
    >
      {/* Sidebar Top Search & Title */}
      <div className="border-b-2 border-night-edge p-3 space-y-2.5 bg-night-raised">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-rust-orange" />
            <span className="font-pixel text-[10px] uppercase text-ink">
              Rust Tutorial
            </span>
          </div>
          <span className="border border-rust-orange/60 bg-rust-orange/15 px-1.5 py-0.2 font-pixel text-[9px] text-rust-orange">
            {stats.pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full border border-black bg-night overflow-hidden">
          <div
            className="h-full bg-rust-orange transition-all duration-300"
            style={{ width: `${stats.pct}%` }}
          />
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ink-dim" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-night-edge bg-night py-1.5 pl-8 pr-7 font-sans text-xs text-ink placeholder:text-ink-faint focus:border-rust-orange focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-2 p-0.5 text-ink-dim hover:text-ink"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Chapter Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
        {tutorialChapters.map((chapter) => {
          const filteredLessons = query
            ? chapter.lessons.filter(
                (l) =>
                  l.title.toLowerCase().includes(query) ||
                  l.tagline.toLowerCase().includes(query) ||
                  l.tags.some((t) => t.toLowerCase().includes(query))
              )
            : chapter.lessons

          if (filteredLessons.length === 0) return null

          const isCollapsed = !query && Boolean(collapsedChapters[chapter.id])

          const chapterTotalQuests = chapter.lessons.reduce((acc, l) => acc + l.quests.length, 0)
          const chapterDoneQuests = chapter.lessons.reduce(
            (acc, l) =>
              acc + l.quests.filter((q) => answersByQuestionId[q.id]?.isCorrect).length,
            0
          )
          const isChapterComplete =
            chapterTotalQuests > 0 && chapterDoneQuests === chapterTotalQuests

          return (
            <div key={chapter.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                className="group flex w-full items-center justify-between border border-transparent p-1.5 text-left transition-colors hover:border-night-edge hover:bg-night-raised"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-pixel text-[9px] uppercase text-rust-orange">
                    {chapter.number}.
                  </span>
                  <span className="font-pixel text-[9px] uppercase text-ink tracking-tight truncate group-hover:text-rust-orange transition-colors">
                    <InlineMarkdown text={chapter.title} variant="title" />
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 pl-1 text-ink-dim font-pixel text-[8px]">
                  {isChapterComplete ? (
                    <span className="text-emerald font-bold">✓</span>
                  ) : (
                    <span className="text-ink-faint">
                      {chapterDoneQuests}/{chapterTotalQuests}
                    </span>
                  )}
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </button>

              {!isCollapsed && (
                <ul className="pl-2 space-y-0.5 border-l-2 border-night-edge/60 ml-2">
                  {filteredLessons.map((lesson) => {
                    const isActive = currentLessonId === lesson.id
                    const allQuestsDone =
                      lesson.quests.length > 0 &&
                      lesson.quests.every((q) => answersByQuestionId[q.id]?.isCorrect)

                    return (
                      <li key={lesson.id}>
                        <Link
                          to={`/learn/${lesson.id}`}
                          onClick={onSelectLesson}
                          className={`flex items-center justify-between border-2 p-1.5 text-xs transition-all ${
                            isActive
                              ? 'border-rust-orange bg-rust-orange/15 text-rust-orange font-semibold shadow-pixel'
                              : 'border-transparent text-ink-dim hover:border-night-edge hover:bg-night-raised hover:text-ink'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-code text-[11px] opacity-75 shrink-0">
                              {lesson.chapterNumber}.{lesson.lessonNumber}
                            </span>
                            <span className="truncate">
                              <InlineMarkdown text={lesson.title} variant="title" />
                            </span>
                          </div>
                          {allQuestsDone ? (
                            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald ml-1.5" />
                          ) : (
                            <span className="font-code text-[9px] text-ink-faint shrink-0 ml-1.5">
                              {lesson.readTimeMinutes}m
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
