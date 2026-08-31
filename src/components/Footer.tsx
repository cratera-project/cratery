import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

export function Footer() {
  return (
    <footer className="mt-8 border-t-2 border-night-edge pt-5 pb-4 sm:mt-10 sm:pt-6">
      <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
        <div>
          <div className="font-pixel text-[10px] uppercase text-ink">Cratery</div>
          <p className="mt-2 font-code text-base text-ink-dim sm:text-lg">
            Rust quizzes by topic: snippet, answer, learn. Create your own quests and share them.
          </p>
        </div>
        <div>
          <div className="font-pixel text-[9px] uppercase text-ink-faint">Play</div>
          <ul className="mt-2 space-y-1.5 font-code text-base sm:text-lg">
            <li>
              <Link to="/quests" className="text-ink-dim hover:text-rust-orange hover:underline">
                Official quests
              </Link>
            </li>
            <li>
              <Link to="/fated-five" className="text-ink-dim hover:text-rust-orange hover:underline">
                Practice 5
              </Link>
            </li>
            <li>
              <Link to="/community" className="text-ink-dim hover:text-rust-orange hover:underline">
                Community quests
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="text-ink-dim hover:text-rust-orange hover:underline">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/contest" className="text-ink-dim hover:text-rust-orange hover:underline">
                Weekly contest
              </Link>
            </li>
            <li>
              <Link to="/notes" className="text-ink-dim hover:text-diamond hover:underline">
                Interactive Notes
              </Link>
            </li>
            <li>
              <Link to="/create" className="text-ink-dim hover:text-rust-orange hover:underline">
                Create a quest
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-pixel text-[9px] uppercase text-ink-faint">Site</div>
          <ul className="mt-2 space-y-1.5 font-code text-base sm:text-lg">
            <li>
              <Link to="/developer" className="text-ink-dim hover:text-rust-orange hover:underline">
                Developer API
              </Link>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/cratera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-dim hover:text-emerald-400 hover:underline"
              >
                Cratera SDK (npm)
              </a>
            </li>
            <li>
              <a
                href="https://cratera.zulipchat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-dim hover:text-[#5063f0] hover:underline"
              >
                Zulip Community
              </a>
            </li>
            <li>
              <a
                href="https://discord.com/oauth2/authorize?client_id=1540314976839802941&permissions=2147829760&integration_type=0&scope=bot+applications.commands"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-dim hover:text-[#5865F2] hover:underline"
              >
                Add Discord Bot
              </a>
            </li>
            <li>
              <Link to="/contact" className="text-ink-dim hover:text-rust-orange hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/changelog" className="text-ink-dim hover:text-rust-orange hover:underline">
                Changelog
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-ink-dim hover:text-rust-orange hover:underline">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-ink-dim hover:text-rust-orange hover:underline">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-night-edge pt-4">
        <span className="font-code text-base text-ink-faint">
          {categories.length} topics · community quests · free
        </span>
        <span className="font-pixel text-[8px] uppercase text-ink-faint">
          © {new Date().getFullYear()} Cratery
        </span>
      </div>
    </footer>
  )
}
