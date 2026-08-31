

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}


export function shuffledIndices(n: number, seed: string): number[] {
  const idx = Array.from({ length: n }, (_, i) => i)
  let s = hashSeed(seed) || 1
  for (let i = n - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

export type OrderableQuestion = {
  id: string
  correctIndex: number
  optionCount?: number
}

function wouldTriple(prev: number[], display: number): boolean {
  return prev.length >= 2 && prev[prev.length - 1] === display && prev[prev.length - 2] === display
}


export function pickPermutation(
  id: string,
  n: number,
  correctIndex: number,
  prevDisplayLetters: number[]
): number[] {
  for (let salt = 0; salt < 64; salt++) {
    const order = shuffledIndices(n, salt === 0 ? id : `${id}#${salt}`)
    const display = order.indexOf(correctIndex)
    if (display < 0) continue
    if (wouldTriple(prevDisplayLetters, display)) continue
    return order
  }
  return shuffledIndices(n, id)
}


export function optionDisplayOrder(sequence: OrderableQuestion[], questionId: string): number[] {
  const prev: number[] = []
  let result = [0, 1, 2, 3]
  for (const item of sequence) {
    const n = item.optionCount ?? 4
    const order = pickPermutation(item.id, n, item.correctIndex, prev)
    const display = order.indexOf(item.correctIndex)
    prev.push(display < 0 ? 0 : display)
    if (item.id === questionId) result = order
  }
  return result
}

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2
}


export function optionLengthBias(
  options: string[],
  correctIndex: number
): { warn: string | null; error: string | null } {
  const lens = options.map((o) => o.trim().length)
  if (lens.some((l) => l === 0) || correctIndex < 0 || correctIndex >= lens.length) {
    return { warn: null, error: null }
  }
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length
  const max = Math.max(...lens)
  const min = Math.min(...lens)
  const spread = mean > 0 ? (max - min) / mean : 0
  const maxCount = lens.filter((l) => l === max).length
  const correctLen = lens[correctIndex]!
  const otherMed = median(lens.filter((_, i) => i !== correctIndex))
  const ratio = otherMed > 0 ? correctLen / otherMed : 1

  if (spread > 0.35 || (maxCount === 1 && correctLen === max && ratio > 1.25)) {
    return {
      warn: null,
      error:
        'Options are uneven: the correct answer stands out by length. Shorten it and put reasoning in the explanation.',
    }
  }
  if (spread > 0.25 || (maxCount === 1 && correctLen === max && ratio > 1.15)) {
    return {
      warn: 'Tip: keep all four options similar length. Put “because…” detail in Explanation, not the correct option.',
      error: null,
    }
  }
  return { warn: null, error: null }
}
