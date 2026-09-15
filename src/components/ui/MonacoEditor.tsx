import Editor, { type OnMount } from '@monaco-editor/react'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'

type Props = {
  value: string
  onChange: (value: string) => void
  height?: string

  fill?: boolean

  language?: string

  onRun?: () => void

  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'

  readOnly?: boolean

  className?: string
}

const NATIVE_EDITOR_MQ = '(max-width: 767px), (hover: none) and (pointer: coarse)'

const CODE_FONT =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"

function prefersNativeCodeEditor(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(NATIVE_EDITOR_MQ).matches
  }
  return window.innerWidth < 768
}

function useNativeCodeEditor() {
  const [native, setNative] = useState(prefersNativeCodeEditor)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(NATIVE_EDITOR_MQ)
    const update = () => setNative(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return native
}

function NativeCodeEditor({
  value,
  onChange,
  fill,
  onRun,
  readOnly,
  className,
}: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = value.slice(0, start) + '    ' + value.slice(end)
      onChange(next)
      const caret = start + 4
      window.setTimeout(() => {
        el.selectionStart = el.selectionEnd = caret
      }, 0)
      return
    }
    if (onRun && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onRun()
    }
  }

  return (
    <div
      className={cx(
        'flex min-h-0 min-w-0 flex-col bg-night',
        fill ? 'h-full' : 'pixel-ui overflow-hidden border-4 border-black/60 shadow-pixel',
        className
      )}
    >
      {!fill ? (
        <div className="shrink-0 border-b-2 border-black/60 bg-night-raised px-3 py-1 font-pixel text-[9px] uppercase tracking-wider text-ink-dim">
          Editor
        </div>
      ) : null}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={18}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        inputMode="text"
        enterKeyHint="enter"
        wrap="soft"
        readOnly={readOnly}
        aria-label="Code editor"
        className={cx(
          'native-code-editor block w-full min-w-0 flex-1 bg-night px-3 py-3 font-code text-ink',
          'leading-relaxed tracking-normal',
          'focus:outline-none selection:bg-rust-orange/40',
          fill ? 'resize-none' : 'resize-y'
        )}
        style={{
          fontFamily: CODE_FONT,
          fontSize: 16,
          lineHeight: 1.55,
          tabSize: 4,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          minHeight: '60dvh',
          height: fill ? '100%' : '60dvh',
        }}
      />
    </div>
  )
}

export function MonacoEditor({
  value,
  onChange,
  height = '280px',
  fill = false,
  language = 'rust',
  onRun,
  lineNumbers = 'on',
  readOnly = false,
  className,
}: Props) {
  const native = useNativeCodeEditor()

  const handleMount: OnMount = (editor, monaco) => {
    if (onRun) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun()
      })
    }
  }

  if (native) {
    return (
      <NativeCodeEditor
        value={value}
        onChange={onChange}
        height={height}
        fill={fill}
        language={language}
        onRun={onRun}
        lineNumbers={lineNumbers}
        readOnly={readOnly}
        className={className}
      />
    )
  }

  return (
    <div
      className={cx(
        'bg-night',
        fill ? 'h-full min-h-0' : 'pixel-ui overflow-hidden border-4 border-black/60 shadow-pixel',
        className
      )}
    >
      {!fill ? (
        <div className="border-b-2 border-black/60 bg-night-raised px-3 py-1 font-pixel text-[9px] uppercase tracking-wider text-ink-dim">
          Editor
        </div>
      ) : null}
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: CODE_FONT,
          lineNumbers,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 4,
          automaticLayout: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoClosingDelete: 'always',
          autoClosingOvertype: 'always',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          matchBrackets: 'always',
          renderLineHighlight: 'line',
          padding: { top: 8, bottom: 8 },
          readOnly,
        }}
        loading={
          <div className="flex h-full min-h-[140px] items-center justify-center bg-night font-code text-sm text-ink-dim">
            Loading editor…
          </div>
        }
      />
    </div>
  )
}
