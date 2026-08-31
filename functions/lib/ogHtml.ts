import { rankForXp } from '../../src/lib/ranks'
import { isReservedUsername } from '../../src/lib/reserved'
import { loadPublicProfile, ogCacheKey } from './profileData'
import type { Env } from './supabase'

const SITE = 'https://cratery.cratera.org'

function setContent(selector: string, content: string) {
    return {
        element(el: Element) {
            el.setAttribute('content', content)
        },
    }
}

export function profileUsernameFromPath(path: string): string | null {
    const m = path.match(/^\/([a-zA-Z0-9_]{3,20})\/?$/)
    if (!m) return null
    const name = m[1]!
    if (isReservedUsername(name)) return null
    return name
}

export async function injectProfileOg(
    request: Request,
    env: Env & { ASSETS?: { fetch: (request: Request) => Promise<Response> } },
    username: string
): Promise<Response> {
    if (!env.ASSETS) return new Response('Not Found', { status: 404 })
    const assets = env.ASSETS
    const [asset, profile] = await Promise.all([assets.fetch(request), loadPublicProfile(env, username)])
    if (!profile) return asset

    const rank = rankForXp(profile.stats.total_xp)
    const title = `${profile.username} · ${rank.name} · ${profile.stats.total_xp} XP | Cratery`
    const description = `${profile.username} is a ${rank.name} on Cratery with ${profile.stats.total_xp} XP, ${profile.stats.quests_authored} authored quests, and ${profile.stats.solves_taught} rustaceans taught.`
    const canonical = `${SITE}/${profile.username}`
    const image = `${SITE}/api/og/${encodeURIComponent(profile.username)}.png?v=${encodeURIComponent(ogCacheKey(profile))}`

    return new HTMLRewriter()
        .on('title', {
            element(el) {
                el.setInnerContent(title)
            },
        })
        .on('meta[name="description"]', setContent('description', description))
        .on('link[rel="canonical"]', {
            element(el) {
                el.setAttribute('href', canonical)
            },
        })
        .on('meta[property="og:title"]', setContent('og:title', title))
        .on('meta[property="og:description"]', setContent('og:description', description))
        .on('meta[property="og:url"]', setContent('og:url', canonical))
        .on('meta[property="og:image"]', setContent('og:image', image))
        .on('meta[property="og:image:secure_url"]', setContent('og:image:secure_url', image))
        .on('meta[property="og:image:alt"]', setContent('og:image:alt', title))
        .on('meta[name="twitter:title"]', setContent('twitter:title', title))
        .on('meta[name="twitter:description"]', setContent('twitter:description', description))
        .on('meta[name="twitter:image"]', setContent('twitter:image', image))
        .transform(asset)
}

