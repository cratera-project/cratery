import { PixelPanel } from '../components/ui/PixelPanel'
import { SEO } from '../components/SEO'

export function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SEO
        title="Terms of Use"
        description="Terms of Use for Cratery, a free Rust quiz site operated by cratera.org."
      />
      <PixelPanel>
        <h1 className="text-center font-pixel text-2xl uppercase">Terms of Use</h1>
      </PixelPanel>

      <PixelPanel>
        <div className="space-y-6 font-code text-lg text-ink-dim">
          <p>
            <strong>Last updated: August 6, 2026</strong>
          </p>

          <p>
            Cratery ("we", "us", "our") is an educational site operated by cratera.org. By using this
            site, you agree to these terms.
          </p>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Service</h2>
            <p>
              Cratery is a free Rust quiz website organized by topic. All quizzes, hints, and
              explanations are free. Optional tips via Buy Me a Coffee help fund hosting and new
              questions; they do not unlock paid learning features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Account data</h2>
            <p>
              Your username, email, and password are used only for authentication and syncing quiz
              progress. We do not sell your data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Tips</h2>
            <p>
              Optional tips are processed by Buy Me a Coffee on their platform under their terms.
              Cratery does not process card payments or store payment details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Content</h2>
            <p>
              Quiz content is for education. Do not scrape or redistribute questions commercially.
              Content is owned by cratera.org.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Usage</h2>
            <p>
              Don't abuse the service or bypass security. We may suspend accounts that violate these
              terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Contact</h2>
            <p>
              Questions?{' '}
              <a href="mailto:contact@cratera.org" className="text-rust-orange hover:underline">
                contact@cratera.org
              </a>
            </p>
          </section>
        </div>
      </PixelPanel>
    </div>
  )
}
