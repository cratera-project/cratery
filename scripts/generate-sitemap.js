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
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const outputPath = resolve(rootDir, 'public', 'sitemap.xml')
const SITE_URL = 'https://cratery.cratera.org'
const TODAY = new Date().toISOString().split('T')[0]

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

const categorySlugs = [
  'ownership',
  'lifetimes',
  'traits',
  'concurrency',
  'pointers',
  'macros',
  'error-handling',
  'iterators-closures',
  'borrow-checker',
]

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
  const filePath = resolve(rootDir, 'src', 'data', 'questions', `${categorySlug}.ts`)
  try {
    const content = readFileSync(filePath, 'utf-8')
    const ids = []
    const regex = /id:\s*['"]([^'"]+)['"]/g
    let match
    while ((match = regex.exec(content)) !== null) {
      ids.push(match[1])
    }
    return ids
  } catch {
    console.warn(`Warning: Could not read ${filePath}`)
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
  const contestFiles = [
    'src/data/contests.ts',
    'src/data/practiceContests.ts',
    'src/data/contestCalendar.ts',
  ]
  const contestLastMod = contestFiles
    .map((f) => getFileLastMod(f, TODAY))
    .sort()
    .reverse()[0] || TODAY

  try {
    const dataDir = resolve(rootDir, 'src', 'data')
    const contestSrc = [
      readFileSync(resolve(dataDir, 'contests.ts'), 'utf-8'),
      readFileSync(resolve(dataDir, 'practiceContests.ts'), 'utf-8'),
      readFileSync(resolve(dataDir, 'contestCalendar.ts'), 'utf-8'),
    ].join('\n')
    const contestIds = [
      ...contestSrc.matchAll(/id:\s*['"]([^'"]+)['"]/g),
      ...contestSrc.matchAll(/contestCalendarEntry\(['"]([^'"]+)['"]\)/g),
    ].map((m) => m[1])
    const seen = new Set()
    for (const id of contestIds) {
      if (seen.has(id)) continue
      seen.add(id)
      const loc = `${SITE_URL}/contest/${id}`
      const previousDate = existingLastmods.get(loc) || contestLastMod
      urls.push({
        loc,
        lastmod: previousDate,
        changefreq: 'weekly',
        priority: '0.7',
      })
    }
  } catch {
    console.warn('Warning: Could not read contest data files')
  }

  // Category and Question pages
  for (const slug of categorySlugs) {
    const catFile = `src/data/questions/${slug}.ts`
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
    const chaptersDir = resolve(rootDir, 'src', 'data', 'tutorial', 'chapters')
    const chapterFiles = [
      'chapter1Basics.ts',
      'chapter2ControlFlow.ts',
      'chapter3Ownership.ts',
      'chapter4StructsEnums.ts',
      'chapter5Collections.ts',
      'chapter6ErrorHandling.ts',
      'chapter7GenericsTraits.ts',
      'chapter8Lifetimes.ts',
      'chapter9IteratorsClosures.ts',
      'chapter10SmartPointers.ts',
      'chapter11Concurrency.ts',
    ]
    for (const cf of chapterFiles) {
      const fullPath = resolve(chaptersDir, cf)
      if (existsSync(fullPath)) {
        const content = readFileSync(fullPath, 'utf-8')
        const lessonMatches = [...content.matchAll(/id:\s*['"](\d{2}-[a-z0-9-]+)['"]/g)]
        const cfLastMod = getFileLastMod(`src/data/tutorial/chapters/${cf}`, TODAY)
        for (const m of lessonMatches) {
          const lessonId = m[1]
          const loc = `${SITE_URL}/learn/${lessonId}`
          const previousDate = existingLastmods.get(loc) || cfLastMod
          urls.push({
            loc,
            lastmod: previousDate,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }
      }
    }
  } catch {
    console.warn('Warning: Could not read tutorial chapter files')
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

