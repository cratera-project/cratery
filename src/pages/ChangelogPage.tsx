import { PixelPanel } from '../components/ui/PixelPanel'
import { SEO } from '../components/SEO'
import { CHANGELOG } from '../data/changelog'

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function ChangelogPage() {
  return (
    <div className="space-y-6">
      <SEO
        title="Changelog"
        description="What shipped on Cratery. Rank cards, rival matches, creator XP, and whatever comes next."
      />

      <PixelPanel>
        <h1 className="font-pixel text-sm uppercase tracking-[0.02em] text-ink">Changelog</h1>
        <p className="mt-3 read-body text-xl text-ink-dim">
          Recorded release and platform updates since 14 Aug 2026.
        </p>
      </PixelPanel>

      {CHANGELOG.map((entry) => (
        <PixelPanel key={entry.date}>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-night-edge pb-2">
            <h2 className="font-pixel text-xs uppercase text-ink">{entry.title}</h2>
            <time dateTime={entry.date} className="font-code text-base text-ink-faint">
              {formatDate(entry.date)}
            </time>
          </div>
          <ul className="space-y-3">
            {entry.items.map((item) => (
              <li key={item} className="read-body text-xl leading-relaxed text-ink-dim">
                {item}
              </li>
            ))}
          </ul>
        </PixelPanel>
      ))}
    </div>
  )
}
