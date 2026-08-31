import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadQuestionsFromDir } from './lib/contentParser.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = join(root, 'content', 'questions')
const out = join(root, 'functions', 'lib', 'builtinCorrect.ts')

const map = {}

for (const cat of readdirSync(contentDir)) {
  const catDir = join(contentDir, cat)
  if (!statSync(catDir).isDirectory()) continue
  const questions = loadQuestionsFromDir(catDir)
  for (const q of questions) {
    if (q.id && q.categorySlug) {
      map[q.id] = {
        correctIndex: q.correctIndex ?? 0,
        categorySlug: q.categorySlug,
        explanation: q.explanation || '',
      }
    }
  }
}

const body = `export type BuiltinAnswer = {
  correctIndex: number
  categorySlug: string
  explanation: string
}

export const BUILTIN_ANSWERS: Record<string, BuiltinAnswer> = ${JSON.stringify(map, null, 2)}
`

writeFileSync(out, body)
console.log(`Wrote ${out} (${Object.keys(map).length} questions)`)
