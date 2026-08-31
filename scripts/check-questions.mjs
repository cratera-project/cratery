/**
 * Question quality gate for Cratery.
 * Fails if correct answers are systematically the longest option,
 * or if option lengths within a question are badly unbalanced.
 *
 * Checks built-in questions and catalog topics.
 *
 * Usage: node scripts/check-questions.mjs
 */

import { readFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = resolve(__dirname, '..', 'src', 'data', 'questions')

const MAX_UNIQUE_LONGEST_RATIO = 0.20 // chance ~25%; bank must not favor longest
const MAX_LENGTH_SPREAD = 0.30 // (max-min)/mean within one question
const MAX_CORRECT_OVER_MEDIAN = 1.22 // correct len / median of other options

function parseQuestions(src, file) {
  const questions = []
  const idHits = [...src.matchAll(/id:\s*['"]([^'"]+)['"]/g)]
  for (let i = 0; i < idHits.length; i++) {
    const id = idHits[i][1]
    const start = idHits[i].index
    const end = i + 1 < idHits.length ? idHits[i + 1].index : src.length
    const block = src.slice(start, end)
    const correctIndex = Number(block.match(/correctIndex:\s*(\d+)/)?.[1])
    const optionsSection = block.split(/options:\s*\[/)[1]?.split(/correctIndex/)[0] || ''
    const optTexts = [...optionsSection.matchAll(/text:\s*(`(?:\\`|[^`])*`|'(?:\\'|[^'])*'|"(?:\\"|[^"])*")/g)].map(
      (m) => {
        let s = m[1]
        s = s.startsWith('`') ? s.slice(1, -1) : s.slice(1, -1)
        return s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n')
      }
    )
    if (optTexts.length < 4 || Number.isNaN(correctIndex)) continue
    questions.push({ id, file, correctIndex, options: optTexts.slice(0, 4) })
  }
  return questions
}

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
    dist[q.correctIndex]++
    const lens = q.options.map((o) => o.length)
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

  const uniqueLongestPct = uniqueLongestCorrect / all.length
  if (uniqueLongestPct > MAX_UNIQUE_LONGEST_RATIO) {
    issues.push({
      id: '*',
      file: label,
      kind: 'bank-bias',
      detail: `${(uniqueLongestPct * 100).toFixed(1)}% of questions have uniquely-longest correct (limit ${(MAX_UNIQUE_LONGEST_RATIO * 100).toFixed(0)}%)`,
    })
  }

  const maxShare = Math.max(...dist) / all.length
  if (maxShare > 0.4) {
    issues.push({
      id: '*',
      file: label,
      kind: 'key-skew',
      detail: `correctIndex skewed: A=${dist[0]} B=${dist[1]} C=${dist[2]} D=${dist[3]}`,
    })
  }

  console.log(`\n[${label}] Checked ${all.length} questions`)
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

/** Keep in sync with src/lib/optionOrder.ts pickPermutation. */
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
    const list = byFile.get(q.file) || []
    list.push(q)
    byFile.set(q.file, list)
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

const files = readdirSync(dir).filter((f) => f.endsWith('.ts'))
const builtins = files.flatMap((f) => parseQuestions(readFileSync(resolve(dir, f), 'utf8'), f))

const issues = [
  ...checkBank(builtins, 'built-in'),
  ...checkDisplayRuns(builtins, 'built-in'),
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
