import { type Plugin } from 'vite'
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import type { IncomingMessage } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { BUILTIN_ANSWERS } from './functions/lib/builtinCorrect.ts'


export function localRustPlugin(): Plugin {
  return {
    name: 'cratery-local-rust-runner',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]

        
        if (url === '/api/grade-run' || url === '/api/grade-submit') {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          try {
            const raw = await readBody(req)
            let body: { code?: string; harness?: string; contestId?: string; language?: string } = {}
            try {
              body = JSON.parse(raw)
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
              return
            }

            const code = body.code || ''
            const harness = body.harness || ''
            const mode = url === '/api/grade-submit' ? 'submit' : 'run'

            if (!code.trim() || !harness.trim()) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'code and harness are required' }))
              return
            }

            const sourceCode = harness.includes('{{SOLUTION}}')
              ? harness.replace('{{SOLUTION}}', code)
              : `${code}\n${harness}`

            const result = await executeLocalRust(sourceCode, mode)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result))
          } catch (err: unknown) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: err instanceof Error ? err.message : 'Local execution failed',
              }),
            )
          }
          return
        }

        
        if (url === '/api/quest-answer' && req.method === 'POST') {
          try {
            const raw = await readBody(req)
            const body = JSON.parse(raw)
            const questionId = body.question_id
            const selectedIndex = body.selected_index

            const builtin = BUILTIN_ANSWERS[questionId]
            if (builtin) {
              const isCorrect = selectedIndex === builtin.correctIndex
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                status: 'ok',
                answer: {
                  is_correct: isCorrect,
                  correct_index: builtin.correctIndex,
                  explanation: builtin.explanation,
                  xp_earned: isCorrect ? 10 : 0,
                  total_xp: isCorrect ? 10 : 0,
                  rank: 'Rust Novice',
                },
              }))
              return
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'ok' }))
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid quest request' }))
          }
          return
        }

        
        if (url === '/api/guest-clearance') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
          return
        }

        if (url === '/api/public-profile') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            status: 'ok',
            profile: {
              id: 'local-dev-user-id',
              username: 'local_rustacean',
              display_name: 'Local Rustacean',
              avatar: null,
              rank: 'Rust Ace',
              total_xp: 0,
              created_at: new Date().toISOString(),
            },
            stats: {
              total_xp: 0,
              quests_authored: 0,
              solves_taught: 0,
              rival_wins: 0,
              rival_losses: 0,
            },
            quests: [],
          }))
          return
        }

        if (url === '/api/avatar') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok' }))
          return
        }

        if (url === '/api/notifications' || url === '/api/notifications/read') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', notifications: [], unread: 0 }))
          return
        }

        if (url === '/api/preferences') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', preferences: { newsletter_opt_in: true } }))
          return
        }

        if (url === '/api/user-quests') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', quests: [] }))
          return
        }

        if (url === '/api/user-quest') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', quest: { id: `uq_local_${Date.now()}`, slug: 'local-quest' } }))
          return
        }

        if (url === '/api/community-quests') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', quests: [], total: 0 }))
          return
        }

        if (url?.startsWith('/api/community-quest')) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Quest not found' }))
          return
        }

        if (url === '/api/quest-stats' || url === '/api/quest-stats-batch') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', solve_count: 0, correct_count: 0, stats: {} }))
          return
        }

        if (url === '/api/quest-comments' || url === '/api/quest-report' || url === '/api/comment-report') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', comments: [] }))
          return
        }

        if (url?.startsWith('/api/rival')) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', rival: { id: 'local-rival-id', status: 'ready', questions: [] } }))
          return
        }

        if (url === '/api/contest-leaderboard' || url === '/api/leaderboard' || url === '/api/site-stats') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', entries: [], stats: { total_users: 1, total_solves: 0 } }))
          return
        }

        
        if (url?.startsWith('/auth/')) {
          const authRoute = url.replace('/auth', '')
          if (req.method === 'POST') {
            const raw = await readBody(req)
            let body: Record<string, unknown> = {}
            try {
              const parsed: unknown = JSON.parse(raw)
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                body = parsed as Record<string, unknown>
              }
            } catch {
              body = {}
            }

            const email = typeof body.email === 'string' ? body.email : 'local@cratera.org'
            const username =
              typeof body.username === 'string'
                ? body.username
                : typeof body.email === 'string'
                  ? body.email.split('@')[0]
                  : 'local_rustacean'
            const mockUser = {
              id: 'local-dev-user-id',
              email,
              username,
            }
            const mockToken = 'local-dev-offline-jwt-token'

            if (authRoute === '/login' || authRoute === '/signup' || authRoute === '/verify') {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                user: mockUser,
                token: mockToken,
                status: 'ok',
              }))
              return
            }

            if (authRoute === '/forgot-password' || authRoute === '/reset-password' || authRoute === '/resend-verification') {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ status: 'ok', message: 'Local mode: action completed' }))
              return
            }
          }
        }

        
        next()
      })
    },
  }
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}

