import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return { data: {}, body: text }
  }

  const rawYaml = match[1]
  const body = match[2]
  const data = {}

  for (const line of rawYaml.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    let value = trimmed.slice(colonIdx + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
      data[key] = value
      continue
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      const items = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      data[key] = items
      continue
    }

    if (/^\d+$/.test(value)) {
      data[key] = parseInt(value, 10)
      continue
    }
    if (/^\d+\.\d+$/.test(value)) {
      data[key] = parseFloat(value)
      continue
    }

    if (value === 'true') {
      data[key] = true
      continue
    }
    if (value === 'false') {
      data[key] = false
      continue
    }

    data[key] = value
  }

  return { data, body }
}

export function parseMarkdownSections(markdownBody) {
  const sections = {}
  const lines = markdownBody.split(/\r?\n/)
  let currentHeading = null
  let currentLines = []

  for (const line of lines) {
    const headingMatch = line.match(/^#\s+([^\r\n]+)$/)
    if (headingMatch) {
      if (currentHeading) {
        sections[currentHeading] = currentLines.join('\n').trim()
      }
      currentHeading = headingMatch[1].trim().toLowerCase()
      currentLines = []
    } else if (currentHeading) {
      currentLines.push(line)
    }
  }

  if (currentHeading) {
    sections[currentHeading] = currentLines.join('\n').trim()
  }

  return sections
}

export function extractCodeBlock(markdown) {
  if (!markdown) return ''
  const match = markdown.match(/```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
  return match ? match[1].trimEnd() : markdown.trim()
}

export function parseOptionsList(optionsMarkdown) {
  if (!optionsMarkdown) return { options: [], correctIndex: -1 }

  const lines = optionsMarkdown
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- [') || l.startsWith('* ['))

  const options = []
  let correctIndex = -1

  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  lines.forEach((line, idx) => {
    const isCorrect = line.startsWith('- [x]') || line.startsWith('- [X]') || line.startsWith('* [x]') || line.startsWith('* [X]')
    if (isCorrect) {
      correctIndex = idx
    }

    let text = line.replace(/^[-*]\s*\[[ xX]\]\s*/, '')
    text = text.replace(/^[A-D][).:-]\s*/, '').trim()

    const label = OPTION_LABELS[idx] || String.fromCharCode(65 + idx)
    options.push({ label, text })
  })

  return { options, correctIndex }
}

export function parseQuestionMarkdown(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const { data: fm, body } = parseFrontmatter(content)
  const sections = parseMarkdownSections(body)

  const id = fm.id || ''
  const title = fm.title || ''
  const categorySlug = fm.categorySlug || fm.category || ''
  const difficulty = Number(fm.difficulty) || 1
  const tags = Array.isArray(fm.tags) ? fm.tags : []
  const kind = fm.kind === 'coding' ? 'coding' : 'mcq'
  const language = fm.language || 'rust'

  const prompt = sections['prompt'] || body
  const hint = sections['hint'] || fm.hint || ''
  const explanation = sections['explanation'] || ''

  if (kind === 'coding') {
    const code = extractCodeBlock(sections['starter code'] || sections['code'] || '')
    const testHarness = extractCodeBlock(sections['test harness'] || sections['harness'] || '')
    const solution = extractCodeBlock(sections['solution'] || '')

    return {
      id,
      categorySlug,
      title,
      prompt,
      kind: 'coding',
      code,
      testHarness,
      solutionCode: solution || undefined,
      language: 'rust',
      hint: hint || undefined,
      explanation,
      difficulty,
      tags,
    }
  }

  const code = extractCodeBlock(sections['code'] || '')
  const { options, correctIndex } = parseOptionsList(sections['options'] || '')

  return {
    id,
    categorySlug,
    title,
    prompt,
    kind: 'mcq',
    code: code || undefined,
    language: 'rust',
    options: options.length > 0 ? options : undefined,
    correctIndex: correctIndex >= 0 ? correctIndex : (Number(fm.correctIndex) ?? 0),
    hint: hint || undefined,
    explanation,
    difficulty,
    tags,
  }
}

export function loadQuestionsFromDir(dirPath) {
  if (!existsSync(dirPath)) return []
  try {
    const stat = statSync(dirPath)
    if (!stat.isDirectory()) return []
  } catch {
    return []
  }

  const files = readdirSync(dirPath).filter((f) => f.endsWith('.md'))
  const questions = []

  for (const file of files) {
    const fullPath = join(dirPath, file)
    const q = parseQuestionMarkdown(fullPath)
    if (q.id && q.prompt) {
      questions.push(q)
    }
  }

  return questions
}
