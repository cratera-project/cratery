import Editor, { type OnMount } from '@monaco-editor/react'
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
  const handleMount: OnMount = (editor, monaco) => {
    if (onRun) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun()
      })
    }
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
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
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