export async function handleOgImage(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const fromPath = url.pathname.match(/^\/api\/og\/([a-zA-Z0-9_]{3,20})(?:\.png|\.svg)?$/i)
    const username = (fromPath?.[1] || url.searchParams.get('username') || '').trim()
    if (!username || isReservedUsername(username)) {
        return new Response('Not found', { status: 404 })
    }

    const profile = await loadPublicProfile(env, username)
    if (!profile) return new Response('Not found', { status: 404 })

    const rank = rankForXp(profile.stats.total_xp)
    const xpFormatted = profile.stats.total_xp.toLocaleString()
    const taught = profile.stats.solves_taught
    const authored = profile.stats.quests_authored
    const wl = `${profile.stats.rival_wins}–${profile.stats.rival_losses}`

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <defs>
    <style>
      .user { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 42px; font-weight: 900; text-transform: uppercase; fill: #f3f4f6; letter-spacing: 1px; }
      .rank { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 20px; font-weight: 700; fill: #ce422b; text-transform: uppercase; }
      .xp { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 32px; font-weight: 800; fill: #fbbf24; }
      .sub { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace, sans-serif; font-size: 18px; font-weight: 600; fill: #9ca3af; letter-spacing: 1px; }
      .brand { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace, sans-serif; font-size: 22px; font-weight: 800; fill: #ce422b; letter-spacing: 2px; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="#16171b"/>
  <rect x="64" y="64" width="1072" height="502" rx="12" fill="#1f2126" stroke="#3a3e47" stroke-width="4"/>
  <rect x="64" y="64" width="1072" height="16" fill="#ce422b"/>
  <text x="120" y="180" class="user">${xmlEscape(profile.username)}</text>
  <rect x="120" y="208" width="${rank.name.length * 14 + 32}" height="42" rx="6" fill="#ce422b22" stroke="#ce422b" stroke-width="2"/>
  <text x="136" y="237" class="rank">${xmlEscape(rank.name)}</text>
  <text x="120" y="320" class="xp">${xpFormatted} XP</text>
  <text x="120" y="380" class="sub">${authored} QUESTS AUTHORED · ${taught} TAUGHT · ${wl} VS RIVALS</text>
  <text x="120" y="520" class="brand">CRATERY.CRATERA.ORG</text>
</svg>`

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=120, s-maxage=600',
        },
    })
}

function xmlEscape(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

export async function handleProfileBadgeSvg(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const fromPath = url.pathname.match(/^\/api\/badge\/([a-zA-Z0-9_]{3,20})(?:\.svg)?$/i)
    const username = (fromPath?.[1] || url.searchParams.get('username') || '').trim()
    if (!username || isReservedUsername(username)) {
        return new Response('Not found', { status: 404 })
    }

    const profile = await loadPublicProfile(env, username)
    if (!profile) return new Response('Not found', { status: 404 })

    const rank = rankForXp(profile.stats.total_xp)
    const accentColor = '#ce422b'
    const rankTitle = rank.name.toUpperCase()
    const xpFormatted = profile.stats.total_xp.toLocaleString()
    const solvesFormatted = (profile.stats.solves_taught || 0).toLocaleString()
    const rival = `${profile.stats.rival_wins}W - ${profile.stats.rival_losses}L`

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="150" viewBox="0 0 440 150" fill="none">
  <defs>
    <style>
      .user { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 15px; font-weight: 800; text-transform: uppercase; fill: #f3f4f6; letter-spacing: 0.5px; }
      .badge-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 10px; font-weight: 700; fill: ${accentColor}; text-transform: uppercase; }
      .stat-lbl { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 9px; font-weight: 700; fill: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
      .stat-val { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 15px; font-weight: 800; }
      .logo { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace, sans-serif; font-size: 9px; font-weight: 800; fill: #ce422b; letter-spacing: 1px; }
    </style>
  </defs>

  <rect x="2" y="2" width="436" height="146" rx="4" fill="#16171b" stroke="#3a3e47" stroke-width="2"/>
  <rect x="2" y="2" width="436" height="6" rx="2" fill="${accentColor}"/>

  <rect x="18" y="22" width="48" height="48" rx="4" fill="#1f2126" stroke="#3a3e47" stroke-width="2"/>
  <text x="42" y="53" text-anchor="middle" font-size="24">🦀</text>

  <text x="76" y="42" class="user">${xmlEscape(profile.username)}</text>
  <rect x="76" y="50" width="${rankTitle.length * 7 + 16}" height="18" rx="2" fill="${accentColor}22" stroke="${accentColor}" stroke-width="1.5"/>
  <text x="84" y="63" class="badge-text">${xmlEscape(rankTitle)}</text>

  <text x="422" y="24" text-anchor="end" class="logo">CRATERY</text>

  <rect x="18" y="84" width="126" height="48" rx="3" fill="#1f2126" stroke="#2d3139" stroke-width="1.5"/>
  <text x="28" y="100" class="stat-lbl">TOTAL XP</text>
  <text x="28" y="121" class="stat-val" fill="#fbbf24">${xpFormatted} XP</text>

  <rect x="156" y="84" width="126" height="48" rx="3" fill="#1f2126" stroke="#2d3139" stroke-width="1.5"/>
  <text x="166" y="100" class="stat-lbl">SOLVES TAUGHT</text>
  <text x="166" y="121" class="stat-val" fill="#34d399">${solvesFormatted}</text>

  <rect x="294" y="84" width="126" height="48" rx="3" fill="#1f2126" stroke="#2d3139" stroke-width="1.5"/>
  <text x="304" y="100" class="stat-lbl">RIVAL W-L</text>
  <text x="304" y="121" class="stat-val" fill="#60a5fa">${rival}</text>
</svg>`

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=120, s-maxage=600',
        },
    })
}
