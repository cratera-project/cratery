import { useState, useRef } from 'react'
import type { NoteCell } from '../../lib/notes'
import { executeSnippet } from '../../lib/snippetRunner'
import { formatRunMs, formatMemoryKb, type GradeRunResult } from '../../lib/grade'
import { MarkdownBody } from '../MarkdownBody'
import { MonacoEditor } from '../ui/MonacoEditor'
import {
  Play,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  Edit3,
  Terminal,
  Bold,
  Italic,
  Code as CodeIcon,
  Heading,
  List,
  Quote,
  FileCode,
  FileText,
  Sparkles,
} from 'lucide-react'

type Props = {
  cell: NoteCell
  index: number
  totalCells: number
  onChange: (updated: NoteCell) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
}

export function NoteCellEditor({
  cell,
  index,
  totalCells,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
}: Props) {
  const [previewMarkdown, setPreviewMarkdown] = useState(false)
  const [running, setRunning] = useState(false)
  const [execResult, setExecResult] = useState<GradeRunResult | null>(null)
  const [showConsole, setShowConsole] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isMarkdown = cell.type === 'markdown'

  const handleRun = async () => {
    if (running || isMarkdown) return
    setRunning(true)
    setShowConsole(true)
    setExecResult(null)

    try {
      const res = await executeSnippet(cell.content)
      setExecResult(res)
    } catch {
      setExecResult({ error: 'Network error executing code cell in microVM judge.' })
    } finally {
      setRunning(false)
    }
  }

  const insertMarkdownSyntax = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = cell.content.substring(start, end)
    const replacement = prefix + (selected || 'text') + suffix
    const updated = cell.content.substring(0, start) + replacement + cell.content.substring(end)
    onChange({ ...cell, content: updated })

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + prefix.length
      textarea.selectionEnd = start + prefix.length + (selected.length || 4)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const updated = cell.content.substring(0, start) + '    ' + cell.content.substring(end)
      onChange({ ...cell, content: updated })
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4
      }, 0)
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isMarkdown) {
      e.preventDefault()
      void handleRun()
    }
  }

  return (
    <div className="pixel-ui group relative border-4 border-black/60 bg-night-panel shadow-pixel transition-all hover:border-night-edge">
      {/* Cell Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-night-edge bg-night-raised px-3 py-1.5 text-xs text-ink-dim">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[9px] uppercase text-ink-faint">
            [{index + 1}]
          </span>
          <span
            className={`flex items-center gap-1 font-pixel text-[9px] uppercase font-bold ${
              isMarkdown ? 'text-diamond' : 'text-rust-orange'
            }`}
          >
            {isMarkdown ? <FileText className="h-3 w-3" /> : <FileCode className="h-3 w-3" />}
            <span>{isMarkdown ? 'Markdown Cell' : 'Rust Code Cell'}</span>
          </span>

          {/* Cell Type Toggle */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...cell,
                type: isMarkdown ? 'code' : 'markdown',
              })
            }
            className="border border-night-edge bg-night px-1.5 py-0.2 font-pixel text-[8px] uppercase text-ink-dim hover:border-ink-faint hover:text-ink transition-colors cursor-pointer"
            title="Convert cell type"
          >
            Switch to {isMarkdown ? 'Code' : 'Markdown'}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {!isMarkdown && (
            <button
              type="button"
              onClick={() => void handleRun()}
              disabled={running}
              className="flex items-center gap-1 border border-rust-orange/80 bg-rust-orange/20 px-2 py-0.5 font-pixel text-[9px] uppercase text-rust-orange hover:bg-rust-orange hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Run code cell (⌘+Enter / Ctrl+Enter)"
            >
              <Play className="h-2.5 w-2.5 fill-current" />
              <span>{running ? 'Running…' : 'Run Cell'}</span>
            </button>
          )}

          {isMarkdown && (
            <button
              type="button"
              onClick={() => setPreviewMarkdown((p) => !p)}
              className={`flex items-center gap-1 border px-2 py-0.5 font-pixel text-[9px] uppercase transition-colors cursor-pointer ${
                previewMarkdown
                  ? 'border-diamond bg-diamond/15 text-diamond'
                  : 'border-night-edge bg-night text-ink-dim hover:text-ink'
              }`}
            >
              {previewMarkdown ? (
                <>
                  <Edit3 className="h-2.5 w-2.5" />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <Eye className="h-2.5 w-2.5" />
                  <span>Preview</span>
                </>
              )}
            </button>
          )}

          {/* Move Up */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="border border-night-edge bg-night p-1 text-ink-dim hover:text-ink disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move cell up"
          >
            <ArrowUp className="h-3 w-3" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalCells - 1}
            className="border border-night-edge bg-night p-1 text-ink-dim hover:text-ink disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move cell down"
          >
            <ArrowDown className="h-3 w-3" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={onDuplicate}
            className="border border-night-edge bg-night p-1 text-ink-dim hover:text-ink transition-colors cursor-pointer"
            title="Duplicate cell"
          >
            <Copy className="h-3 w-3" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            disabled={totalCells <= 1}
            className="border border-night-edge bg-night p-1 text-ink-dim hover:border-redstone hover:text-redstone transition-colors cursor-pointer disabled:opacity-30"
            title="Delete cell"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Markdown Helper Formatting Toolbar */}
      {isMarkdown && !previewMarkdown && (
        <div className="flex flex-wrap items-center gap-1 border-b border-night-edge bg-night/80 px-2 py-1 text-xs">
          <button
            type="button"
            onClick={() => insertMarkdownSyntax('### ')}
            className="p-1 text-ink-dim hover:text-diamond cursor-pointer"
            title="Heading 3 (###)"
          >
            <Heading className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdownSyntax('**', '**')}
            className="p-1 text-ink-dim hover:text-diamond cursor-pointer"
            title="Bold (**text**)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdownSyntax('*', '*')}
            className="p-1 text-ink-dim hover:text-diamond cursor-pointer"
            title="Italic (*text*)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdownSyntax('`', '`')}
            className="p-1 text-ink-dim hover:text-diamond cursor-pointer"
            title="Inline Code (`code`)"
          >
            <CodeIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdownSyntax('- ')}
            className="p-1 text-ink-dim hover:text-diamond cursor-pointer"
            title="Bullet List (- item)"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdownSyntax('> ')}
            className="p-1 text-ink-dim hover:text-diamond cursor-pointer"
            title="Quote / Callout (> text)"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdownSyntax('> 💡 **Key Takeaway**: ')}
            className="flex items-center gap-1 px-1.5 py-0.5 font-pixel text-[8px] uppercase text-gold hover:bg-gold/10 border border-transparent hover:border-gold/30 cursor-pointer"
            title="Tip Alert Box"
          >
            <Sparkles className="h-3 w-3" />
            <span>Alert</span>
          </button>
        </div>
      )}

      {/* Cell Body */}
      <div className="p-3">
        {isMarkdown ? (
          previewMarkdown ? (
            <div className="min-h-[80px] bg-[#14161b] p-4 text-ink rounded border border-night-edge">
              <MarkdownBody>{cell.content || '*Empty markdown cell*'}</MarkdownBody>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={cell.content}
              onChange={(e) => onChange({ ...cell, content: e.target.value })}
              onKeyDown={handleKeyDown}
              rows={Math.max(3, cell.content.split('\n').length + 1)}
              placeholder="# Write markdown notes here..."
              className="w-full resize-y bg-[#14161b] p-3 font-sans text-sm leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-diamond/40 border border-night-edge selection:bg-diamond/30"
            />
          )
        ) : (
          <div className="space-y-2">
            <div className="overflow-hidden border border-night-edge bg-night">
              <MonacoEditor
                value={cell.content}
                onChange={(val) => onChange({ ...cell, content: val })}
                height={
                  Math.min(
                    520,
                    Math.max(130, (cell.content ? cell.content.split('\n').length : 1) * 21 + 24)
                  ) + 'px'
                }
                fill
                language={cell.language || 'rust'}
                onRun={() => void handleRun()}
              />
            </div>
            <div className="flex items-center justify-between font-pixel text-[8px] uppercase text-ink-faint pt-1">
              <span>Auto-Close Brackets · Smart Indent · ⌘+Enter to Run</span>
              <span>{(cell.content || '').split('\n').length} lines</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Execution Output Terminal for Code Cell */}
      {!isMarkdown && showConsole && (
        <div className="border-t-2 border-night-edge bg-[#101216] p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-night-edge/70 pb-1.5">
            <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-ink-dim">
              <Terminal className="h-3 w-3 text-rust-orange" />
              <span>MicroVM Terminal Output</span>
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
              className="font-pixel text-[8px] text-ink-faint hover:text-ink cursor-pointer uppercase"
            >
              Hide
            </button>
          </div>

          {running ? (
            <div className="font-code text-xs text-gold py-1 animate-pulse flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
              <span>Compiling and executing in isolated microVM…</span>
            </div>
          ) : execResult ? (
            <div className="space-y-2 font-code text-xs">
              {execResult.compilationError && (
                <div className="border border-redstone/40 bg-redstone/10 p-2 text-redstone">
                  <div className="font-pixel text-[8px] uppercase text-redstone pb-1 font-bold">
                    Compiler Diagnostic:
                  </div>
                  <pre className="whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {execResult.compilationError}
                  </pre>
                </div>
              )}

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

              {execResult.stderr && !execResult.compilationError && (
                <div className="p-2 bg-redstone/10 border border-redstone/40 text-redstone">
                  <pre className="whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {execResult.stderr}
                  </pre>
                </div>
              )}

              {execResult.error && (
                <div className="p-2 bg-gold/10 border border-gold/40 text-gold">
                  {execResult.error}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
