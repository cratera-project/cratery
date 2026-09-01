import { createHash } from 'crypto'
import { readdirSync, readFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { loadContestsFromDir, parseContestMarkdown } from './lib/contentParser.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const issues = []

const contestDir = resolve(root, 'content/contests')
const contestFiles = readdirSync(contestDir).filter((f) => f.endsWith('.md'))
for (const file of contestFiles) {
  const parsed = parseContestMarkdown(join(contestDir, file))
  if (!parsed.id) issues.push(`contest file missing id: ${file}`)
  if (!parsed.title) issues.push(`contest file missing title: ${file}`)
  const markers = (parsed.testHarness || '').match(/\{\{SOLUTION\}\}/g) || []
  if (markers.length !== 1) {
    issues.push(`contest ${parsed.id || file}: test harness must contain exactly one {{SOLUTION}}`)
  }
  if (!/\bfn\s+main\s*\(/.test(parsed.testHarness || '')) {
    issues.push(`contest ${parsed.id || file}: test harness missing fn main`)
  }
}

const contests = loadContestsFromDir(contestDir)
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

const iqSrc = readFileSync(resolve(root, 'src/data/interactiveQuests.ts'), 'utf8')
const iqIds = [...iqSrc.matchAll(/^\s+id:\s*'([^']+)'/gm)].map((m) => m[1])
const listedIq = [
  ...idsFile.matchAll(/export const INTERACTIVE_QUEST_IDS = \[([\s\S]*?)\]\s+as const/g),
]
const listedIqIds = listedIq.length
  ? [...listedIq[0][1].matchAll(/'([^']+)'/g)].map((m) => m[1])
  : []
if (listedIqIds.length !== iqIds.length) {
  issues.push(
    `INTERACTIVE_QUEST_IDS lists ${listedIqIds.length} ids, interactiveQuests.ts has ${iqIds.length}`,
  )
}
for (const id of iqIds) {
  if (!listedIqIds.includes(id)) issues.push(`missing id in INTERACTIVE_QUEST_IDS: ${id}`)
}
for (const id of listedIqIds) {
  if (!iqIds.includes(id)) issues.push(`extra id in INTERACTIVE_QUEST_IDS: ${id}`)
}
for (const q of iqIds) {
  const harnessMatch = iqSrc.match(new RegExp(`id:\\s*'${q}'[\\s\\S]*?testHarness:\\s*\`([\\s\\S]*?)\``))
  const harness = harnessMatch ? harnessMatch[1] : ''
  if ((harness.match(/\{\{SOLUTION\}\}/g) || []).length !== 1) {
    issues.push(`forge trial ${q}: test harness must contain exactly one {{SOLUTION}}`)
  }
}

if (issues.length) {
  console.error('check-contest-ids failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`check-contest-ids: ${sourceIds.length} contests ok`)