interface LocalRunResult {
  compilationSuccess: boolean
  compilationError: string | null
  passed: boolean
  status: string
  verdict: string
  stdout: string | null
  stderr: string | null
  executionTime: number
  compileMs: number
  wallMs: number
  restored: boolean
  tier: 'free'
  scoreUpdated?: boolean
  xpEarned?: number
}

function executeLocalRust(sourceCode: string, mode: 'run' | 'submit'): Promise<LocalRunResult> {
  return new Promise((resolve) => {
    const runId = `cratery_${Date.now()}_${randomUUID().slice(0, 8)}`
    const workDir = join(tmpdir(), runId)
    const isWindows = process.platform === 'win32'
    const srcFile = join(workDir, 'solution.rs')
    const binFile = join(workDir, isWindows ? 'solution.exe' : 'solution')

    try {
      mkdirSync(workDir, { recursive: true })
      writeFileSync(srcFile, sourceCode, 'utf-8')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      return resolve({
        compilationSuccess: false,
        compilationError: `Failed to create temp directory: ${message}`,
        passed: false,
        status: 'Compilation Error',
        verdict: 'CE',
        stdout: null,
        stderr: message,
        executionTime: 0,
        compileMs: 0,
        wallMs: 0,
        restored: false,
        tier: 'free',
      })
    }

    const tStart = Date.now()

    
    const rustcArgs = [
      '--edition', '2024',
      '-O',
      '-o', binFile,
      srcFile,
    ]

    const rustc = spawn('rustc', rustcArgs, { cwd: workDir })
    let compileStderr = ''
    let compileStdout = ''

    rustc.stdout.on('data', (d) => { compileStdout += d.toString() })
    rustc.stderr.on('data', (d) => { compileStderr += d.toString() })

    const compileTimeout = setTimeout(() => {
      rustc.kill('SIGKILL')
      compileStderr += '\nCompilation timed out (30s)'
    }, 30_000)

    rustc.on('error', (err) => {
      clearTimeout(compileTimeout)
      cleanupDir(workDir)
      return resolve({
        compilationSuccess: false,
        compilationError: `Could not invoke 'rustc'. Ensure Rust is installed and in your PATH (https://rustup.rs).\nError: ${err.message}`,
        passed: false,
        status: 'Compilation Error',
        verdict: 'CE',
        stdout: null,
        stderr: err.message,
        executionTime: 0,
        compileMs: Date.now() - tStart,
        wallMs: Date.now() - tStart,
        restored: false,
        tier: 'free',
      })
    })

    rustc.on('close', (code) => {
      clearTimeout(compileTimeout)
      const tCompileEnd = Date.now()
      const compileMs = tCompileEnd - tStart

      if (code !== 0) {
        cleanupDir(workDir)
        return resolve({
          compilationSuccess: false,
          compilationError: compileStderr || compileStdout || 'Compilation failed',
          passed: false,
          status: 'Compilation Error',
          verdict: 'CE',
          stdout: compileStdout || null,
          stderr: compileStderr || null,
          executionTime: 0,
          compileMs,
          wallMs: compileMs,
          restored: false,
          tier: 'free',
        })
      }

      
      const execStart = Date.now()
      const proc = spawn(binFile, [], { cwd: workDir })
      let runStdout = ''
      let runStderr = ''

      proc.stdout.on('data', (d) => { runStdout += d.toString() })
      proc.stderr.on('data', (d) => { runStderr += d.toString() })

      const runTimeout = setTimeout(() => {
        proc.kill(isWindows ? undefined : 'SIGKILL')
        runStderr += '\nExecution timed out (10s)'
      }, 10_000)

      proc.on('close', (exitCode, signal) => {
        clearTimeout(runTimeout)
        const execMs = Date.now() - execStart
        const wallMs = Date.now() - tStart
        cleanupDir(workDir)

        let passed = exitCode === 0 && !signal
        let verdict = 'AC'
        let status = 'Passed'

        if (signal === 'SIGKILL' || runStderr.includes('timed out')) {
          passed = false
          verdict = 'TLE'
          status = 'Time Limit Exceeded'
        } else if (exitCode !== 0) {
          passed = false
          verdict = 'RE'
          status = 'Runtime Error'
        }

        resolve({
          compilationSuccess: true,
          compilationError: null,
          passed,
          status,
          verdict,
          stdout: runStdout || null,
          stderr: runStderr || null,
          executionTime: execMs,
          compileMs,
          wallMs,
          restored: false,
          tier: 'free',
          scoreUpdated: mode === 'submit' && passed,
          xpEarned: mode === 'submit' && passed ? 50 : undefined,
        })
      })
    })
  })
}

function cleanupDir(dir: string) {
  try {
    rmSync(dir, { recursive: true, force: true })
  } catch {
    /* ignore cleanup errors */
  }
}
