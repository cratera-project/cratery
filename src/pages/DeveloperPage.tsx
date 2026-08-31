import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, RotateCcw, Trash2, Play, Terminal, BookOpen, Code2 } from 'lucide-react'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { SEO } from '../components/SEO'
import { useAuth } from '../context/AuthContext'
import { customAuth } from '../lib/customAuth'
import { AuthModal } from '../components/AuthModal'
import { copyText } from '../lib/share'

interface DeveloperStatus {
  hasKey: boolean
  apiKey: {
    id: string
    prefix: string
    name: string
    createdAt: string
  } | null
  quota: {
    limit: number
    used: number
    remaining: number
    resetsAt: string
    rateLimitPerMin?: number
  }
}

interface ExecutionResult {
  verdict?: string
  status?: string
  executionTime?: number
  memoryKb?: number
  compileMs?: number
  bootMs?: number
  wallMs?: number
  stdout?: string
  stderr?: string
  compileStderr?: string
  error?: string
}

const RUNTIMES = [
  {
    id: 'rust',
    name: 'Rust',
    version: 'Rust 1.97 (Edition 2024)',
    code: 'fn main() {\n    println!("Hello from Cratera microVM!");\n}',
  },
  {
    id: 'python',
    name: 'Python',
    version: 'Python 3.12 (Supported)',
    code: 'print("Hello from Cratera microVM!")',
  },
  {
    id: 'cpp',
    name: 'C++',
    version: 'GCC 13.3 (C++20)',
    code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from Cratera microVM!" << std::endl;\n    return 0;\n}',
  },
  {
    id: 'c',
    name: 'C',
    version: 'GCC 13.3 (C17)',
    code: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello from Cratera microVM!\\n");\n    return 0;\n}',
  },
  {
    id: 'go',
    name: 'Go',
    version: 'Go 1.22 (Supported)',
    code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Cratera microVM!")\n}',
  },
  {
    id: 'node',
    name: 'JavaScript',
    version: 'Node.js 24 LTS (V8)',
    code: 'console.log("Hello from Cratera microVM!");',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    version: 'TypeScript 5.x (esbuild)',
    code: 'const greeting: string = "Hello from Cratera microVM!";\nconsole.log(greeting);',
  },
  {
    id: 'java',
    name: 'Java',
    version: 'OpenJDK 21 LTS',
    code: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello from Cratera microVM!");\n    }\n}',
  },
  {
    id: 'csharp',
    name: 'C#',
    version: 'Mono 6.8 (C# 7+)',
    code: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from Cratera microVM!");\n    }\n}',
  },
]

