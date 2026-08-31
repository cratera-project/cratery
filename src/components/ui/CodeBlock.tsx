import { useState, useEffect, useRef } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import type { Language } from 'prism-react-renderer'
import { Copy, Check, Play, Edit3, RotateCcw, Terminal, X, Eye, Sparkles } from 'lucide-react'
import { copyText } from '../../lib/share'
import {
  loadSnippetDraft,
  saveSnippetDraft,
  resetSnippetDraft,
  executeSnippet,
} from '../../lib/snippetRunner'
import { formatRunMs, formatMemoryKb, type GradeRunResult } from '../../lib/grade'
import { useAuth } from '../../context/AuthContext'
import { AuthModal } from '../AuthModal'

const retroPixelTheme: PrismTheme = {
  plain: {
    backgroundColor: '#191b20',
    color: '#e8e9ec',
  },
  styles: [
    { types: ['comment'], style: { color: '#6b707c', fontStyle: 'italic' as const } },
    { types: ['keyword'], style: { color: '#e0785f', fontWeight: 'bold' } },
    { types: ['string'], style: { color: '#8fce6e' } },
    { types: ['function'], style: { color: '#6cb6f5' } },
    { types: ['number', 'boolean'], style: { color: '#f5b942', fontWeight: 'bold' } },
    { types: ['punctuation'], style: { color: '#a8adb8' } },
    { types: ['class-name', 'builtin'], style: { color: '#c792ea', fontWeight: 'bold' } },
    { types: ['operator'], style: { color: '#e8e9ec' } },
    { types: ['variable', 'constant'], style: { color: '#7fc8f8' } },
  ],
}

type CodeBlockProps = {
  code?: string
  language?: Language | string
  caption?: string
  snippetId?: string
  executable?: boolean
  initialShowConsole?: boolean
  onRun?: () => void
}

