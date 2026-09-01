/**
 * Sitemap generator for Cratery.
 *
 * Adheres to standard Sitemaps.org / search engine best practices:
 * - Uses actual last modification dates derived from git commit history
 *   (`git log -1 --format=%cs <file>`) so unchanged pages preserve their date across builds.
 * - Falls back to existing public/sitemap.xml entries if git is not available (e.g. shallow CI).
 * - Avoids changing lastmod timestamps on pages whose source code has not changed.
 *
 * Usage: node scripts/generate-sitemap.js
 * Output: public/sitemap.xml
 */

import { execFileSync } from 'child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { QUESTION_CATEGORIES } from './lib/questionCategories.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const outputPath = resolve(rootDir, 'public', 'sitemap.xml')
const SITE_URL = 'https://cratery.cratera.org'
const TODAY = new Date().toISOString().split('T')[0]

const isCI = Boolean(
  process.env.CI ||
  process.env.CF_PAGES ||
  process.env.GITHUB_ACTIONS
)
const isProd = process.env.NODE_ENV === 'production'
const isForced =
  process.argv.includes('--force') ||
  process.env.GENERATE_SITEMAP === '1' ||
  process.env.GENERATE_SITEMAP === 'true'

if (!isCI && !isProd && !isForced) {
  console.log('ℹ Skipping sitemap generation for local build (run "npm run sitemap" or set GENERATE_SITEMAP=1 to run)')
  process.exit(0)
}

const staticPages = [
  { path: '/', file: 'src/pages/HomePage.tsx', priority: '1.0', changefreq: 'weekly' },
  { path: '/learn', file: 'src/pages/TutorialPage.tsx', priority: '0.9', changefreq: 'weekly' },
  { path: '/daily', file: 'src/pages/DailyPage.tsx', priority: '0.9', changefreq: 'daily' },
  { path: '/quests', file: 'src/pages/QuestsPage.tsx', priority: '0.9', changefreq: 'weekly' },
  { path: '/community', file: 'src/pages/CommunityPage.tsx', priority: '0.8', changefreq: 'daily' },
  { path: '/fated-five', file: 'src/pages/FatedFivePage.tsx', priority: '0.8', changefreq: 'weekly' },
  { path: '/contest', file: 'src/pages/ContestListPage.tsx', priority: '0.8', changefreq: 'weekly' },
  { path: '/changelog', file: 'src/pages/ChangelogPage.tsx', priority: '0.4', changefreq: 'weekly' },
  { path: '/terms', file: 'src/pages/TermsPage.tsx', priority: '0.2', changefreq: 'yearly' },
  { path: '/privacy', file: 'src/pages/PrivacyPage.tsx', priority: '0.2', changefreq: 'yearly' },
]

const categorySlugs = QUESTION_CATEGORIES

/** Parse existing sitemap.xml to preserve previous lastmod dates when git is unavailable. */
function parseExistingSitemap() {
  const map = new Map()
  if (!existsSync(outputPath)) return map
  try {
    const xml = readFileSync(outputPath, 'utf-8')
    const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || []
    for (const block of urlBlocks) {
      const locMatch = block.match(/<loc>(.*?)<\/loc>/)
      const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/)
      if (locMatch && lastmodMatch) {
        map.set(locMatch[1].trim(), lastmodMatch[1].trim())
      }
    }
  } catch {
    // Ignore read errors
  }
  return map
}

const fileDateCache = new Map()

/** Get ISO-8601 YYYY-MM-DD last commit date for a relative file path. */
function getFileLastMod(relPath, fallbackDate) {
  if (!relPath) return fallbackDate
  if (fileDateCache.has(relPath)) return fileDateCache.get(relPath)

  try {
    const fullPath = resolve(rootDir, relPath)
    if (existsSync(fullPath)) {
      const date = execFileSync('git', ['log', '-1', '--format=%cs', relPath], {
        cwd: rootDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim()

      if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        fileDateCache.set(relPath, date)
        return date
      }
    }
  } catch {
    // Fall back if git is not available or file is uncommitted
  }

  fileDateCache.set(relPath, fallbackDate)
  return fallbackDate
}

function extractQuestionIds(categorySlug) {
  const catDir = resolve(rootDir, 'content', 'questions', categorySlug)
  try {
    if (!existsSync(catDir)) return []
    return readdirSync(catDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''))
  } catch {
    return []
  }
}

