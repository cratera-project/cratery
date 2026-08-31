import { isLocalDev } from './turnstile'

let memoryCleared = false

export async function fetchGuestClearance(): Promise<boolean> {
  if (memoryCleared || isLocalDev) return true
  try {
    const res = await fetch('/api/guest-clearance', { credentials: 'same-origin' })
    if (!res.ok) return false
    const body = (await res.json()) as { ok?: boolean }
    memoryCleared = Boolean(body.ok)
    return memoryCleared
  } catch {
    return false
  }
}

export function markGuestCleared(): void {
  memoryCleared = true
}

export function clearGuestClearedMemory(): void {
  memoryCleared = false
}