export function CodeBlock({
  code: originalCode = '',
  language = 'rust',
  caption,
  snippetId,
  executable = true,
  initialShowConsole = false,
  onRun,
}: CodeBlockProps) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCode, setCurrentCode] = useState(() => loadSnippetDraft(originalCode, snippetId))
  const [running, setRunning] = useState(false)
  const [execResult, setExecResult] = useState<GradeRunResult | null>(null)
  const [showConsole, setShowConsole] = useState(initialShowConsole)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  
  useEffect(() => {
    setCurrentCode(loadSnippetDraft(originalCode, snippetId))
    setExecResult(null)
  }, [originalCode, snippetId])

  if (!originalCode || originalCode.trim().length === 0) return null

  const isEdited = currentCode !== originalCode
  const normalized = currentCode.endsWith('\n') ? currentCode : `${currentCode}\n`
  const isRust = language === 'rust'

  const handleCopy = async () => {
    const success = await copyText(currentCode)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode)
    saveSnippetDraft(originalCode, newCode, snippetId)
    
    setExecResult(null)
    if (newCode !== originalCode) {
      setShowConsole(false)
    }
  }

  const handleReset = () => {
    resetSnippetDraft(originalCode, snippetId)
    setCurrentCode(originalCode)
    setExecResult(null)
    setShowConsole(false)
  }

  const handleRun = async () => {
    if (running || !isRust) return
    setRunning(true)
    setShowConsole(true)
    setExecResult(null)
    try {
      onRun?.()
    } catch {
      /* ignore */
    }

    try {
      const res = await executeSnippet(currentCode)
      setExecResult(res)
    } catch {
      setExecResult({ error: 'Network error communicating with execution judge.' })
    } finally {
      setRunning(false)
    }
  }

  const handleKeyDownInEditor = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const updated = currentCode.substring(0, start) + '    ' + currentCode.substring(end)
      handleCodeChange(updated)
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4
      }, 0)
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      void handleRun()
    }
  }

  return (
    <>
      <div className="pixel-ui my-4 w-full overflow-hidden border-4 border-black/60 bg-[#191b20] shadow-pixel">
        {/* Retro Pixel Code Header Bar with Interactive Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-night-edge bg-night-raised px-3 py-1.5 text-xs text-ink-dim">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-pixel text-[9px] uppercase tracking-wider text-rust-orange font-bold">
              {language}
            </span>
            {caption && (
              <span className="font-code text-[11px] text-ink-faint truncate lowercase">
                · {caption}
              </span>
            )}
            {isEdited && (
              <span className="border border-gold/70 bg-gold/15 px-1.5 py-0.2 font-pixel text-[8px] uppercase text-gold">
                Edited
              </span>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5">
            {executable && isRust && (
              <>
                {/* Run Button */}
                <button
                  type="button"
                  onClick={() => void handleRun()}
                  disabled={running}
                  className="flex items-center gap-1 border border-rust-orange/80 bg-rust-orange/20 px-2 py-0.5 font-pixel text-[9px] uppercase text-rust-orange hover:bg-rust-orange hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  title="Execute code in microVM judge (⌘+Enter / Ctrl+Enter)"
                >
                  <Play className="h-2.5 w-2.5 fill-current" />
                  <span>{running ? 'Running…' : 'Run'}</span>
                </button>

                {/* Edit Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsEditing((ed) => !ed)}
                  className={`flex items-center gap-1 border px-2 py-0.5 font-pixel text-[9px] uppercase transition-colors cursor-pointer ${
                    isEditing
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-night-edge bg-night hover:border-ink-faint text-ink-dim hover:text-ink'
                  }`}
                  title={isEditing ? 'View formatted code' : 'Edit code in-place'}
                >
                  {isEditing ? (
                    <>
                      <Eye className="h-2.5 w-2.5" />
                      <span>View</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-2.5 w-2.5" />
                      <span>Edit</span>
                    </>
                  )}
                </button>
              </>
            )}

            {isEdited && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 border border-night-edge bg-night px-1.5 py-0.5 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors cursor-pointer"
                title="Reset code to original tutorial lesson snippet"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Copy Button */}
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="flex items-center gap-1 border border-night-edge bg-night px-2 py-0.5 font-pixel text-[9px] uppercase text-ink-dim hover:text-ink hover:border-ink-faint transition-colors cursor-pointer"
              title="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-2.5 w-2.5 text-emerald" />
                  <span className="text-emerald">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-2.5 w-2.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Display or In-Place Editor */}
        {isEditing ? (
          <div className="relative bg-[#14161b] p-3 border-b-2 border-night-edge">
            <textarea
              ref={textareaRef}
              value={currentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleKeyDownInEditor}
              rows={Math.max(4, currentCode.split('\n').length + 1)}
              spellCheck={false}
              className="w-full resize-y bg-transparent font-code text-[13px] sm:text-[14px] leading-relaxed text-emerald-200 focus:outline-none selection:bg-rust-orange/40"
              style={{
                fontFamily:
                  "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              }}
            />
            <div className="mt-1 flex items-center justify-between font-pixel text-[8px] uppercase text-ink-faint border-t border-night-edge/40 pt-1.5">
              <span>Tab = 4 spaces · ⌘+Enter to Run</span>
              <span>{currentCode.split('\n').length} lines</span>
            </div>
          </div>
        ) : (
          <Highlight theme={retroPixelTheme} code={normalized} language={language as Language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <div className="overflow-x-auto p-3">
                <pre
                  className={`${className} font-code text-[13px] sm:text-[14px] leading-relaxed table min-w-full`}
                  style={{
                    ...style,
                    margin: 0,
                    padding: 0,
                    fontFamily:
                      "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                    letterSpacing: '0',
                  }}
                >
                  {tokens.map((line, i: number) => (
                    <div key={i} {...getLineProps({ line })} className="table-row">
                      <span
                        className="table-cell select-none text-[#4a4e58] text-right pr-4 font-mono text-xs"
                        style={{
                          width: 28,
                          minWidth: 28,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="table-cell whitespace-pre font-code">
                        {line.map((token, key: number) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            )}
          </Highlight>
        )}

        {/* Output Console / Execution Results Terminal */}
        {showConsole && (
          <div className="border-t-2 border-night-edge bg-[#101216] p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-night-edge/70 pb-1.5">
              <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-dim">
                <Terminal className="h-3 w-3 text-rust-orange" />
                <span>Terminal Output</span>
                {execResult?.executionTime ? (
                  <span className="border border-night-edge bg-night px-1 text-[8px] font-code text-ink-faint">
                    {formatRunMs(execResult.executionTime)}
                  </span>
                ) : null}
                {execResult?.memoryKb ? (
                  <span className="border border-night-edge bg-night px-1 text-[8px] font-code text-ink-faint">
                    {formatMemoryKb(execResult.memoryKb)}
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setShowConsole(false)}
                className="p-0.5 text-ink-dim hover:text-ink cursor-pointer"
                title="Close terminal output"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {running ? (
              <div className="font-code text-xs text-gold py-2 animate-pulse flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
                <span>Compiling and executing in isolated microVM…</span>
              </div>
            ) : execResult ? (
              <div className="space-y-2 font-code text-xs">
                {/* Rate Limit Conversion Warnings & CTAs */}
                {execResult.rateLimited && (
                  <>
                    {!user ? (
                      
                      <div className="border-2 border-rust-orange bg-rust-orange/15 p-3 space-y-2 text-ink animate-in fade-in duration-150">
                        <div className="flex items-center gap-1.5 font-pixel text-[10px] uppercase text-rust-orange font-bold">
                          <Sparkles className="h-3.5 w-3.5 text-gold" />
                          <span>Guest Rate Limit Reached</span>
                        </div>
                        <p className="font-sans text-xs leading-relaxed text-ink/90">
                          Create a free account in 5 seconds to unlock higher execution limits, save your progress, and earn XP.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-0.5">
                          <button
                            type="button"
                            onClick={() => setShowAuthModal(true)}
                            className="pixel-ui inline-flex items-center justify-center gap-1.5 border-2 border-rust-orange bg-rust-orange px-3 py-1 font-pixel text-[9px] uppercase text-white hover:bg-rust-orange/90 shadow-pixel cursor-pointer"
                          >
                            <span>Sign Up Free (+20 XP)</span>
                          </button>
                          <span className="font-code text-[11px] text-ink-dim">
                            ⏳ Hourly quota resets automatically
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-night-edge bg-night-raised p-3 space-y-1 text-ink">
                        <div className="font-pixel text-[10px] uppercase text-rust-orange">
                          Hourly Rate Limit Reached
                        </div>
                        <p className="font-sans text-xs text-ink/90">
                          You have reached the hourly execution cap. Your quota resets automatically at the top of the hour.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Compilation Error Output */}
                {execResult.compilationError && (
                  <div className="border border-redstone/40 bg-redstone/10 p-2.5 text-redstone">
                    <div className="font-pixel text-[8px] uppercase text-redstone pb-1 font-bold">
                      Compiler Diagnostic (rustc):
                    </div>
                    <pre className="whitespace-pre-wrap overflow-x-auto leading-relaxed">
                      {execResult.compilationError}
                    </pre>
                  </div>
                )}

                {/* Standard Output */}
                {execResult.stdout !== undefined && execResult.stdout !== null && (
                  <div className="p-2 bg-black/60 border border-night-edge text-emerald-300">
                    {execResult.stdout.trim() ? (
                      <pre className="whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {execResult.stdout}
                      </pre>
                    ) : (
                      <span className="text-ink-faint italic">(Process executed with 0 stdout)</span>
                    )}
                  </div>
                )}

                {/* Standard Error (if any without compilation error) */}
                {execResult.stderr && !execResult.compilationError && (
                  <div className="p-2 bg-redstone/10 border border-redstone/40 text-redstone">
                    <pre className="whitespace-pre-wrap overflow-x-auto leading-relaxed">
                      {execResult.stderr}
                    </pre>
                  </div>
                )}

                {/* General Error (if not already handled by rate limit card) */}
                {execResult.error && !execResult.rateLimited && (
                  <div className="p-2 bg-gold/10 border border-gold/40 text-gold">
                    {execResult.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="font-code text-xs text-ink-faint italic py-1">
                Click &quot;Run&quot; to execute this snippet.
              </div>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
