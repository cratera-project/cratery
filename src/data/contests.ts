import { withSolutionHarness } from '../lib/playground'
import { getInteractiveQuest } from './interactiveQuests'
import { compiledContests } from './generated/contests'

export type ContestExample = {
  input: string
  output: string
  explanation?: string
}

export type ContestSolution = {
  solutionCode: string
  solutionWalkthrough?: string
}

export const SUPPORTED_LANGUAGES = [
  'rust',
  'python',
  'cpp',
  'c',
  'go',
  'javascript',
  'typescript',
  'java',
  'csharp',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  rust: 'Rust',
  python: 'Python',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  csharp: 'C#',
}

export const LANGUAGE_MONACO_IDS: Record<SupportedLanguage, string> = {
  rust: 'rust',
  python: 'python',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  csharp: 'csharp',
}

export type LanguageStarterMap = Partial<Record<SupportedLanguage, string>>

export type Contest = {
  id: string
  title: string
  weekLabel: string
  difficulty: 1 | 2 | 3
  opensAt: string
  closesAt: string
  prompt: string
  signature: string
  examples: ContestExample[]
  starterCode: string
  starterCodes?: LanguageStarterMap
  supportedLanguages?: readonly SupportedLanguage[]
  testHarness: string
  solutionUnlocksAt?: string
  loadSolution?: () => Promise<ContestSolution>
}

export function getContestLanguages(contest: Contest): readonly SupportedLanguage[] {
  return contest.supportedLanguages ?? SUPPORTED_LANGUAGES
}

export function getStarterCode(contest: Contest, lang: SupportedLanguage): string {
  return contest.starterCodes?.[lang] ?? contest.starterCode
}

export const contests: Contest[] = compiledContests

export function getContest(id: string): Contest | undefined {
  return contests.find((c) => c.id === id) ?? getInteractiveQuest(id)
}

export function getCurrentContest(): Contest {
  const now = Date.now()
  return (
    contests.find((c) => {
      const open = Date.parse(c.opensAt)
      const close = Date.parse(c.closesAt)
      return now >= open && now < close
    }) ?? contests[0]
  )
}

export function withTests(contest: Contest, solution: string): string {
  return withSolutionHarness(contest.testHarness, solution)
}
