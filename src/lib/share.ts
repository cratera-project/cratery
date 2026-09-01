
export const SITE_URL =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://cratery.cratera.org'

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${path}`
}


export function currentShareUrl(pathname: string = window.location.pathname): string {
  return absoluteUrl(pathname)
}

export function profileOgImageUrl(username: string, version?: string): string {
  const q = version ? `?v=${encodeURIComponent(version)}` : ''
  return `${SITE_URL}/api/og/${encodeURIComponent(username)}.png${q}`
}

export function profileBadgeSvgUrl(username: string): string {
  return `${SITE_URL}/api/badge/${encodeURIComponent(username)}.svg`
}

export function githubReadmeMarkdown(username: string): string {
  return `[![Cratery Profile](${profileBadgeSvgUrl(username)})](${profileShareUrl(username)})`
}

export function githubReadmeHtml(username: string): string {
  return `<a href="${profileShareUrl(username)}"><img src="${profileBadgeSvgUrl(username)}" alt="${username}'s Cratery Profile" /></a>`
}

export function profileShareUrl(username: string): string {
  return absoluteUrl(`/${username}`)
}

export function rivalShareUrl(id: string): string {
  return absoluteUrl(`/rival/${id}`)
}

export function fatedFiveShareText(options: { correct: number; total: number; emojis: string }): string {
  return `Cratery Practice 5 ⚡ ${options.correct}/${options.total}\n${options.emojis}\n\n${SITE_URL}/fated-five`
}

export function contestBenchmarkShareText(options: {
  title: string
  url: string
  runMs?: string
  memoryKb?: string
  percentile?: number
}): string {
  const metrics: string[] = []
  if (options.runMs) metrics.push(`⏱️ ${options.runMs}`)
  if (options.memoryKb) metrics.push(`💾 ${options.memoryKb}`)
  if (typeof options.percentile === 'number' && options.percentile > 0) {
    metrics.push(`⚡ Beats ${options.percentile}%`)
  }
  const metricStr = metrics.length ? ` (${metrics.join(' · ')})` : ''
  return `Cratery Rust Challenge ⚡ ${options.title} AC ✓${metricStr}\n\n${options.url}`
}

export function xIntentUrl(url: string, text: string): string {
  const u = new URL('https://x.com/intent/post')
  u.searchParams.set('text', text)
  u.searchParams.set('url', url)
  return u.href
}

export function linkedInShareUrl(url: string): string {
  const u = new URL('https://www.linkedin.com/sharing/share-offsite/')
  u.searchParams.set('url', url)
  return u.href
}

function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const hostname = window.location.hostname
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
}

export async function copyText(text: string): Promise<boolean> {
  if (typeof window !== 'undefined' && isLocalhost()) {
    // uBlock Origin can false-positive programmatic clipboard writes on localhost as a
    // ClickFix-style attack. Keep the normal Clipboard API for production, but on local
    // development we prefer an explicit selection so the user can copy by hand without
    // triggering the extension's heuristic.
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.top = '-9999px'
      textarea.style.left = '-9999px'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      window.setTimeout(() => textarea.remove(), 250)
    }
    return false
  }

  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function canNativeShare(data: ShareData): boolean {
  try {
    return typeof navigator.share === 'function' && (navigator.canShare?.(data) ?? true)
  } catch {
    return false
  }
}
