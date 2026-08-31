import { Link } from 'react-router-dom'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'

export function NotFoundPage() {
  return (
    <PixelPanel title="404">
      <SEO title="Page Not Found" noIndex />
      <div className="font-code text-lg text-ink-dim">This area is still loading chunks…</div>
      <div className="mt-4">
        <Link to="/">
          <PixelButton>Return Home</PixelButton>
        </Link>
      </div>
    </PixelPanel>
  )
}
