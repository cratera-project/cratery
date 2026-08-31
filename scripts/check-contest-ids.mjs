/**
 * Keep contestIds.ts in sync with contests.ts / practiceContests.ts.
 * Usage: node scripts/check-contest-ids.mjs
 */
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function parseTemplate(src, openTickIdx) {
  let i = openTickIdx + 1
  let out = ''
  const map = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '0': '\0', '`': '`', '\\': '\\', $: '$' }
  while (i < src.length) {
    const c = src[i]
    if (c === '`') return { value: out, end: i }
    if (c === '\\' && i + 1 < src.length) {
      const n = src[i + 1]
      out += map[n] ?? n
      i += 2
      continue
    }
    out += c
    i++
  }
  throw new Error('unterminated template')
}

function extractFrom(src) {
  const out = []
  const idRe =
    /(?:id:\s*['"](\d{4}-\d{2}-\d{2}-[a-z0-9-]+)['"]|contestCalendarEntry\(['"](\d{4}-\d{2}-\d{2}-[a-z0-9-]+)['"]\))/g
  let m
  while ((m = idRe.exec(src))) {
    const id = m[1] || m[2]
    const afterStart = m.index
    const rest = src.slice(afterStart + m[0].length)
    const nextId = rest.search(/id:\s*['"]\d{4}-\d{2}-\d{2}-/)
    const nextCal = rest.search(/contestCalendarEntry\(['"]\d{4}-\d{2}-\d{2}-/)
    const bounds = [nextId, nextCal].filter((n) => n !== -1)
    const next = bounds.length ? Math.min(...bounds) : -1
    const regionEnd = next === -1 ? src.length : afterStart + m[0].length + next
    const region = src.slice(afterStart, regionEnd)
    const marker = 'testHarness: `'
    const hi = region.indexOf(marker)
    if (hi < 0) continue
    const abs = afterStart + hi + 'testHarness: '.length
    const { value } = parseTemplate(src, abs)
    out.push({
      id,
      hash: createHash('sha256').update(value).digest('hex'),
    })
  }
  return out
}

const sourceContests = [
  ...extractFrom(readFileSync(resolve(root, 'src/data/contests.ts'), 'utf8')),
  ...extractFrom(readFileSync(resolve(root, 'src/data/practiceContests.ts'), 'utf8')),
]
const idsFile = readFileSync(resolve(root, 'src/data/contestIds.ts'), 'utf8')
const listedIds = [...idsFile.matchAll(/'(\d{4}-\d{2}-\d{2}-[a-z0-9-]+)'/g)].map((m) => m[1])
const uniqueListed = [...new Set(listedIds)]
const hashMap = Object.fromEntries(
  [...idsFile.matchAll(/'(\d{4}-\d{2}-\d{2}-[a-z0-9-]+)':\s*'([0-9a-f]{64})'/g)].map((m) => [m[1], m[2]])
)

const sourceIds = sourceContests.map((c) => c.id)
const issues = []

if (uniqueListed.length !== sourceIds.length) {
  issues.push(
    `contestIds.ts lists ${uniqueListed.length} ids, contest sources have ${sourceIds.length}`
  )
}

for (const id of sourceIds) {
  if (!uniqueListed.includes(id)) issues.push(`missing id in contestIds.ts: ${id}`)
}
for (const id of uniqueListed) {
  if (!sourceIds.includes(id)) issues.push(`extra id in contestIds.ts: ${id}`)
}

for (const { id, hash } of sourceContests) {
  if (hashMap[id] !== hash) {
    issues.push(`harness hash mismatch for ${id}\n  expected ${hash}\n  listed   ${hashMap[id] ?? '(missing)'}`)
  }
}

const calendarSrc = readFileSync(resolve(root, 'src/data/contestCalendar.ts'), 'utf8')
const calendarIds = [...calendarSrc.matchAll(/id:\s*['"](\d{4}-\d{2}-\d{2}-[a-z0-9-]+)['"]/g)].map(
  (m) => m[1]
)
const weeklySrc = readFileSync(resolve(root, 'src/data/contests.ts'), 'utf8')
const weeklyIds = [
  ...weeklySrc.matchAll(/contestCalendarEntry\(['"](\d{4}-\d{2}-\d{2}-[a-z0-9-]+)['"]\)/g),
].map((m) => m[1])
for (const id of weeklyIds) {
  if (!calendarIds.includes(id)) issues.push(`missing contestCalendar.ts entry for ${id}`)
}
for (const id of calendarIds) {
  if (!weeklyIds.includes(id)) issues.push(`extra contestCalendar.ts entry (not in contests.ts): ${id}`)
}

if (issues.length) {
  console.error('check-contest-ids failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`check-contest-ids: ${sourceIds.length} contests ok`)
