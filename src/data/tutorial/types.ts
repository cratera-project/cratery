export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export type CommonMistake = {
  title: string
  badCode: string
  badExplanation: string
  goodCode: string
  goodExplanation: string
  compilerErrorSnippet?: string
}

export type LessonSection = {
  id: string
  title: string
  content: string
  codeSnippet?: {
    code: string
    caption?: string
    runnable?: boolean
  }
}

export type TutorialQuizQuest = {
  id: string
  type: 'quiz'
  title: string
  prompt: string
  codeSnippet?: string
  options: Array<{
    label: 'A' | 'B' | 'C' | 'D'
    text: string
  }>
  correctIndex: number
  explanation: string
  hint: string
  xpReward?: number
}

export type TutorialCodingQuest = {
  id: string
  type: 'coding'
  title: string
  prompt: string
  signature: string
  starterCode: string
  testHarness: string
  hints: string[]
  solutionCode: string
  solutionWalkthrough: string
  xpReward?: number
}

export type TutorialQuest = TutorialQuizQuest | TutorialCodingQuest

export type TutorialLesson = {
  id: string
  chapterId: string
  chapterNumber: number
  lessonNumber: number
  title: string
  tagline: string
  readTimeMinutes: number
  difficulty: DifficultyLevel
  tags: string[]
  overview: string
  sections: LessonSection[]
  commonMistakes: CommonMistake[]
  keyTakeaways: string[]
  quests: TutorialQuest[]
}

export type TutorialChapter = {
  id: string
  number: number
  title: string
  description: string
  icon: string
  lessons: TutorialLesson[]
}
