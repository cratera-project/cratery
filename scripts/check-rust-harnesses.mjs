/**
 * Compile and run official solutions against their test harnesses.
 * Requires rustc (edition 2024) on PATH.
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { availableParallelism, cpus, tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  loadQuestionsFromDir,
  loadContestsFromDir,
  loadTutorialChaptersFromDir,
} from './lib/contentParser.mjs'
import { QUESTION_CATEGORIES } from './lib/questionCategories.mjs'
import {
  loadInteractiveHarnesses,
  loadSolutionAliases,
  loadSolutionCodes,
  resolveOfficialSolution,
  withSolutionHarness,
} from './lib/officialSolutions.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const isWindows = process.platform === 'win32'
const COMPILE_MS = 60_000
const RUN_MS = 30_000
const CONCURRENCY = Math.min(
  4,
  typeof availableParallelism === 'function' ? availableParallelism() : cpus().length || 1,
)

function run(cmd, args, opts = {}) {
  const { cwd, timeoutMs = 30_000 } = opts
  return new Promise((resolvePromise) => {
    const child = spawn(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeoutMs)
    child.stdout.on('data', (d) => {
      stdout += d.toString()
    })
    child.stderr.on('data', (d) => {
      stderr += d.toString()
    })
    child.on('error', (err) => {
      clearTimeout(timer)
      resolvePromise({ code: 1, stdout, stderr: err.message, missing: err.code === 'ENOENT' })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      resolvePromise({
        code: timedOut ? 1 : code ?? 1,
        stdout,
        stderr: timedOut ? `${stderr}\ntimed out after ${timeoutMs}ms` : stderr,
      })
    })
  })
}

async function rustcAndRun(source) {
  const workDir = mkdtempSync(join(tmpdir(), 'cratery-harness-'))
  const srcFile = join(workDir, 'solution.rs')
  const binFile = join(workDir, isWindows ? 'solution.exe' : 'solution')
  try {
    writeFileSync(srcFile, source, 'utf8')
    const compiled = await run(
      'rustc',
      ['--edition', '2024', '-o', binFile, srcFile],
      { cwd: workDir, timeoutMs: COMPILE_MS },
    )
    if (compiled.missing) {
      return { ok: false, stage: 'rustc', detail: 'rustc not found on PATH (https://rustup.rs)' }
    }
    if (compiled.code !== 0) {
      return {
        ok: false,
        stage: 'compile',
        detail: (compiled.stderr || compiled.stdout || 'compile failed').trim(),
      }
    }
    const ran = await run(binFile, [], { cwd: workDir, timeoutMs: RUN_MS })
    if (ran.code !== 0) {
      return {
        ok: false,
        stage: 'run',
        detail: (ran.stderr || ran.stdout || `exit ${ran.code}`).trim(),
      }
    }
    return { ok: true }
  } finally {
    rmSync(workDir, { recursive: true, force: true })
  }
}

async function pool(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  const n = Math.max(1, Math.min(limit, items.length))
  await Promise.all(Array.from({ length: n }, () => worker()))
  return results
}

const solutionsFile = join(root, 'src/data/contestSolutions.ts')
const solutions = loadSolutionCodes(solutionsFile)
const aliases = loadSolutionAliases(solutionsFile)

const cases = []

for (const cat of QUESTION_CATEGORIES) {
  for (const q of loadQuestionsFromDir(join(root, 'content/questions', cat))) {
    if (q.kind !== 'coding') continue
    cases.push({
      label: `question ${q.id}`,
      id: q.id,
      harness: q.testHarness,
      solution: q.solutionCode,
    })
  }
}

for (const c of loadContestsFromDir(join(root, 'content/contests'))) {
  cases.push({
    label: `contest ${c.id}`,
    id: c.id,
    harness: c.testHarness,
    solution: resolveOfficialSolution(c.id, solutions, aliases),
  })
}

for (const chapter of loadTutorialChaptersFromDir(join(root, 'content/tutorials'))) {
  for (const lesson of chapter.lessons ?? []) {
    for (const quest of lesson.quests ?? []) {
      if (quest.type !== 'coding') continue
      cases.push({
        label: `tutorial ${quest.id}`,
        id: quest.id,
        harness: quest.testHarness,
        solution: quest.solutionCode,
      })
    }
  }
}

const interactiveFile = join(root, 'src/data/interactiveQuests.ts')
if (existsSync(interactiveFile)) {
  for (const q of loadInteractiveHarnesses(interactiveFile)) {
    cases.push({
      label: `forge ${q.id}`,
      id: q.id,
      harness: q.testHarness,
      solution: resolveOfficialSolution(q.id, solutions, aliases),
    })
  }
}

if (cases.length === 0) {
  console.error('check-rust-harnesses: no coding cases found')
  process.exit(1)
}

const probe = await run('rustc', ['--version'], { timeoutMs: 10_000 })
if (probe.missing || probe.code !== 0) {
  console.error('rustc is required for harness checks. Install from https://rustup.rs')
  if (probe.stderr) console.error(probe.stderr)
  process.exit(1)
}
console.log(`rustc: ${(probe.stdout || '').trim()}`)
console.log(`check-rust-harnesses: ${cases.length} cases, concurrency ${CONCURRENCY}`)

let failed = 0
const results = await pool(cases, CONCURRENCY, async (item) => {
  if (!item.solution || !String(item.solution).trim()) {
    return { ...item, ok: false, stage: 'solution', detail: 'missing official solution' }
  }
  if (!item.harness || !item.harness.includes('{{SOLUTION}}')) {
    return { ...item, ok: false, stage: 'harness', detail: 'harness missing {{SOLUTION}}' }
  }
  const source = withSolutionHarness(item.harness, item.solution)
  const result = await rustcAndRun(source)
  return { ...item, ...result }
})

for (const r of results) {
  if (r.ok) {
    console.log(`ok: ${r.label}`)
  } else {
    failed++
    console.error(`FAIL: ${r.label} [${r.stage}]`)
    const detail = (r.detail || '').split('\n').slice(0, 20).join('\n')
    if (detail) console.error(detail)
  }
}

if (failed) {
  console.error(`\n${failed}/${cases.length} harnesses failed`)
  process.exit(1)
}
console.log(`\n✓ ${cases.length} official solutions compiled and passed`)
