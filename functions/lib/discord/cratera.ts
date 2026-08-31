import type { Env } from '../supabase'
import { trackCodeExecution } from '../executionStats'

export type JudgeExecutionResult = {
  passed?: boolean
  error?: string
  compilationError?: string
  testFailures?: Array<{ name: string; message: string }>
  executionTimeMs?: number
  stdout?: string
  stderr?: string
  unavailable?: boolean
}

export async function executeDiscordCode(
  env: Env,
  code: string,
  harness?: string
): Promise<JudgeExecutionResult> {
  const gradeUrl = env.GRADE_URL
  const internalKey = env.GRADE_INTERNAL_KEY

  if (!gradeUrl || !internalKey) {
    return {
      passed: false,
      error: 'Cratera microVM judge is not configured on this deployment (GRADE_URL missing).',
    }
  }

  const finalHarness =
    harness ||
    `{{SOLUTION}}

fn main() {
    // Discord direct code execution
}`

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${internalKey}`,
  }

  if (env.CF_ACCESS_CLIENT_ID && env.CF_ACCESS_CLIENT_SECRET) {
    requestHeaders['CF-Access-Client-Id'] = env.CF_ACCESS_CLIENT_ID
    requestHeaders['CF-Access-Client-Secret'] = env.CF_ACCESS_CLIENT_SECRET
  }

  try {
    const res = await fetch(`${gradeUrl}/harness`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        code,
        harness: finalHarness,
        mode: 'run',
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      return {
        passed: false,
        error: `Judge service returned status ${res.status}: ${errText.slice(0, 300)}`,
      }
    }

    trackCodeExecution(env)

    const data = (await res.json()) as Record<string, any>

    return {
      passed: data.passed === true || data.verdict === 'AC',
      compilationError: data.compilationError || (data.status === 'Compilation Error' ? data.message : undefined),
      testFailures: data.testFailures,
      executionTimeMs: typeof data.executionTime === 'number' ? Math.round(data.executionTime / 1000) : data.executionTimeMs,
      stdout: data.stdout,
      stderr: data.stderr || data.error,
      unavailable: data.unavailable === true,
    }
  } catch (err: any) {
    return {
      passed: false,
      error: `Failed to connect to microVM judge: ${err.message || String(err)}`,
    }
  }
}
