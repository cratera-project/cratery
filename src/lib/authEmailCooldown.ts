
export const RESEND_VERIFICATION_COOLDOWN_MS = 60_000
export const PASSWORD_RESET_COOLDOWN_MS = 5_000

const RESEND_STORAGE_KEY = 'cratery_verify_resend_at'

export function emailCooldownRemaining(lastSentAt: number, cooldownMs: number): number {
  const elapsed = Date.now() - lastSentAt
  if (elapsed >= cooldownMs) return 0
  return Math.ceil((cooldownMs - elapsed) / 1000)
}

export function emailCooldownMessage(seconds: number): string {
  return `Please wait ${seconds} seconds before trying again`
}

export function getStoredResendCooldown(): number {
  try {
    const raw = sessionStorage.getItem(RESEND_STORAGE_KEY)
    if (!raw) return 0
    return emailCooldownRemaining(Number(raw), RESEND_VERIFICATION_COOLDOWN_MS)
  } catch {
    return 0
  }
}

export function markResendSent(): void {
  try {
    sessionStorage.setItem(RESEND_STORAGE_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}
