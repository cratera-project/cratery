import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Code2,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { CONTACT_EMAIL } from '../lib/constants'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)

    const fullSubject = encodeURIComponent(
      subject ? `[${topic.toUpperCase()}] ${subject}` : `[${topic.toUpperCase()}] Contact Inquiry from ${name}`
    )
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Category: ${topic}\n\n` +
      `Message:\n${message}\n`
    )

    
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${fullSubject}&body=${body}`

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 400)
  }

  return (
    <div className="space-y-10">
      <SEO
        title="Contact Cratery: Support, Developer API and Inquiries"
        description="Contact channels for developer API inquiries, community support, and security reports."
      />

      {/* Header */}
      <div className="space-y-3 border-b-2 border-night-edge pb-6">
        <h1 className="font-pixel text-2xl uppercase tracking-wider text-ink sm:text-3xl">
          Contact
        </h1>
        <p className="max-w-2xl font-code text-sm text-ink-dim sm:text-base">
          Developer API inquiries, community support, security reports, and platform inquiries.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* Developer API */}
        <PixelPanel className="p-4 space-y-3 border-2 border-night-edge hover:border-emerald hover:shadow-pixel-lg hover:-translate-y-0.5 transition-all duration-100 ease-linear flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex h-9 w-9 items-center justify-center border border-emerald bg-emerald/15 text-emerald">
              <Code2 className="h-4 w-4" />
            </div>
            <div className="font-pixel text-[11px] uppercase text-ink">Developer API</div>
            <p className="font-code text-xs text-ink-dim">
              Production API key requests, custom rate limit quotas, and sandbox integration support.
            </p>
          </div>
          <div className="pt-2 border-t border-night-edge">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Developer API Inquiry')}`}
              className="font-code text-xs text-emerald hover:underline break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </PixelPanel>

        {/* General Support */}
        <PixelPanel className="p-4 space-y-3 border-2 border-night-edge hover:border-rust-orange hover:shadow-pixel-lg hover:-translate-y-0.5 transition-all duration-100 ease-linear flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex h-9 w-9 items-center justify-center border border-rust-orange bg-rust-orange/15 text-rust-orange">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="font-pixel text-[11px] uppercase text-ink">General Support</div>
            <p className="font-code text-xs text-ink-dim">
              Account assistance, question suggestions, bug reports, and community quest feedback.
            </p>
          </div>
          <div className="pt-2 border-t border-night-edge">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Support Inquiry')}`}
              className="font-code text-xs text-rust-orange hover:underline break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </PixelPanel>

        {/* Security */}
        <PixelPanel className="p-4 space-y-3 border-2 border-night-edge hover:border-redstone hover:shadow-pixel-lg hover:-translate-y-0.5 transition-all duration-100 ease-linear flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex h-9 w-9 items-center justify-center border border-redstone bg-redstone/15 text-redstone">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="font-pixel text-[11px] uppercase text-ink">Security Inquiries</div>
            <p className="font-code text-xs text-ink-dim">
              Responsible vulnerability disclosure and microVM sandbox isolation inquiries.
            </p>
          </div>
          <div className="pt-2 border-t border-night-edge">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Security Vulnerability Report')}`}
              className="font-code text-xs text-redstone hover:underline break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </PixelPanel>
      </div>

      {/* Direct Message Form */}
      <PixelPanel className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-night-edge pb-3">
          <MessageSquare className="h-4 w-4 text-rust-orange" />
          <h2 className="font-pixel text-sm uppercase text-ink">
            Send a Message
          </h2>
        </div>

        {submitted ? (
          <div className="space-y-4 border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
            <h3 className="font-pixel text-sm uppercase text-emerald-300">
              Message Sent
            </h3>
            <p className="font-code text-xs text-ink-dim max-w-md mx-auto">
              Message received. A response will be sent to <strong className="text-ink">{email}</strong> shortly.
            </p>
            <div className="pt-2">
              <PixelButton onClick={() => setSubmitted(false)} size="sm" variant="secondary" className="text-xs">
                Send Another Message
              </PixelButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-code text-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-pixel text-[10px] uppercase text-ink-dim">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full border border-night-edge bg-night px-3 py-2 text-ink outline-none focus:border-rust-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-pixel text-[10px] uppercase text-ink-dim">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full border border-night-edge bg-night px-3 py-2 text-ink outline-none focus:border-rust-orange"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-pixel text-[10px] uppercase text-ink-dim">Inquiry Category</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full border border-night-edge bg-night px-3 py-2 text-ink outline-none focus:border-rust-orange"
                >
                  <option value="general">General Support / Account Issue</option>
                  <option value="api">Developer API & Sandbox Quotas</option>
                  <option value="feedback">Quest Content / Suggestion</option>
                  <option value="security">Security Vulnerability Report</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-pixel text-[10px] uppercase text-ink-dim">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of inquiry..."
                  className="w-full border border-night-edge bg-night px-3 py-2 text-ink outline-none focus:border-rust-orange"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-pixel text-[10px] uppercase text-ink-dim">Message *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Inquiry details..."
                className="w-full border border-night-edge bg-night px-3 py-2 text-ink outline-none focus:border-rust-orange resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <PixelButton type="submit" variant="primary" disabled={loading} className="text-xs">
                {loading ? 'Sending...' : 'Send Message'}
              </PixelButton>
              <Link to="/developer" className="font-code text-xs text-rust-orange hover:underline flex items-center gap-1">
                Explore Developer API <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </form>
        )}
      </PixelPanel>
    </div>
  )
}
