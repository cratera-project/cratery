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

export function parseContestMarkdown(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const { data: fm, body } = parseFrontmatter(content)
  const sections = parseMarkdownSections(body)

  const id = fm.id || ''
  const title = fm.title || ''
  const weekLabel = fm.weekLabel || ''
  const difficulty = Number(fm.difficulty) || 1
  const opensAt = fm.opensAt || ''
  const closesAt = fm.closesAt || ''
  const solutionUnlocksAt = fm.solutionUnlocksAt || undefined
  const signature = fm.signature || ''
  const supportedLanguages = Array.isArray(fm.supportedLanguages) ? fm.supportedLanguages : undefined

  const prompt = sections['description'] || sections['prompt'] || ''
  const starterCode = extractCodeBlock(sections['starter code'] || '')
  const testHarness = extractCodeBlock(sections['test harness'] || '')

  const examples = []
  if (sections['examples']) {
    const exampleBlocks = sections['examples'].split(/(?=###\s+Example\s+\d+)/i).filter(Boolean)
    for (const block of exampleBlocks) {
      const inputMatch = block.match(/\*\*Input:\*\*\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
      const outputMatch = block.match(/\*\*Output:\*\*\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
      const explMatch = block.match(/\*\*Explanation:\*\*\s*([^\r\n]+)/)
      if (inputMatch && outputMatch) {
        examples.push({
          input: inputMatch[1].trim(),
          output: outputMatch[1].trim(),
          explanation: explMatch ? explMatch[1].trim() : undefined,
        })
      }
    }
  }

  const starterCodes = {}
  for (const [secKey, secVal] of Object.entries(sections)) {
    const langMatch = secKey.match(/^starter code \(([a-z0-9_-]+)\)$/)
    if (langMatch) {
      starterCodes[langMatch[1]] = extractCodeBlock(secVal)
    }
  }

  return {
    id,
    title,
    weekLabel,
    difficulty,
    opensAt,
    closesAt,
    solutionUnlocksAt,
    prompt,
    signature,
    examples,
    starterCode,
    starterCodes: Object.keys(starterCodes).length > 0 ? starterCodes : undefined,
    supportedLanguages,
    testHarness,
  }
}

export function loadContestsFromDir(dirPath) {
  if (!existsSync(dirPath)) return []
  const files = readdirSync(dirPath).filter((f) => f.endsWith('.md'))
  const contests = []
  for (const file of files) {
    const fullPath = join(dirPath, file)
    const c = parseContestMarkdown(fullPath)
    if (c.id && c.title) {
      contests.push(c)
    }
  }
  return contests
}

export function parseLessonMarkdown(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const { data: fm, body } = parseFrontmatter(content)
  const sectionsMap = parseMarkdownSections(body)

  const id = fm.id || ''
  const chapterId = fm.chapterId || ''
  const chapterNumber = Number(fm.chapterNumber) || 1
  const lessonNumber = Number(fm.lessonNumber) || 1
  const title = fm.title || ''
  const tagline = fm.tagline || ''
  const readTimeMinutes = Number(fm.readTimeMinutes) || 5
  const difficulty = fm.difficulty || 'beginner'
  const tags = Array.isArray(fm.tags) ? fm.tags : []
  const overview = sectionsMap['overview'] || ''

  const sections = []
  if (sectionsMap['sections']) {
    const secBlocks = sectionsMap['sections'].split(/(?=^##\s+[^\r\n]+)/m).filter(Boolean)
    for (const block of secBlocks) {
      const titleMatch = block.match(/^##\s+([^\r\n]+)/)
      if (!titleMatch) continue
      const secTitle = titleMatch[1].trim()
      const afterTitle = block.slice(titleMatch[0].length).trim()

      const codeMatch = afterTitle.match(/```rust([^\r\n]*)\r?\n([\s\S]*?)```/)
      let textContent = afterTitle
      let codeSnippet = undefined

      if (codeMatch) {
        textContent = afterTitle.replace(codeMatch[0], '').trim()
        const meta = codeMatch[1]
        const code = codeMatch[2].trim()
        const runnable = meta.includes('runnable')
        const captionMatch = meta.match(/caption=(?:"([^"]*)"|'([^']*)')/)
        const caption = captionMatch ? (captionMatch[1] || captionMatch[2]) : undefined

        codeSnippet = {
          code,
          runnable: runnable || undefined,
          caption,
        }
      }

      const secId = secTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      sections.push({
        id: secId,
        title: secTitle,
        content: textContent,
        codeSnippet,
      })
    }
  }

  const commonMistakes = []
  if (sectionsMap['common mistakes']) {
    const mistakeBlocks = sectionsMap['common mistakes'].split(/(?=^###\s+[^\r\n]+)/m).filter(Boolean)
    for (const block of mistakeBlocks) {
      const titleMatch = block.match(/^###\s+([^\r\n]+)/)
      if (!titleMatch) continue
      const mTitle = titleMatch[1].trim()
      const badMatch = block.match(/\*\*Bad:\*\*\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
      const badExplMatch = block.match(/\*\*Explanation:\*\*\s*([^\r\n]+)(?=\s*\*\*Good:)/)
      const goodMatch = block.match(/\*\*Good:\*\*\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
      const goodExplMatch = block.match(/\*\*Good:\*\*[\s\S]*?\*\*Explanation:\*\*\s*([^\r\n]+)/)
      const errorMatch = block.match(/\*\*Compiler Error:\*\*\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)

      if (badMatch && goodMatch) {
        commonMistakes.push({
          title: mTitle,
          badCode: badMatch[1].trim(),
          badExplanation: badExplMatch ? badExplMatch[1].trim() : '',
          goodCode: goodMatch[1].trim(),
          goodExplanation: goodExplMatch ? goodExplMatch[1].trim() : '',
          compilerErrorSnippet: errorMatch ? errorMatch[1].trim() : undefined,
        })
      }
    }
  }

  const keyTakeaways = []
  if (sectionsMap['key takeaways']) {
    for (const line of sectionsMap['key takeaways'].split(/\r?\n/)) {
      const trimmed = line.trim()
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        keyTakeaways.push(trimmed.replace(/^[-*]\s*/, ''))
      }
    }
  }

  const quests = []
  if (sectionsMap['quests']) {
    const questBlocks = sectionsMap['quests'].split(/(?=^##\s+Quest:\s+[^\r\n]+)/m).filter(Boolean)
    for (const block of questBlocks) {
      const idMatch = block.match(/^##\s+Quest:\s+([^\r\n]+)/)
      if (!idMatch) continue
      const qId = idMatch[1].trim()
      const typeMatch = block.match(/\*\*Type:\*\*\s*([^\r\n]+)/)
      const titleMatch = block.match(/\*\*Title:\*\*\s*([^\r\n]+)/)
      const promptMatch = block.match(/\*\*Prompt:\*\*\s*([^\r\n]+)/)
      const qType = typeMatch ? typeMatch[1].trim() : 'coding'
      const qTitle = titleMatch ? titleMatch[1].trim() : ''
      const qPrompt = promptMatch ? promptMatch[1].trim() : ''

      if (qType === 'coding') {
        const sigMatch = block.match(/\*\*Signature:\*\*\s*`([^`]+)`/)
        const starterMatch = block.match(/###\s+Starter Code\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
        const harnessMatch = block.match(/###\s+Test Harness\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
        const solutionMatch = block.match(/###\s+Solution\s*\r?\n```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)```/)
        const walkthroughMatch = block.match(/###\s+Walkthrough\s*\r?\n([\s\S]*?)(?=(?:###|\Z|$))/)

        const hints = []
        const hintsMatch = block.match(/###\s+Hints\s*\r?\n([\s\S]*?)(?=(?:###|\Z|$))/)
        if (hintsMatch) {
          for (const line of hintsMatch[1].split(/\r?\n/)) {
            const trimmed = line.trim()
            if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
              hints.push(trimmed.replace(/^[-*]\s*/, ''))
            }
          }
        }

        quests.push({
          id: qId,
          type: 'coding',
          title: qTitle,
          prompt: qPrompt,
          signature: sigMatch ? sigMatch[1].trim() : '',
          starterCode: starterMatch ? starterMatch[1].trim() : '',
          testHarness: harnessMatch ? harnessMatch[1].trim() : '',
          solutionCode: solutionMatch ? solutionMatch[1].trim() : '',
          solutionWalkthrough: walkthroughMatch ? walkthroughMatch[1].trim() : '',
          hints,
        })
      } else if (qType === 'quiz') {
        const codeMatch = block.match(/```rust\r?\n([\s\S]*?)```/)
        const hintMatch = block.match(/\*\*Hint:\*\*\s*([^\r\n]+)/)
        const explMatch = block.match(/\*\*Explanation:\*\*\s*([^\r\n]+)/)

        const options = []
        let correctIndex = 0
        const optLines = block.split(/\r?\n/).filter((l) => l.trim().startsWith('- [') || l.trim().startsWith('* ['))
        optLines.forEach((l, idx) => {
          const isCorrect = l.includes('[x]') || l.includes('[X]')
          if (isCorrect) correctIndex = idx
          let text = l.replace(/^[-*]\s*\[[ xX]\]\s*/, '').replace(/^[A-D][).:-]\s*/, '').trim()
          const label = String.fromCharCode(65 + idx)
          options.push({ label, text })
        })

        quests.push({
          id: qId,
          type: 'quiz',
          title: qTitle,
          prompt: qPrompt,
          codeSnippet: codeMatch ? codeMatch[1].trim() : undefined,
          options,
          correctIndex,
          hint: hintMatch ? hintMatch[1].trim() : '',
          explanation: explMatch ? explMatch[1].trim() : '',
        })
      }
    }
  }

  return {
    id,
    chapterId,
    chapterNumber,
    lessonNumber,
    title,
    tagline,
    readTimeMinutes,
    difficulty,
    tags,
    overview,
    sections,
    commonMistakes,
    keyTakeaways,
    quests,
  }
}

export function loadTutorialChaptersFromDir(tutorialsDir) {
  if (!existsSync(tutorialsDir)) return []
  const chapterDirs = readdirSync(tutorialsDir)
    .map((name) => join(tutorialsDir, name))
    .filter((p) => {
      try {
        return statSync(p).isDirectory()
      } catch {
        return false
      }
    })
    .sort()

  const chapters = []
  for (const chapterPath of chapterDirs) {
    const metaFile = join(chapterPath, 'chapter.json')
    if (!existsSync(metaFile)) continue
    const meta = JSON.parse(readFileSync(metaFile, 'utf-8'))

    const lessonFiles = readdirSync(chapterPath)
      .filter((f) => f.endsWith('.md'))
      .sort()

    const lessons = []
    for (const f of lessonFiles) {
      const lesson = parseLessonMarkdown(join(chapterPath, f))
      if (lesson.id && lesson.title) {
        lessons.push(lesson)
      }
    }

    lessons.sort((a, b) => a.lessonNumber - b.lessonNumber)
    chapters.push({
      ...meta,
      lessons,
    })
  }

  chapters.sort((a, b) => a.number - b.number)
  return chapters
}
