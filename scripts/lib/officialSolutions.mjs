import { readFileSync } from 'node:fs'

export function loadSolutionCodes(file) {
  const text = readFileSync(file, 'utf8')
  const map = {}
  const re = /"([^"]+)":\s*\{\s*"solutionCode":\s*"((?:\\.|[^"\\])*)"/g
  let m
  while ((m = re.exec(text))) {
    map[m[1]] = JSON.parse(`"${m[2]}"`)
  }
  return map
}

export function loadSolutionAliases(file) {
  const text = readFileSync(file, 'utf8')
  const start = text.indexOf('const CONTEST_ID_ALIASES')
  if (start < 0) return {}
  const slice = text.slice(start)
  const map = {}
  const re = /'([^']+)':\s*'([^']+)'/g
  let m
  while ((m = re.exec(slice))) {
    map[m[1]] = m[2]
  }
  return map
}

export function resolveOfficialSolution(id, solutions, aliases) {
  if (solutions[id]) return solutions[id]
  const alias = aliases[id]
  if (alias && solutions[alias]) return solutions[alias]
  const stripped = id.replace(/^\d{4}-\d{2}-\d{2}-/, '')
  if (solutions[stripped]) return solutions[stripped]
  const strippedAlias = aliases[stripped]
  if (strippedAlias && solutions[strippedAlias]) return solutions[strippedAlias]
  return undefined
}

export function loadInteractiveHarnesses(file) {
  const text = readFileSync(file, 'utf8')
  const quests = []
  const re = /\n\s*id:\s*'([^']+)'[\s\S]*?testHarness:\s*`([\s\S]*?)`/g
  let m
  while ((m = re.exec(text))) {
    quests.push({ id: m[1], testHarness: m[2] })
  }
  return quests
}

export function withSolutionHarness(testHarness, solution) {
  return testHarness.replace('{{SOLUTION}}', solution.trimEnd())
}