function buildSitemap() {
  const existingLastmods = parseExistingSitemap()
  const urls = []

  // Static pages
  for (const page of staticPages) {
    const loc = `${SITE_URL}${page.path}`
    const previousDate = existingLastmods.get(loc) || TODAY
    const lastmod = getFileLastMod(page.file, previousDate)
    urls.push({
      loc,
      lastmod,
      changefreq: page.changefreq,
      priority: page.priority,
    })
  }

  // Contest pages
  // Contest pages
  try {
    const contestsDir = resolve(rootDir, 'content', 'contests')
    if (existsSync(contestsDir)) {
      const files = readdirSync(contestsDir).filter((f) => f.endsWith('.md'))
      for (const file of files) {
        const id = file.replace(/\.md$/, '')
        const loc = `${SITE_URL}/contest/${id}`
        const previousDate = existingLastmods.get(loc) || TODAY
        urls.push({
          loc,
          lastmod: previousDate,
          changefreq: 'weekly',
          priority: '0.7',
        })
      }
    }
  } catch {
    console.warn('Warning: Could not read contest content files')
  }

  // Category and Question pages
  for (const slug of categorySlugs) {
    const catFile = `src/data/generated/${slug}.ts`
    const locCat = `${SITE_URL}/category/${slug}`
    const previousCatDate = existingLastmods.get(locCat) || TODAY
    const catLastMod = getFileLastMod(catFile, previousCatDate)

    urls.push({
      loc: locCat,
      lastmod: catLastMod,
      changefreq: 'weekly',
      priority: '0.9',
    })

    for (const qid of extractQuestionIds(slug)) {
      const locQ = `${SITE_URL}/category/${slug}/question/${qid}`
      const previousQDate = existingLastmods.get(locQ) || catLastMod
      urls.push({
        loc: locQ,
        lastmod: catLastMod,
        changefreq: 'monthly',
        priority: '0.7',
      })
    }
  }

  // Tutorial lesson pages
  try {
    const tutorialsDir = resolve(rootDir, 'content', 'tutorials')
    if (existsSync(tutorialsDir)) {
      const chapterDirs = readdirSync(tutorialsDir)
        .map((name) => resolve(tutorialsDir, name))
        .filter((p) => {
          try {
            return statSync(p).isDirectory()
          } catch {
            return false
          }
        })

      for (const chDir of chapterDirs) {
        const lessonFiles = readdirSync(chDir).filter((f) => f.endsWith('.md'))
        for (const lf of lessonFiles) {
          const content = readFileSync(resolve(chDir, lf), 'utf-8')
          const idMatch = content.match(/^id:\s*([^\r\n]+)/m)
          if (idMatch) {
            const lessonId = idMatch[1].trim()
            const loc = `${SITE_URL}/learn/${lessonId}`
            const previousDate = existingLastmods.get(loc) || TODAY
            urls.push({
              loc,
              lastmod: previousDate,
              changefreq: 'weekly',
              priority: '0.8',
            })
          }
        }
      }
    }
  } catch {
    console.warn('Warning: Could not read tutorial content files')
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
}

const newSitemap = buildSitemap()
let existingSitemap = ''
try {
  existingSitemap = readFileSync(outputPath, 'utf-8')
} catch {
  // If file doesn't exist yet
}

if (existingSitemap !== newSitemap) {
  writeFileSync(outputPath, newSitemap, 'utf-8')
}

const urlCount = (newSitemap.match(/<url>/g) || []).length
console.log(`✓ Sitemap up to date with ${urlCount} URLs → public/sitemap.xml`)

