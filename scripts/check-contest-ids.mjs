import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { loadContestsFromDir } from './lib/contentParser.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const contests = loadContestsFromDir(resolve(root, 'content/contests'))
const sourceContests = contests.map((c) => ({
  id: c.id,
  hash: createHash('sha256').update(c.testHarness).digest('hex'),
}))

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
const weeklyContests = contests.filter((c) => !c.weekLabel.startsWith('Practice'))
const weeklyIds = weeklyContests.map((c) => c.id)

for (const id of weeklyIds) {
  if (!calendarIds.includes(id)) issues.push(`missing contestCalendar.ts entry for ${id}`)
}
for (const id of calendarIds) {
  if (!weeklyIds.includes(id)) issues.push(`extra contestCalendar.ts entry: ${id}`)
}

if (issues.length) {
  console.error('check-contest-ids failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`check-contest-ids: ${sourceIds.length} contests ok`)
