import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useProgressStore } from '../store/progressStore'
import { useAuth } from '../context/AuthContext'
import { PixelButton } from './ui/PixelButton'
import { AuthButton } from './AuthButton'
import { AuthModal } from './AuthModal'
import { StreakIcon } from './StreakIcon'
import { RankUpModal } from './RankUpModal'
import { ChevronDown, BookOpen, Users, Dices, Swords, Plus, Menu, X, Trophy, Swords as ContestIcon, Code2, Mail, Terminal, Sparkles, MessageSquare, Bot, FileCode } from 'lucide-react'
import { createRival } from '../lib/rivals'
import { ZULIP_COMMUNITY_URL, DISCORD_BOT_INVITE_URL } from '../lib/constants'


const navBtn = 'shrink-0 !h-[42px] !border-3 !px-3 !py-2.5 text-[11px] leading-none'

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const loadUserProgress = useProgressStore((s) => s.loadUserProgress)
  const [questsOpen, setQuestsOpen] = useState(false)
  const [platformOpen, setPlatformOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [creatingRival, setCreatingRival] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const platformRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) loadUserProgress()
  }, [user, loadUserProgress])

  
  useEffect(() => {
    setQuestsOpen(false)
    setPlatformOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!questsOpen && !platformOpen && !mobileMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (questsOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setQuestsOpen(false)
      }
      if (platformOpen && platformRef.current && !platformRef.current.contains(target)) {
        setPlatformOpen(false)
      }
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        
        const isMenuToggle = (target as HTMLElement).closest?.('[data-menu-toggle]')
        if (!isMenuToggle) {
          setMobileMenuOpen(false)
        }
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuestsOpen(false)
        setPlatformOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [questsOpen, platformOpen, mobileMenuOpen])

  const handleRivalChallenge = async () => {
    if (!user) {
      setQuestsOpen(false)
      setMobileMenuOpen(false)
      setShowAuthModal(true)
      return
    }
    if (creatingRival) return
    setCreatingRival(true)
    try {
      const res = await createRival()
      setQuestsOpen(false)
      setMobileMenuOpen(false)
      if (res.rival?.id) {
        navigate(`/rival/${res.rival.id}`)
      }
    } finally {
      setCreatingRival(false)
    }
  }

  const isQuestsActive =
    pathname === '/quests' ||
    pathname === '/daily' ||
    pathname.startsWith('/category') ||
    pathname === '/community' ||
    pathname === '/fated-five' ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/rival')

  const isPlatformActive =
    pathname.startsWith('/contest') ||
    pathname === '/developer' ||
    pathname === '/contact'

  return (
    <>
      <header className="pixel-ui mb-6 border-4 border-black/60 bg-night-panel shadow-pixel">
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between gap-2 px-2.5 py-2 sm:px-3"
        >
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 bg-night-panel pr-1 font-pixel text-xs uppercase tracking-[0.02em] text-ink hover:text-rust-orange sm:text-sm"
          >
            CRATERY
          </Link>

          {/* Desktop Nav Items (md and above) */}
          <div className="hidden md:flex md:min-w-0 md:items-center md:gap-2">
            <div className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-visible">
              {/* Quests Dropdown */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setQuestsOpen((prev) => !prev)}
                  className={`pixel-ui flex !h-[42px] items-center gap-1 border-3 px-3 py-2.5 font-pixel text-[11px] uppercase tracking-wider shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-pixel-lg active:translate-y-0.5 ${
                    isQuestsActive || questsOpen
                      ? 'border-rust-orange bg-rust-orange/15 text-rust-orange'
                      : 'border-night-edge bg-night-raised text-ink hover:border-ink-faint'
                  }`}
                  aria-expanded={questsOpen}
                  aria-haspopup="true"
                >
                  <span>Quests</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-150 ${
                      questsOpen ? 'rotate-180 text-rust-orange' : 'text-ink-dim'
                    }`}
                  />
                </button>

                {questsOpen && (
                  <div className="pixel-ui absolute left-0 top-[48px] z-50 min-w-[210px] border-4 border-black/80 bg-night-panel p-1.5 shadow-pixel-lg animate-in fade-in zoom-in-95 duration-100">
                    <Link
                      to="/daily"
                      onClick={() => setQuestsOpen(false)}
                      className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname === '/daily'
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Sparkles className="h-4 w-4 shrink-0 text-rust-orange" />
                      <div>
                        <div className="flex items-center gap-1.5 font-pixel text-[10px] uppercase text-rust-orange">
                          <span>Daily</span>
                          <span className="border border-gold/70 bg-gold/15 px-1 py-0.2 text-[8px] text-gold">+20 XP</span>
                        </div>
                        <div className="font-code text-[11px] text-ink-dim">Today's Rust Quest</div>
                      </div>
                    </Link>

                    <Link
                      to="/quests"
                      onClick={() => setQuestsOpen(false)}
                      className={`mt-1 flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname === '/quests' || (pathname.startsWith('/category') && pathname !== '/category/interactive')
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <BookOpen className="h-4 w-4 shrink-0 text-rust-orange" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase">Official Quests</div>
                        <div className="font-code text-[11px] text-ink-dim">Core & Deep Rust</div>
                      </div>
                    </Link>

                    <Link
                      to="/category/interactive"
                      onClick={() => setQuestsOpen(false)}
                      className={`mt-1 flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname === '/category/interactive'
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Terminal className="h-4 w-4 shrink-0 text-gold" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase text-gold">Forge Trials</div>
                        <div className="font-code text-[11px] text-ink-dim">Interactive Code Quests</div>
                      </div>
                    </Link>

                    <Link
                      to="/community"
                      onClick={() => setQuestsOpen(false)}
                      className={`mt-1 flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname === '/community'
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Users className="h-4 w-4 shrink-0 text-diamond" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase">Community</div>
                        <div className="font-code text-[11px] text-ink-dim">Community Created</div>
                      </div>
                    </Link>

                    <Link
                      to="/fated-five"
                      onClick={() => setQuestsOpen(false)}
                      className={`mt-1 flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname === '/fated-five'
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Dices className="h-4 w-4 shrink-0 text-emerald" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase">Practice 5 (P5)</div>
                        <div className="font-code text-[11px] text-ink-dim">Random 5 Unsolved</div>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => void handleRivalChallenge()}
                      disabled={creatingRival}
                      className={`mt-1 flex w-full items-center gap-2.5 border-2 p-2.5 text-left transition-colors ${
                        pathname.startsWith('/rival')
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Swords className="h-4 w-4 shrink-0 text-heart" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase">
                          {creatingRival ? 'Creating…' : 'Rival 1v1'}
                        </div>
                        <div className="font-code text-[11px] text-ink-dim">Challenge a Friend</div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-night-edge" />

                    <Link
                      to="/create"
                      onClick={() => setQuestsOpen(false)}
                      className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname.startsWith('/create')
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Plus className="h-4 w-4 shrink-0 text-gold" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase text-gold">Create</div>
                        <div className="font-code text-[11px] text-ink-dim">Create a New Quest</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Learn / Tutorial Link */}
              <Link to="/learn" className="shrink-0">
                <PixelButton
                  size="sm"
                  variant={pathname.startsWith('/learn') || pathname.startsWith('/tutorial') ? 'primary' : 'secondary'}
                  className={`${navBtn} inline-flex items-center gap-1.5`}
                  title="Interactive Step-by-Step Rust Tutorial Docs"
                >
                  <BookOpen className="h-3.5 w-3.5 text-rust-orange" />
                  <span>Learn</span>
                </PixelButton>
              </Link>

              {/* Notes Button */}
              <Link to="/notes" className="shrink-0">
                <PixelButton
                  size="sm"
                  variant={pathname.startsWith('/notes') || pathname.startsWith('/note') ? 'primary' : 'secondary'}
                  className={navBtn}
                  title="Rust Notes & Notebooks"
                >
                  Notes
                </PixelButton>
              </Link>

              {pathname !== '/leaderboard' ? (
                <Link to="/leaderboard" className="shrink-0">
                  <PixelButton size="sm" variant="secondary" className={navBtn}>
                    Ranks
                  </PixelButton>
                </Link>
              ) : null}

              {/* Platform Dropdown (Contests + Supporter + Developer API + Contact) */}
              <div className="relative shrink-0" ref={platformRef}>
                <button
                  type="button"
                  onClick={() => setPlatformOpen((prev) => !prev)}
                  className={`pixel-ui flex !h-[42px] items-center gap-1 border-3 px-3 py-2.5 font-pixel text-[11px] uppercase tracking-wider shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-pixel-lg active:translate-y-0.5 ${
                    isPlatformActive || platformOpen
                      ? 'border-rust-orange bg-rust-orange/15 text-rust-orange'
                      : 'border-night-edge bg-night-raised text-ink hover:border-ink-faint'
                  }`}
                  aria-expanded={platformOpen}
                  aria-haspopup="true"
                >
                  <span>Platform</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-150 ${
                      platformOpen ? 'rotate-180 text-rust-orange' : 'text-ink-dim'
                    }`}
                  />
                </button>

                {platformOpen && (
                  <div className="pixel-ui absolute right-0 top-[48px] z-50 min-w-[230px] border-4 border-black/80 bg-night-panel p-1.5 shadow-pixel-lg animate-in fade-in zoom-in-95 duration-100">
                    <Link
                      to="/contest"
                      onClick={() => setPlatformOpen(false)}
                      className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname.startsWith('/contest')
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <ContestIcon className="h-4 w-4 shrink-0 text-rust-orange" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase text-rust-orange">Contests & Arena</div>
                        <div className="font-code text-[11px] text-ink-dim">Competitive Weekly & Practice</div>
                      </div>
                    </Link>

                    <Link
                      to="/developer"
                      onClick={() => setPlatformOpen(false)}
                      className={`mt-1 flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname === '/developer'
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Code2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase text-emerald-400">Developer API</div>
                        <div className="font-code text-[11px] text-ink-dim">Isolated Sandbox & Keys</div>
                      </div>
                    </Link>

                    <a
                      href="https://cratera.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setPlatformOpen(false)}
                      className="mt-1 flex items-center gap-2.5 border-2 border-emerald-500/40 bg-emerald-500/10 p-2.5 text-ink transition-colors hover:border-emerald-500 hover:bg-emerald-500/20"
                    >
                      <Terminal className="h-4 w-4 shrink-0 text-emerald-400" />
                      <div>
                        <div className="flex items-center gap-1.5 font-pixel text-[10px] uppercase text-emerald-400">
                          <span>Cratera Engine</span>
                          <span className="border border-emerald-500/70 bg-emerald-500/20 px-1 py-0.2 text-[8px]">Open Source</span>
                        </div>
                        <div className="font-code text-[11px] text-ink-dim">Hardware microVM Runner · Live Demo</div>
                      </div>
                    </a>

                    <a
                      href={ZULIP_COMMUNITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setPlatformOpen(false)}
                      className="mt-1 flex items-center gap-2.5 border-2 border-transparent p-2.5 text-ink transition-colors hover:border-[#5063f0]/60 hover:bg-[#5063f0]/10"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-[#5063f0]" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase text-[#5063f0]">Zulip Community</div>
                        <div className="font-code text-[11px] text-ink-dim">Connect with Rustaceans</div>
                      </div>
                    </a>

                    <a
                      href={DISCORD_BOT_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setPlatformOpen(false)}
                      className="mt-1 flex items-center gap-2.5 border-2 border-transparent p-2.5 text-ink transition-colors hover:border-[#5865F2]/60 hover:bg-[#5865F2]/10"
                    >
                      <Bot className="h-4 w-4 shrink-0 text-[#5865F2]" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase text-[#5865F2]">Add Discord Bot</div>
                        <div className="font-code text-[11px] text-ink-dim">Quizzes & Code in Discord</div>
                      </div>
                    </a>

                    <Link
                      to="/contact"
                      onClick={() => setPlatformOpen(false)}
                      className={`mt-1 flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                        pathname === '/contact'
                          ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                          : 'border-transparent hover:border-night-edge hover:bg-night-raised text-ink'
                      }`}
                    >
                      <Mail className="h-4 w-4 shrink-0 text-rust-orange" />
                      <div>
                        <div className="font-pixel text-[10px] uppercase text-rust-orange">Contact</div>
                        <div className="font-code text-[11px] text-ink-dim">Support & Inquiries</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <StreakIcon />
              <AuthButton />
            </div>
          </div>

          {/* Mobile Right Controls (< md) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <StreakIcon />
            <AuthButton />
            <button
              type="button"
              data-menu-toggle="true"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`pixel-ui flex !h-[42px] !w-[42px] items-center justify-center border-3 font-pixel text-sm shadow-pixel transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-pixel-lg active:translate-y-0.5 ${
                mobileMenuOpen
                  ? 'border-rust-orange bg-rust-orange/15 text-rust-orange'
                  : 'border-night-edge bg-night-raised text-ink hover:border-ink-faint'
              }`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="border-t-4 border-black/60 bg-night-panel p-3 space-y-3 md:hidden animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {/* Top Cards: Supporter & Learn */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                to="/notes"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between border-3 p-3 shadow-pixel transition-colors ${
                  pathname.startsWith('/notes') || pathname.startsWith('/note')
                    ? 'border-rust-orange bg-rust-orange/20 text-rust-orange'
                    : 'border-night-edge bg-night-raised hover:border-rust-orange text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCode className="h-4 w-4 text-diamond shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5 font-pixel text-[11px] uppercase text-diamond">
                      <span>Notes</span>
                      <span className="border border-diamond/70 bg-diamond/15 px-1 py-0.2 text-[8px]">New</span>
                    </div>
                    <div className="font-code text-xs text-ink-dim">Colab Notebooks for Rust</div>
                  </div>
                </div>
                <span className="font-pixel text-[10px] text-diamond">→</span>
              </Link>

              <Link
                to="/learn"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between border-3 p-3 shadow-pixel transition-colors ${
                  pathname.startsWith('/learn') || pathname.startsWith('/tutorial')
                    ? 'border-rust-orange bg-rust-orange/20 text-rust-orange'
                    : 'border-night-edge bg-night-raised hover:border-rust-orange text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-rust-orange shrink-0" />
                  <div>
                    <div className="font-pixel text-[11px] uppercase text-rust-orange">Learn (Rust Docs)</div>
                    <div className="font-code text-xs text-ink-dim">Interactive Step-by-Step Docs</div>
                  </div>
                </div>
                <span className="font-pixel text-[10px] text-rust-orange">→</span>
              </Link>
            </div>

            {/* Quests Section */}
            <div className="space-y-1.5">
              <div className="font-pixel text-[9px] uppercase tracking-wider text-ink-faint px-1">
                Quests & Challenges
              </div>

              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                <Link
                  to="/daily"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors sm:col-span-2 ${
                    pathname === '/daily'
                      ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                      : 'border-rust-orange/40 bg-rust-orange/10 hover:border-rust-orange text-ink'
                  }`}
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-rust-orange" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-pixel text-[10px] uppercase text-rust-orange">
                      <span>Daily</span>
                      <span className="border border-gold/70 bg-gold/15 px-1 py-0.2 text-[8px] text-gold">+20 XP</span>
                    </div>
                    <div className="font-code text-[11px] text-ink-dim">Today's Rust Quest (Synced with Discord)</div>
                  </div>
                </Link>

                <Link
                  to="/quests"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                    pathname === '/quests' || (pathname.startsWith('/category') && pathname !== '/category/interactive')
                      ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                      : 'border-night-edge bg-night-raised hover:border-ink-faint text-ink'
                  }`}
                >
                  <BookOpen className="h-4 w-4 shrink-0 text-rust-orange" />
                  <div>
                    <div className="font-pixel text-[10px] uppercase">Official Quests</div>
                    <div className="font-code text-[11px] text-ink-dim">Core & Deep Rust Quizzes</div>
                  </div>
                </Link>

                <Link
                  to="/category/interactive"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                    pathname === '/category/interactive'
                      ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                      : 'border-night-edge bg-night-raised hover:border-ink-faint text-ink'
                  }`}
                >
                  <Terminal className="h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <div className="font-pixel text-[10px] uppercase text-gold">Forge Trials</div>
                    <div className="font-code text-[11px] text-ink-dim">Interactive Code Quests</div>
                  </div>
                </Link>

                <Link
                  to="/community"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                    pathname === '/community'
                      ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                      : 'border-night-edge bg-night-raised hover:border-ink-faint text-ink'
                  }`}
                >
                  <Users className="h-4 w-4 shrink-0 text-diamond" />
                  <div>
                    <div className="font-pixel text-[10px] uppercase">Community Quests</div>
                    <div className="font-code text-[11px] text-ink-dim">Player-Created Quests</div>
                  </div>
                </Link>

                <Link
                  to="/fated-five"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                    pathname === '/fated-five'
                      ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                      : 'border-night-edge bg-night-raised hover:border-ink-faint text-ink'
                  }`}
                >
                  <Dices className="h-4 w-4 shrink-0 text-emerald" />
                  <div>
                    <div className="font-pixel text-[10px] uppercase">Practice 5 (P5)</div>
                    <div className="font-code text-[11px] text-ink-dim">5 Random Unsolved Quests</div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => void handleRivalChallenge()}
                  disabled={creatingRival}
                  className={`flex w-full items-center gap-2.5 border-2 p-2.5 text-left transition-colors ${
                    pathname.startsWith('/rival')
                      ? 'border-rust-orange/60 bg-rust-orange/15 text-rust-orange'
                      : 'border-night-edge bg-night-raised hover:border-ink-faint text-ink'
                  }`}
                >
                  <Swords className="h-4 w-4 shrink-0 text-heart" />
                  <div>
                    <div className="font-pixel text-[10px] uppercase">
                      {creatingRival ? 'Creating…' : 'Rival 1v1'}
                    </div>
                    <div className="font-code text-[11px] text-ink-dim">Challenge a Friend</div>
                  </div>
                </button>

                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 border-2 p-2.5 transition-colors ${
                    pathname.startsWith('/create')
                      ? 'border-gold/60 bg-gold/15 text-gold'
                      : 'border-night-edge bg-night-raised hover:border-ink-faint text-ink'
                  }`}
                >
                  <Plus className="h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <div className="font-pixel text-[10px] uppercase text-gold">+ Create a Quest</div>
                    <div className="font-code text-[11px] text-ink-dim">Author MCQ or Coding challenges</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-night-edge sm:grid-cols-4">
              <Link
                to="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-1.5 border-2 py-2 px-2 font-pixel text-[9px] uppercase transition-colors ${
                  pathname === '/leaderboard'
                    ? 'border-rust-orange bg-rust-orange/15 text-rust-orange'
                    : 'border-night-edge bg-night-raised text-ink hover:border-ink-faint'
                }`}
              >
                <Trophy className="h-3.5 w-3.5 text-gold" />
                <span>Ranks</span>
              </Link>

              <Link
                to="/contest"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-1.5 border-2 py-2 px-2 font-pixel text-[9px] uppercase transition-colors ${
                  pathname.startsWith('/contest')
                    ? 'border-rust-orange bg-rust-orange/15 text-rust-orange'
                    : 'border-night-edge bg-night-raised text-ink hover:border-ink-faint'
                }`}
              >
                <ContestIcon className="h-3.5 w-3.5 text-rust-orange" />
                <span>Contests</span>
              </Link>

              <Link
                to="/developer"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-1.5 border-2 py-2 px-2 font-pixel text-[9px] uppercase transition-colors ${
                  pathname === '/developer'
                    ? 'border-rust-orange bg-rust-orange/15 text-rust-orange'
                    : 'border-night-edge bg-night-raised text-ink hover:border-ink-faint'
                }`}
              >
                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>API</span>
              </Link>

              <a
                href={ZULIP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 border-2 border-[#5063f0]/40 bg-[#5063f0]/10 py-2 px-2 font-pixel text-[9px] uppercase text-[#5063f0] hover:border-[#5063f0]"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Zulip</span>
              </a>

              <a
                href="https://cratera.org"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 border-2 border-emerald-500/40 bg-emerald-500/10 py-2 px-2 font-pixel text-[9px] uppercase text-emerald-400 hover:border-emerald-500"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Cratera ↗</span>
              </a>

              <a
                href={DISCORD_BOT_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 border-2 border-[#5865F2]/40 bg-[#5865F2]/10 py-2 px-2 font-pixel text-[9px] uppercase text-[#5865F2] hover:border-[#5865F2]"
              >
                <Bot className="h-3.5 w-3.5" />
                <span>+ Bot</span>
              </a>
            </div>
          </div>
        )}
      </header>
      <RankUpModal />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}


