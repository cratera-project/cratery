import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const sourcePath = join(rootDir, 'CHANGELOG.md')
const outTs = join(rootDir, 'src', 'data', 'changelog.ts')

const source = readFileSync(sourcePath, 'utf-8')

const DATE_RE = /^\d{4}-\d{2}-\d{2}/

function fail(message) {
  console.error(`changelog: ${message}`)
  process.exit(1)
}

// Entries are `## YYYY-MM-DD — Title` headings followed by `- item` bullets.
const entries = []
let current = null
for (const rawLine of source.split('\n')) {
  const line = rawLine.trimEnd()
  if (line.startsWith('## ')) {
    const heading = line.slice(3).trim()
    if (!DATE_RE.test(heading)) {
      fail(`heading does not start with a YYYY-MM-DD date: "## ${heading}"`)
    }
    const date = heading.slice(0, 10)
    const title = heading.slice(10).replace(/^[\s—–-]+/, '').trim()
    if (!title) fail(`heading for ${date} is missing a title`)
    current = { date, title, items: [] }
    entries.push(current)
    continue
  }
  if (current && line.startsWith('- ')) {
    const item = line.slice(2).trim()
    if (item) current.items.push(item)
  }
}

if (entries.length === 0) fail('no entries found in CHANGELOG.md')

for (const entry of entries) {
  if (entry.items.length === 0) fail(`entry "${entry.title}" (${entry.date}) has no bullet items`)
}

for (let i = 1; i < entries.length; i++) {
  if (entries[i - 1].date < entries[i].date) {
    fail(`entries must be newest first: ${entries[i].date} appears after ${entries[i - 1].date}`)
  }
}

const dates = entries.map((e) => e.date)
if (new Set(dates).size !== dates.length) fail('duplicate entry dates in CHANGELOG.md')

const fileContent = `export type ChangelogEntry = {
  date: string
  title: string
  items: string[]
}

// Generated from CHANGELOG.md by scripts/generate-changelog.mjs — edit the markdown, not this file.

export const CHANGELOG: ChangelogEntry[] = ${JSON.stringify(entries, null, 2)}
`
writeFileSync(outTs, fileContent, 'utf-8')

console.log(`✓ Compiled ${entries.length} changelog entries from CHANGELOG.md`)
console.log(`Wrote ${outTs}`)
