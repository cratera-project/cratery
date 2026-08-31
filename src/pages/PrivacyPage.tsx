import { PixelPanel } from '../components/ui/PixelPanel'
import { SEO } from '../components/SEO'

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Cratery. How cratera.org collects and uses account data."
      />
      <PixelPanel>
        <h1 className="text-center font-pixel text-2xl uppercase">Privacy Policy</h1>
      </PixelPanel>

      <PixelPanel>
        <div className="space-y-6 font-code text-lg text-ink-dim">
          <p>
            <strong>Last updated: August 13, 2026</strong>
          </p>

          <p>
            This policy explains how cratera.org ("we") handles personal information when you use
            Cratery.
          </p>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">What we collect</h2>
            <p>Username, email, and a hashed password (we never see your plaintext password).</p>
            <p>Quiz answers so progress can sync across devices when you sign in.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Tips</h2>
            <p>
              Optional tips go through Buy Me a Coffee. Payment details are handled by them, not by
              Cratery. See Buy Me a Coffee's privacy policy for that processing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">What we don't do</h2>
            <p>
              We don't sell your data, share it with advertisers, or track you across other sites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">How we use it</h2>
            <p>
              Account login and quiz progress sync. Verified accounts may also get a weekly
              email when a new contest opens. Those announcements are sent by Customer.io;
              unsubscribe with the link in the email.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Local storage</h2>
            <p>
              Progress is stored in your browser so quizzes work offline. No tracking cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-pixel text-base uppercase text-ink">Your rights</h2>
            <p>
              Contact{' '}
              <a href="mailto:contact@cratera.org" className="text-rust-orange hover:underline">
                contact@cratera.org
              </a>{' '}
              to access, correct, or delete your account data.
            </p>
          </section>
        </div>
      </PixelPanel>
    </div>
  )
}
