import { readdirSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseQuestionMarkdown } from './lib/contentParser.mjs'
import { QUESTION_CATEGORIES } from './lib/questionCategories.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contentDir = resolve(__dirname, '..', 'content', 'questions')

const MAX_UNIQUE_LONGEST_RATIO = 0.20
const MAX_LENGTH_SPREAD = 0.30
const MAX_CORRECT_OVER_MEDIAN = 1.22

function median(nums) {
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

function checkBank(all, label) {
  const issues = []
  let uniqueLongestCorrect = 0
  const dist = [0, 0, 0, 0]

  for (const q of all) {
    if (!q.options || q.options.length < 4 || q.correctIndex === undefined) continue

    dist[q.correctIndex]++
    const lens = q.options.map((o) => o.text.length)
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length
    const max = Math.max(...lens)
    const min = Math.min(...lens)
    const spread = (max - min) / mean
    const maxCount = lens.filter((l) => l === max).length
    const correctLen = lens[q.correctIndex]
    const others = lens.filter((_, i) => i !== q.correctIndex)
    const otherMedian = median(others)

    if (spread > MAX_LENGTH_SPREAD) {
      issues.push({
        id: q.id,
        file: q.file,
        kind: 'spread',
        detail: `length spread ${(spread * 100).toFixed(0)}% (max ${max}, min ${min}) — balance options`,
      })
    }

    if (maxCount === 1 && correctLen === max) {
      uniqueLongestCorrect++
      const ratio = correctLen / otherMedian
      if (ratio > MAX_CORRECT_OVER_MEDIAN) {
        issues.push({
          id: q.id,
          file: q.file,
          kind: 'longest',
          detail: `correct is uniquely longest (${correctLen} vs median others ${otherMedian.toFixed(0)}, ratio ${ratio.toFixed(2)})`,
        })
      }
    }
  }

  const validCount = all.filter((q) => q.options && q.options.length >= 4).length
  const uniqueLongestPct = validCount > 0 ? uniqueLongestCorrect / validCount : 0
  if (uniqueLongestPct > MAX_UNIQUE_LONGEST_RATIO) {
    issues.push({
      id: '*',
      file: label,
      kind: 'bank-bias',
      detail: `${(uniqueLongestPct * 100).toFixed(1)}% of questions have uniquely-longest correct (limit ${(MAX_UNIQUE_LONGEST_RATIO * 100).toFixed(0)}%)`,
    })
  }

  const maxShare = validCount > 0 ? Math.max(...dist) / validCount : 0
  if (maxShare > 0.4) {
    issues.push({
      id: '*',
      file: label,
      kind: 'key-skew',
      detail: `correctIndex skewed: A=${dist[0]} B=${dist[1]} C=${dist[2]} D=${dist[3]}`,
    })
  }

  console.log(`\n[${label}] Checked ${validCount} questions`)
  console.log(
    `Unique-longest-correct: ${uniqueLongestCorrect} (${(uniqueLongestPct * 100).toFixed(1)}%)`
  )
  console.log(`Key distribution A–D: ${dist.join(', ')}`)
  return issues
}

function hashSeed(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function shuffledIndices(n, seed) {
  const idx = Array.from({ length: n }, (_, i) => i)
  let s = hashSeed(seed) || 1
  for (let i = n - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

function pickPermutation(id, n, correctIndex, prev) {
  for (let salt = 0; salt < 64; salt++) {
    const order = shuffledIndices(n, salt === 0 ? id : `${id}#${salt}`)
    const display = order.indexOf(correctIndex)
    if (display < 0) continue
    if (prev.length >= 2 && prev[prev.length - 1] === display && prev[prev.length - 2] === display) {
      continue
    }
    return order
  }
  return shuffledIndices(n, id)
}

function checkDisplayRuns(all, label) {
  const issues = []
  const byFile = new Map()
  for (const q of all) {
    if (q.options && q.options.length >= 4 && q.correctIndex !== undefined) {
      const list = byFile.get(q.categorySlug) || []
      list.push(q)
      byFile.set(q.categorySlug, list)
    }
  }
  const LAB = 'ABCD'
  for (const [file, qs] of byFile) {
    const prev = []
    const seq = []
    for (const q of qs) {
      const order = pickPermutation(q.id, 4, q.correctIndex, prev)
      const display = order.indexOf(q.correctIndex)
      prev.push(display)
      seq.push(display)
    }
    let i = 0
    while (i < seq.length) {
      let j = i
      while (j < seq.length && seq[j] === seq[i]) j++
      if (j - i >= 3) {
        issues.push({
          id: qs[i].id,
          file,
          kind: 'letter-run',
          detail: `displayed correct ${LAB[seq[i]]} repeats ${j - i} times starting at ${qs[i].id}`,
        })
      }
      i = j
    }
  }
  if (issues.length === 0) {
    console.log(`[${label}] Displayed correct letters: no 3-in-a-row`)
  }
  return issues
}

function checkSchema() {
  const issues = []
  const seenIds = new Map()
  const dirents = readdirSync(contentDir)
  const catDirs = dirents.filter((name) => {
    try {
      return statSync(join(contentDir, name)).isDirectory()
    } catch {
      return false
    }
  })

  for (const extra of catDirs) {
    if (!QUESTION_CATEGORIES.includes(extra)) {
      issues.push({
        id: '*',
        file: extra,
        kind: 'unknown-category',
        detail: `directory content/questions/${extra} is not in QUESTION_CATEGORIES`,
      })
    }
  }

  for (const cat of QUESTION_CATEGORIES) {
    const catDir = join(contentDir, cat)
    if (!catDirs.includes(cat)) {
      issues.push({
        id: '*',
        file: cat,
        kind: 'missing-category',
        detail: `expected directory content/questions/${cat}`,
      })
      continue
    }

    const files = readdirSync(catDir).filter((f) => f.endsWith('.md'))
    for (const file of files) {
      const rel = `${cat}/${file}`
      const q = parseQuestionMarkdown(join(catDir, file))

      if (!q.id) {
        issues.push({ id: file, file: rel, kind: 'schema', detail: 'missing frontmatter id' })
        continue
      }
      if (!q.title) {
        issues.push({ id: q.id, file: rel, kind: 'schema', detail: 'missing title' })
      }
      if (!q.prompt) {
        issues.push({ id: q.id, file: rel, kind: 'schema', detail: 'missing prompt' })
      }
      if (q.categorySlug !== cat) {
        issues.push({
          id: q.id,
          file: rel,
          kind: 'schema',
          detail: `categorySlug "${q.categorySlug}" does not match directory "${cat}"`,
        })
      }
      if (![1, 2, 3].includes(q.difficulty)) {
        issues.push({
          id: q.id,
          file: rel,
          kind: 'schema',
          detail: `difficulty must be 1, 2, or 3 (got ${q.difficulty})`,
        })
      }

      const prev = seenIds.get(q.id)
      if (prev) {
        issues.push({
          id: q.id,
          file: rel,
          kind: 'duplicate-id',
          detail: `id already used in ${prev}`,
        })
      } else {
        seenIds.set(q.id, rel)
      }

      if (q.kind === 'coding') {
        const harness = q.testHarness || ''
        const markers = harness.match(/\{\{SOLUTION\}\}/g) || []
        if (!q.solutionCode?.trim()) {
          issues.push({ id: q.id, file: rel, kind: 'schema', detail: 'coding question missing solution' })
        }
        if (markers.length !== 1) {
          issues.push({
            id: q.id,
            file: rel,
            kind: 'schema',
            detail: 'test harness must contain exactly one {{SOLUTION}}',
          })
        }
        if (!/\bfn\s+main\s*\(/.test(harness)) {
          issues.push({ id: q.id, file: rel, kind: 'schema', detail: 'test harness missing fn main' })
        }
      } else {
        const opts = q.options || []
        if (opts.length !== 4) {
          issues.push({
            id: q.id,
            file: rel,
            kind: 'schema',
            detail: `MCQ must have 4 options (got ${opts.length})`,
          })
        }
        if (q.correctCount !== 1) {
          issues.push({
            id: q.id,
            file: rel,
            kind: 'schema',
            detail: `MCQ must mark exactly one correct option (got ${q.correctCount ?? 0})`,
          })
        }
        if (opts.some((o) => !o.text)) {
          issues.push({ id: q.id, file: rel, kind: 'schema', detail: 'MCQ has an empty option' })
        }
      }
    }
  }

  return issues
}

const allQuestions = []
for (const cat of QUESTION_CATEGORIES) {
  const catDir = join(contentDir, cat)
  try {
    if (!statSync(catDir).isDirectory()) continue
  } catch {
    continue
  }
  const files = readdirSync(catDir).filter((f) => f.endsWith('.md'))
  for (const file of files) {
    const q = parseQuestionMarkdown(join(catDir, file))
    if (q.id && q.prompt) allQuestions.push({ ...q, file: cat })
  }
}

const issues = [
  ...checkSchema(),
  ...checkBank(allQuestions, 'built-in'),
  ...checkDisplayRuns(allQuestions, 'built-in'),
]

if (issues.length) {
  console.error(`\n${issues.length} quality issue(s):`)
  for (const i of issues.slice(0, 60)) {
    console.error(`  [${i.kind}] ${i.file} ${i.id}: ${i.detail}`)
  }
  if (issues.length > 60) console.error(`  …and ${issues.length - 60} more`)
  process.exit(1)
}

console.log('\n✓ Question quality checks passed')