export function DeveloperPage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [status, setStatus] = useState<DeveloperStatus | null>(null)
  const [rawNewKey, setRawNewKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState(false)
  const [selectedLang, setSelectedLang] = useState(RUNTIMES[0])
  const [snippetFormat, setSnippetFormat] = useState<'curl' | 'fetch' | 'python'>('curl')
  const [executing, setExecuting] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [keyError, setKeyError] = useState<string | null>(null)

  const fetchStatus = async () => {
    const token = customAuth.getToken()
    if (!token) return
    try {
      const res = await fetch('/api/developer/status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (user) {
      fetchStatus()
    } else {
      setStatus(null)
    }
  }, [user])

  const handleCreateKey = async () => {
    const token = customAuth.getToken()
    if (!token) return
    setKeyError(null)
    try {
      const res = await fetch('/api/developer/keys', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setRawNewKey(data.key)
        fetchStatus()
      } else {
        setKeyError(data.error || 'Failed to generate key')
      }
    } catch {
      setKeyError('Network error generating key')
    }
  }

  const handleRevokeKey = async () => {
    const token = customAuth.getToken()
    if (!token) return
    if (!confirm('Revoke your API key? Applications using it will stop working immediately.')) return
    try {
      const res = await fetch('/api/developer/keys', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setRawNewKey(null)
        fetchStatus()
      }
    } catch {
      // ignore
    }
  }

  const handleTestRun = async () => {
    const token = customAuth.getToken()
    if (!token && !status?.apiKey) {
      setShowAuthModal(true)
      return
    }
    setExecuting(true)
    setResult(null)
    try {
      const authHeader = rawNewKey ? `Bearer ${rawNewKey}` : `Bearer ${token}`
      const res = await fetch('/api/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          language: selectedLang.id,
          code: selectedLang.code,
        }),
      })
      const data = await res.json()
      setResult(data)
      if (user) {
        fetchStatus()
      }
    } catch (err: unknown) {
      setResult({ error: (err as Error)?.message || 'Network error' })
    } finally {
      setExecuting(false)
    }
  }

  const activeKey = rawNewKey || status?.apiKey?.prefix || 'YOUR_API_KEY'

  const curlCode = `curl -X POST https://cratery.cratera.org/api/v1/execute \\
  -H "Authorization: Bearer ${activeKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(
    {
      language: selectedLang.id,
      code: selectedLang.code,
    },
    null,
    2
  )}'`

  const fetchCode = `const res = await fetch('https://cratery.cratera.org/api/v1/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${activeKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    language: '${selectedLang.id}',
    code: ${JSON.stringify(selectedLang.code)}
  })
});

const data = await res.json();
console.log(data.stdout);`

  const pythonCode = `import requests

res = requests.post(
    "https://cratery.cratera.org/api/v1/execute",
    headers={"Authorization": "Bearer ${activeKey}"},
    json={
        "language": "${selectedLang.id}",
        "code": ${JSON.stringify(selectedLang.code)}
    }
)

data = res.json()
print(data.get("stdout"))`

  const activeSnippet =
    snippetFormat === 'curl'
      ? curlCode
      : snippetFormat === 'fetch'
        ? fetchCode
        : pythonCode

  const copySnippet = async () => {
    await copyText(activeSnippet)
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  const copyKey = async () => {
    if (!rawNewKey) return
    await copyText(rawNewKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const quotaLimit = status?.quota.limit ?? 250
  const quotaUsed = status?.quota.used ?? 0
  const quotaRemaining = Math.max(0, quotaLimit - quotaUsed)
  const quotaPct = Math.min(100, Math.round((quotaUsed / quotaLimit) * 100))

  return (
    <div className="space-y-8">
      <SEO
        title="Cratera API: Code Execution Sandbox"
        description="Run code in isolated Linux microVMs via HTTP. Fast, simple, and safe code execution for Rust, Python, C++, C, Go, JavaScript, TypeScript, Java, and C#."
      />

      {/* Header */}
      <div className="border-b-2 border-night-edge pb-5">
        <h1 className="font-pixel text-xl uppercase tracking-wider text-ink sm:text-2xl">
          Cratera API
        </h1>
        <p className="mt-1 font-code text-sm text-ink-dim sm:text-base">
          Send code in a POST request, get stdout and execution benchmarks back in milliseconds.
        </p>
      </div>

      {/* Top Cards: Key & Quota */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* API Key Card */}
        <PixelPanel className="flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[11px] uppercase text-ink">API Key</span>
            </div>
            <p className="font-code text-xs text-ink-dim">
              Header: <code className="text-rust-orange">Authorization: Bearer cr_live_...</code>
            </p>
          </div>

          {!user ? (
            <div className="space-y-2">
              <PixelButton onClick={() => setShowAuthModal(true)} variant="primary" className="w-full text-xs">
                Log In to Get API Key
              </PixelButton>
            </div>
          ) : rawNewKey ? (
            <div className="space-y-2.5">
              <div className="space-y-2 border border-rust-orange bg-night p-3">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[9px] uppercase text-rust-orange">
                    Your New Key (Copy Now)
                  </span>
                  <button onClick={copyKey} className="font-code text-xs text-ink hover:text-rust-orange flex items-center gap-1">
                    {copiedKey ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copiedKey ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="font-code text-xs text-ink break-all select-all">{rawNewKey}</div>
              </div>
              <p className="font-code text-[11px] text-yellow-400">
                Note: This full key is only displayed once and cannot be recovered. Save it in your environment variables. You can roll or regenerate a new key at any time.
              </p>
            </div>
          ) : status?.apiKey ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between border border-night-edge bg-night p-3">
                <span className="font-code text-xs text-ink">{status.apiKey.prefix}</span>
                <div className="flex items-center gap-2">
                  <PixelButton onClick={handleCreateKey} size="sm" variant="secondary" className="!px-2 !py-1 text-xs" title="Regenerate API Key">
                    <RotateCcw className="h-3 w-3 mr-1 inline" /> Roll
                  </PixelButton>
                  <PixelButton onClick={handleRevokeKey} size="sm" variant="secondary" className="!px-2 !py-1 text-xs !text-red-400" title="Revoke API Key">
                    <Trash2 className="h-3 w-3 inline" />
                  </PixelButton>
                </div>
              </div>
              <p className="font-code text-[11px] text-ink-faint">
                Full keys are hidden for security. Click <strong>Roll</strong> to generate a fresh one.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <PixelButton onClick={handleCreateKey} variant="primary" className="w-full text-xs">
                Generate API Key
              </PixelButton>
              <p className="font-code text-[11px] text-ink-faint">
                Keys are shown once upon creation. Store them securely in your app.
              </p>
            </div>
          )}

          {keyError && (
            <p className="font-code text-xs text-red-400 bg-red-500/10 p-2 border border-red-500/30">
              {keyError}
            </p>
          )}
        </PixelPanel>

        {/* Daily Quota Card */}
        <PixelPanel className="flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[11px] uppercase text-ink">Daily Requests</span>
              <span className="font-code text-[11px] text-ink-dim">Resets 00:00 UTC</span>
            </div>
            <p className="font-code text-xs text-ink-dim">
              Standard quota: 250 requests per day (15 req/min). Contact us if you need custom limits.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-pixel text-xl text-ink">
                {quotaUsed} <span className="font-code text-xs text-ink-dim">/ {quotaLimit} used</span>
              </span>
              <span className="font-code text-xs text-ink-dim">{quotaRemaining} remaining</span>
            </div>
            <div className="h-2 w-full border border-night-edge bg-night">
              <div
                className={`h-full ${quotaPct >= 100 ? 'bg-red-500' : 'bg-rust-orange'}`}
                style={{ width: `${Math.max(2, quotaPct)}%` }}
              />
            </div>
          </div>
        </PixelPanel>
      </div>

      {/* Quickstart Code Snippet Box & Live Test */}
      <PixelPanel className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-night-edge pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-rust-orange" />
            <span className="font-pixel text-[11px] uppercase text-ink">Quickstart Request</span>
          </div>

          {/* Controls: Language and Format */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLang.id}
              onChange={(e) => {
                const found = RUNTIMES.find((r) => r.id === e.target.value) || RUNTIMES[0]
                setSelectedLang(found)
                setResult(null)
              }}
              className="border border-night-edge bg-night px-2.5 py-1 font-code text-xs text-ink outline-none"
            >
              {RUNTIMES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.version})
                </option>
              ))}
            </select>

            <div className="flex border border-night-edge bg-night p-0.5">
              <button
                onClick={() => setSnippetFormat('curl')}
                className={`px-2.5 py-1 font-code text-xs ${
                  snippetFormat === 'curl' ? 'bg-rust-orange text-night font-bold' : 'text-ink-dim hover:text-ink'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setSnippetFormat('fetch')}
                className={`px-2.5 py-1 font-code text-xs ${
                  snippetFormat === 'fetch' ? 'bg-rust-orange text-night font-bold' : 'text-ink-dim hover:text-ink'
                }`}
              >
                Fetch
              </button>
              <button
                onClick={() => setSnippetFormat('python')}
                className={`px-2.5 py-1 font-code text-xs ${
                  snippetFormat === 'python' ? 'bg-rust-orange text-night font-bold' : 'text-ink-dim hover:text-ink'
                }`}
              >
                Python
              </button>
            </div>
          </div>
        </div>

        {/* Snippet Display */}
        <div className="relative border border-night-edge bg-black/40 p-3">
          <div className="flex justify-end pb-2">
            <button
              onClick={copySnippet}
              className="flex items-center gap-1 font-code text-xs text-ink-dim hover:text-ink"
            >
              {copiedSnippet ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedSnippet ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto font-code text-xs text-ink-dim leading-relaxed selection:bg-rust-orange selection:text-night">
            {activeSnippet}
          </pre>
        </div>

        {/* Run in Browser Action */}
        <div className="flex items-center justify-between pt-1">
          <PixelButton
            onClick={handleTestRun}
            disabled={executing}
            variant="secondary"
            className="text-xs"
          >
            <Play className="h-3 w-3 mr-1.5 inline fill-current" />
            {executing ? 'Executing in MicroVM…' : 'Test This Request in Browser'}
          </PixelButton>
        </div>

        {/* Test Result Display */}
        {result && (
          <div className="border border-night-edge bg-night p-3 font-code text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-night-edge pb-1">
              <span className="font-pixel text-[10px] uppercase text-ink">Result</span>
              {result.verdict && (
                <span className={result.verdict === 'AC' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {result.verdict} ({result.status || 'Finished'})
                </span>
              )}
            </div>
            {result.error && <div className="text-red-400">{result.error}</div>}
            {result.wallMs !== undefined && (
              <div className="text-ink-faint">Execution turnaround: {result.wallMs} ms</div>
            )}
            {result.stdout && <pre className="bg-black/30 p-2 text-emerald-300 whitespace-pre-wrap">{result.stdout}</pre>}
            {result.compileStderr && <pre className="bg-black/30 p-2 text-yellow-300 whitespace-pre-wrap">{result.compileStderr}</pre>}
            {result.stderr && <pre className="bg-black/30 p-2 text-red-300 whitespace-pre-wrap">{result.stderr}</pre>}
          </div>
        )}
      </PixelPanel>

      {/* Simple API Documentation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-rust-orange" />
          <span className="font-pixel text-[11px] uppercase text-ink">API Reference</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Request Fields */}
          <PixelPanel className="p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-night-edge pb-2">
              <Code2 className="h-3.5 w-3.5 text-ink-dim" />
              <span className="font-pixel text-[10px] uppercase text-ink">Request Body (JSON)</span>
            </div>
            <div className="space-y-2.5 font-code text-xs">
              <div>
                <div className="flex items-baseline justify-between">
                  <strong className="text-rust-orange">language</strong>
                  <span className="text-ink-faint text-[11px]">string · required</span>
                </div>
                <p className="text-ink-dim text-[11px] mt-0.5">
                  <code className="text-ink">rust</code>, <code className="text-ink">python</code>, <code className="text-ink">cpp</code>, <code className="text-ink">c</code>, <code className="text-ink">go</code>, <code className="text-ink">node</code>, <code className="text-ink">typescript</code>, <code className="text-ink">java</code>, <code className="text-ink">csharp</code>
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <strong className="text-rust-orange">code</strong>
                  <span className="text-ink-faint text-[11px]">string · required</span>
                </div>
                <p className="text-ink-dim text-[11px] mt-0.5">
                  The complete source code to compile and run.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <strong className="text-ink">harness</strong>
                  <span className="text-ink-faint text-[11px]">string · optional</span>
                </div>
                <p className="text-ink-dim text-[11px] mt-0.5">
                  Optional unit test wrapper with <code className="text-rust-orange">{`{{SOLUTION}}`}</code> placeholder.
                </p>
              </div>
            </div>
          </PixelPanel>

          {/* Response Fields */}
          <PixelPanel className="p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-night-edge pb-2">
              <Code2 className="h-3.5 w-3.5 text-ink-dim" />
              <span className="font-pixel text-[10px] uppercase text-ink">Response Body (JSON)</span>
            </div>
            <div className="space-y-2 font-code text-[11px]">
              <div>
                <strong className="text-emerald-400">stdout</strong>
                <span className="text-ink-dim ml-2">Standard output printed by your program.</span>
              </div>
              <div>
                <strong className="text-red-400">stderr</strong>
                <span className="text-ink-dim ml-2">Runtime errors or stack traces.</span>
              </div>
              <div>
                <strong className="text-yellow-400">compileStderr</strong>
                <span className="text-ink-dim ml-2">Compiler errors or warnings.</span>
              </div>
              <div>
                <strong className="text-ink">verdict</strong>
                <span className="text-ink-dim ml-2"><code className="text-emerald-400">AC</code> (Passed), <code className="text-red-400">CE</code>, <code className="text-red-400">RE</code>, or <code className="text-yellow-400">TLE</code>.</span>
              </div>
              <div>
                <strong className="text-ink">executionTime</strong>
                <span className="text-ink-dim ml-2">CPU execution time in microseconds.</span>
              </div>
              <div>
                <strong className="text-ink">memoryKb</strong>
                <span className="text-ink-dim ml-2">Peak anonymous RSS memory consumed in KB.</span>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>

      {/* Supported Languages Matrix */}
      <div className="space-y-3">
        <span className="font-pixel text-[11px] uppercase text-ink">Supported Runtimes</span>
        <div className="grid gap-2 sm:grid-cols-3">
          {RUNTIMES.map((r) => (
            <div key={r.id} className="border border-night-edge bg-night-card p-3 flex justify-between items-center">
              <div>
                <div className="font-pixel text-[10px] uppercase text-ink">{r.name}</div>
                <div className="font-code text-xs text-ink-dim">{r.version}</div>
              </div>
              <code className="border border-night-edge bg-night px-1.5 py-0.5 font-code text-[11px] text-ink-faint">
                {r.id}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Official Client SDK */}
      <PixelPanel className="p-5 space-y-3 border-2 border-rust-orange/60 bg-rust-orange/5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-night-edge pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-rust-orange" />
            <span className="font-pixel text-xs uppercase text-ink">Official Client SDK: cratera</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.npmjs.com/package/cratera"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-night-edge bg-night px-2 py-1 font-pixel text-[9px] uppercase text-emerald-400 hover:border-emerald-400"
            >
              npm: cratera
            </a>
            <a
              href="https://github.com/sundanc/cratera-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-night-edge bg-night px-2 py-1 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink"
            >
              GitHub Repo
            </a>
          </div>
        </div>
        <p className="font-code text-xs text-ink-dim">
          Install the zero-dependency TypeScript & JavaScript SDK or run jobs directly via CLI:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="font-pixel text-[9px] uppercase text-ink-faint mb-1">Installation</div>
            <pre className="border border-night-edge bg-black/40 p-2.5 font-code text-xs text-emerald-300">
              npm install cratera
            </pre>
          </div>
          <div>
            <div className="font-pixel text-[9px] uppercase text-ink-faint mb-1">CLI Quickrun</div>
            <pre className="border border-night-edge bg-black/40 p-2.5 font-code text-xs text-ink">
              npx cratera run --lang py "print(42)"
            </pre>
          </div>
        </div>
        <div>
          <div className="font-pixel text-[9px] uppercase text-ink-faint mb-1">TypeScript Example</div>
          <pre className="overflow-x-auto border border-night-edge bg-black/40 p-3 font-code text-xs text-ink">
{`import { Cratera } from 'cratera';

const cratera = new Cratera({ apiKey: process.env.CRATERA_API_KEY });
const result = await cratera.rust('fn main() { println!("Hello from microVM!"); }');
console.log(result.stdout);`}
          </pre>
        </div>
      </PixelPanel>

      {/* Simple Plans Section */}
      <div className="space-y-3 pt-2">
        <span className="font-pixel text-[11px] uppercase text-ink">API Access & Tiers</span>
        <PixelPanel className="p-5 space-y-3 border-2 border-night-edge">
          <div>
            <div className="font-pixel text-xs uppercase text-ink">Developer Sandbox Plan</div>
            <div className="font-pixel text-xl text-ink mt-1">Free <span className="font-code text-xs text-ink-dim">/ open access</span></div>
          </div>
          <ul className="space-y-1.5 font-code text-xs text-ink-dim">
            <li>• <strong>250 requests / day</strong> (Resets 00:00 UTC)</li>
            <li>• <strong>15 req / min</strong> burst rate limit</li>
            <li>• All 9 major programming runtimes</li>
            <li>• Hardware-isolated microVM sandbox over Linux KVM</li>
            <li>• Contact us via <Link to="/contact" className="text-rust-orange hover:underline">Contact</Link> if you need custom enterprise capacity.</li>
          </ul>
        </PixelPanel>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
