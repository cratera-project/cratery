import { gradeRun, type GradeRunResult } from './grade'


export function hashSnippet(str: string): string {
  let hash = 5381
  const trimmed = str.trim()
  for (let i = 0; i < trimmed.length; i++) {
    hash = ((hash << 5) + hash) ^ trimmed.charCodeAt(i)
  }
  return (hash >>> 0).toString(16)
}

const SNIPPET_EDIT_PREFIX = 'cratery_snip_edit_'

export type SnippetState = {
  originalCode: string
  currentCode: string
  isEdited: boolean
}


export function loadSnippetDraft(originalCode: string, snippetId?: string): string {
  const hash = hashSnippet(originalCode)
  const storageKey = SNIPPET_EDIT_PREFIX + (snippetId ? `${snippetId}_${hash}` : hash)

  try {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null && saved !== originalCode) {
      return saved
    }
  } catch {
    /* ignore localStorage errors */
  }
  return originalCode
}


export function saveSnippetDraft(originalCode: string, newCode: string, snippetId?: string): void {
  const hash = hashSnippet(originalCode)
  const storageKey = SNIPPET_EDIT_PREFIX + (snippetId ? `${snippetId}_${hash}` : hash)

  try {
    if (newCode === originalCode) {
      localStorage.removeItem(storageKey)
    } else {
      localStorage.setItem(storageKey, newCode)
    }
  } catch {
    /* ignore */
  }
}


export function resetSnippetDraft(originalCode: string, snippetId?: string): void {
  const hash = hashSnippet(originalCode)
  const storageKey = SNIPPET_EDIT_PREFIX + (snippetId ? `${snippetId}_${hash}` : hash)

  try {
    localStorage.removeItem(storageKey)
  } catch {
    /* ignore */
  }
}


export function prepareSnippetHarness(code: string): { harness: string; code: string } {
  const trimmed = code.trim()

  
  if (trimmed.includes('fn main(') || trimmed.includes('fn main ()') || trimmed.includes('#[test]')) {
    return {
      harness: '{{SOLUTION}}',
      code: trimmed,
    }
  }

  const lines = trimmed.split('\n')
  const topLevelLines: string[] = []
  const mainLines: string[] = []

  let inTopLevelHeader = false
  let braceDepth = 0
  let pendingAttributes: string[] = []

  const isTopLevelStart = (line: string): boolean => {
    const l = line.trim()
    if (!l || l.startsWith('//') || l.startsWith('/*')) return false
    return (
      /^pub(\([^)]+\))?\s+/.test(l) ||
      /^(use|mod|extern|type|const|static|struct|enum|union|trait|impl|macro_rules!)\b/.test(l) ||
      /^(unsafe\s+)?(extern(\s+"[^"]+")?\s+)?(fn|trait|impl)\b/.test(l) ||
      /^(async\s+)?(const\s+)?(unsafe\s+)?(extern(\s+"[^"]+")?\s+)?fn\b/.test(l) ||
      /^(unsafe\s+)?extern(\s+"[^"]+")?\s*\{/.test(l)
    )
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const l = line.trim()

    
    if (braceDepth === 0 && !inTopLevelHeader && (l.startsWith('#[') || l.startsWith('#!['))) {
      pendingAttributes.push(line)
      continue
    }

    if (braceDepth === 0 && !inTopLevelHeader && isTopLevelStart(l)) {
      if (pendingAttributes.length > 0) {
        topLevelLines.push(...pendingAttributes)
        pendingAttributes = []
      }
      topLevelLines.push(line)
      const openCount = (l.match(/\{/g) || []).length
      const closeCount = (l.match(/\}/g) || []).length
      braceDepth += openCount - closeCount
      if (braceDepth === 0 && !l.endsWith(';') && !l.includes(';')) {
        inTopLevelHeader = true
      }
    } else if (inTopLevelHeader) {
      topLevelLines.push(line)
      const openCount = (l.match(/\{/g) || []).length
      const closeCount = (l.match(/\}/g) || []).length
      braceDepth += openCount - closeCount
      if (braceDepth > 0 || l.endsWith(';') || l.includes(';')) {
        inTopLevelHeader = false
      }
    } else if (braceDepth > 0) {
      topLevelLines.push(line)
      const openCount = (l.match(/\{/g) || []).length
      const closeCount = (l.match(/\}/g) || []).length
      braceDepth = Math.max(0, braceDepth + openCount - closeCount)
    } else {
      if (pendingAttributes.length > 0) {
        mainLines.push(...pendingAttributes)
        pendingAttributes = []
      }
      mainLines.push(line)
    }
  }

  if (pendingAttributes.length > 0) {
    if (topLevelLines.length > 0 && mainLines.length === 0) {
      topLevelLines.push(...pendingAttributes)
    } else {
      mainLines.push(...pendingAttributes)
    }
  }

  
  if (mainLines.length === 0 || mainLines.every((l) => !l.trim() || l.trim().startsWith('//'))) {
    return {
      harness: `{{SOLUTION}}
#[allow(unused_variables, dead_code, unused_mut)]
fn main() {}`,
      code: trimmed,
    }
  }

  if (topLevelLines.length === 0) {
    return {
      harness: `#[allow(unused_variables, dead_code, unused_mut, unreachable_code)]
fn main() {
{{SOLUTION}}
}`,
      code: trimmed,
    }
  }

  
  return {
    harness: `${topLevelLines.join('\n')}

#[allow(unused_variables, dead_code, unused_mut, unreachable_code)]
fn main() {
{{SOLUTION}}
}`,
    code: mainLines.join('\n'),
  }
}


export async function executeSnippet(code: string): Promise<GradeRunResult> {
  const { harness, code: runnableCode } = prepareSnippetHarness(code)
  return await gradeRun({
    code: runnableCode,
    harness,
    language: 'rust',
  })
}
