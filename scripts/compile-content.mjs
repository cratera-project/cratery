import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadQuestionsFromDir } from './lib/contentParser.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const contentQuestionsDir = join(rootDir, 'content', 'questions')
const outputDir = join(rootDir, 'src', 'data', 'generated')

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

const categories = [
  'ownership',
  'borrow-checker',
  'lifetimes',
  'traits',
  'concurrency',
  'pointers',
  'macros',
  'error-handling',
  'iterators-closures',
]

function toCamelCase(slug) {
  return slug.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
}

let totalQuestions = 0
const indexExports = []

for (const cat of categories) {
  const catDir = join(contentQuestionsDir, cat)
  const qs = loadQuestionsFromDir(catDir)
  totalQuestions += qs.length

  const varName = `${toCamelCase(cat)}MarkdownQuestions`

  if (qs.length > 0) {
    const outTs = join(outputDir, `${cat}.ts`)
    const fileContent = `import type { Question } from '../../lib/quiz'\n\nexport const ${varName}: Question[] = ${JSON.stringify(qs, null, 2)}\n`
    writeFileSync(outTs, fileContent, 'utf-8')
    indexExports.push(`export { ${varName} } from './${cat}'`)
  }
}

const indexFileContent = `${indexExports.join('\n')}\n`
writeFileSync(join(outputDir, 'index.ts'), indexFileContent, 'utf-8')

console.log(`✓ Compiled ${totalQuestions} markdown questions across ${categories.length} categories`)
