import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadQuestionsFromDir } from './lib/contentParser.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const catSrc = readFileSync(join(root, 'src/data/categories.ts'), 'utf8')
const slugs = [...catSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
const names = [...catSrc.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1])
const categories = slugs.map((slug, i) => ({ slug, name: names[i] }))

const contentDir = join(root, 'content', 'questions')
const byCat = Object.fromEntries(categories.map((c) => [c.slug, []]))

for (const slug of slugs) {
  const catDir = join(contentDir, slug)
  const questions = loadQuestionsFromDir(catDir)
  byCat[slug] = questions.map((q) => q.id)
}

const total = Object.values(byCat).flat().length
const catalog = { categories, questionsByCategory: byCat }
writeFileSync(join(root, 'src/data/questionCatalog.json'), JSON.stringify(catalog, null, 2) + '\n')

const out = `export type CatalogCategory = { slug: string; name: string }

export const catalogCategories: CatalogCategory[] = ${JSON.stringify(categories, null, 2)}

export const questionsByCategory: Record<string, string[]> = ${JSON.stringify(byCat, null, 2)}

export const firstQuestionId = questionsByCategory[catalogCategories[0].slug][0]
`
writeFileSync(join(root, 'src/data/questionCatalog.ts'), out)
console.log(`question catalog: ${categories.length} topics, ${total} questions`)
