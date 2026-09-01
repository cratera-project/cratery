import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  loadQuestionsFromDir,
  loadContestsFromDir,
  loadTutorialChaptersFromDir,
} from './lib/contentParser.mjs'
import { QUESTION_CATEGORIES } from './lib/questionCategories.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const contentDir = join(rootDir, 'content')
const outputDir = join(rootDir, 'src', 'data', 'generated')

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

const categories = QUESTION_CATEGORIES

function toCamelCase(slug) {
  return slug.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
}

let totalQuestions = 0
const indexExports = []

for (const cat of categories) {
  const catDir = join(contentDir, 'questions', cat)
  const qs = loadQuestionsFromDir(catDir).map(({ correctCount: _correctCount, ...q }) => q)
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

// Compile Contests
const rawContests = loadContestsFromDir(join(contentDir, 'contests'))
const contestOutTs = join(outputDir, 'contests.ts')
const contestFileContent = `import type { Contest } from '../contests'
import { getContestSolution } from '../contestSolutions'

const rawContests: Omit<Contest, 'loadSolution'>[] = ${JSON.stringify(rawContests, null, 2)}

export const compiledContests: Contest[] = rawContests.map((c) => ({
  ...c,
  loadSolution: () => Promise.resolve(getContestSolution(c.id)!),
}))
`
writeFileSync(contestOutTs, contestFileContent, 'utf-8')

// Compile Tutorials
const chapters = loadTutorialChaptersFromDir(join(contentDir, 'tutorials'))
const tutorialOutTs = join(outputDir, 'tutorials.ts')
const tutorialFileContent = `import type { TutorialChapter } from '../tutorial/types'

export const compiledTutorialChapters: TutorialChapter[] = ${JSON.stringify(chapters, null, 2)}
`
writeFileSync(tutorialOutTs, tutorialFileContent, 'utf-8')

console.log(`✓ Compiled ${totalQuestions} markdown questions, ${rawContests.length} contests, ${chapters.length} tutorial chapters`)
