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

    const data = (await res.json()) as Record<string, unknown>
    const testFailures = Array.isArray(data.testFailures)
      ? (data.testFailures as JudgeExecutionResult['testFailures'])
      : undefined

    return {
      passed: data.passed === true || data.verdict === 'AC',
      compilationError:
        typeof data.compilationError === 'string'
          ? data.compilationError
          : data.status === 'Compilation Error' && typeof data.message === 'string'
            ? data.message
            : undefined,
      testFailures,
      executionTimeMs:
        typeof data.executionTime === 'number'
          ? Math.round(data.executionTime / 1000)
          : typeof data.executionTimeMs === 'number'
            ? data.executionTimeMs
            : undefined,
      stdout: typeof data.stdout === 'string' ? data.stdout : undefined,
      stderr:
        typeof data.stderr === 'string'
          ? data.stderr
          : typeof data.error === 'string'
            ? data.error
            : undefined,
      unavailable: data.unavailable === true,
    }
  } catch (err: unknown) {
    return {
      passed: false,
      error: `Failed to connect to microVM judge: ${err instanceof Error ? err.message : String(err)}`,
    }
  }
}
