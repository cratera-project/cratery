import { categories } from '../data/categories'
import { questions } from '../data/questions'

const LAST_TOPIC_KEY = 'cratery_last_topic'

export function rememberTopic(slug: string) {
  try {
    localStorage.setItem(LAST_TOPIC_KEY, slug)
  } catch {
    /* ignore */
  }
}

export type ContinueTarget = {
  href: string
  label: string
  detail: string
  categorySlug: string
  categoryName: string
  icon: string
}

function firstUnansweredIn(slug: string, answeredIds: Set<string>) {
  return questions.find(
    (q) => q.categorySlug === slug && !answeredIds.has(q.id)
  )
}


export function getContinueTarget(
  answersByQuestionId: Record<string, unknown>
): ContinueTarget {
  const answeredIds = new Set(Object.keys(answersByQuestionId))
  let lastSlug: string | null = null
  try {
    lastSlug = localStorage.getItem(LAST_TOPIC_KEY)
  } catch {
    lastSlug = null
  }

  const ordered = [
    ...(lastSlug ? categories.filter((c) => c.slug === lastSlug) : []),
    ...categories.filter((c) => c.slug !== lastSlug),
  ]

  for (const cat of ordered) {
    const next = firstUnansweredIn(cat.slug, answeredIds)
    if (!next) continue
    const catQuestions = questions.filter((q) => q.categorySlug === cat.slug)
    const total = catQuestions.length
    const done = catQuestions.filter((q) => answeredIds.has(q.id)).length
    const isResume = done > 0
    return {
      href: `/category/${cat.slug}/question/${next.id}`,
      label: isResume ? `Continue ${cat.name}` : `Start ${cat.name}`,
      detail: isResume
        ? `${done}/${total} done. Pick up the next question`
        : `${total} questions · free · no signup`,
      categorySlug: cat.slug,
      categoryName: cat.name,
      icon: cat.icon,
    }
  }

  
  const first = categories[0]
  return {
    href: '/fated-five',
    label: 'Practice 5',
    detail: 'All topics cleared. Train with random questions',
    categorySlug: first?.slug ?? 'ownership',
    categoryName: first?.name ?? 'Ownership',
    icon: first?.icon ?? '🔒',
  }
}
