/**
 * Sitemap generator. Writes public/sitemap.xml (gitignored) so Vite copies it into dist/.
 * lastmod comes from git history of the source file, not from a committed sitemap.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import { execFileSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { QUESTION_CATEGORIES } from './lib/questionCategories.mjs'

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

const categorySlugs = QUESTION_CATEGORIES

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
  const urls = []

  for (const page of staticPages) {
    urls.push({
      loc: `${SITE_URL}${page.path}`,
      lastmod: getFileLastMod(page.file, TODAY),
      changefreq: page.changefreq,
      priority: page.priority,
    })
  }

  try {
    const contestsDir = resolve(rootDir, 'content', 'contests')
    if (existsSync(contestsDir)) {
      const files = readdirSync(contestsDir).filter((f) => f.endsWith('.md'))
      for (const file of files) {
        const id = file.replace(/\.md$/, '')
        const rel = `content/contests/${file}`
        urls.push({
          loc: `${SITE_URL}/contest/${id}`,
          lastmod: getFileLastMod(rel, TODAY),
          changefreq: 'weekly',
          priority: '0.7',
        })
      }
    }
  } catch {
    console.warn('Warning: Could not read contest content files')
  }

  for (const slug of categorySlugs) {
    const questionFiles = extractQuestionIds(slug)
    const catLastMod = questionFiles.reduce((latest, qid) => {
      const date = getFileLastMod(`content/questions/${slug}/${qid}.md`, TODAY)
      return date > latest ? date : latest
    }, '1970-01-01')

    urls.push({
      loc: `${SITE_URL}/category/${slug}`,
      lastmod: catLastMod === '1970-01-01' ? TODAY : catLastMod,
      changefreq: 'weekly',
      priority: '0.9',
    })

    for (const qid of questionFiles) {
      const rel = `content/questions/${slug}/${qid}.md`
      urls.push({
        loc: `${SITE_URL}/category/${slug}/question/${qid}`,
        lastmod: getFileLastMod(rel, TODAY),
        changefreq: 'monthly',
        priority: '0.7',
      })
    }
  }

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
          const relPath = resolve(chDir, lf)
          const content = readFileSync(relPath, 'utf-8')
          const idMatch = content.match(/^id:\s*([^\r\n]+)/m)
          if (idMatch) {
            const lessonId = idMatch[1].trim()
            const rel = relPath.slice(rootDir.length + 1).replace(/\\/g, '/')
            urls.push({
              loc: `${SITE_URL}/learn/${lessonId}`,
              lastmod: getFileLastMod(rel, TODAY),
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
mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, newSitemap, 'utf-8')

const urlCount = (newSitemap.match(/<url>/g) || []).length
console.log(`✓ Sitemap generated with ${urlCount} URLs → public/sitemap.xml`)

