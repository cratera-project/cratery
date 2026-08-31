import type { NoteCell } from '../../lib/notes'
import { incrementNoteRuns } from '../../lib/notes'
import { CodeBlock } from '../ui/CodeBlock'
import { MarkdownBody } from '../MarkdownBody'
import { FileText, FileCode } from 'lucide-react'

type Props = {
  cell: NoteCell
  index: number
  noteId?: string
}

export function NoteCellViewer({ cell, index, noteId }: Props) {
  const isMarkdown = cell.type === 'markdown'

  if (isMarkdown) {
    return (
      <div className="pixel-ui border-4 border-black/60 bg-[#16181d] p-5 sm:p-6 shadow-pixel">
        <div className="mb-3 flex items-center justify-between border-b border-night-edge/60 pb-2">
          <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-diamond">
            <FileText className="h-3 w-3" />
            <span>Section [{index + 1}]</span>
          </div>
        </div>
        <div className="prose prose-invert max-w-none text-stone-200">
          <MarkdownBody>{cell.content}</MarkdownBody>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-rust-orange font-bold">
          <FileCode className="h-3 w-3" />
          <span>Code Cell [{index + 1}]</span>
        </div>
        <span className="font-code text-[10px] text-ink-faint">
          Interactive Rust Playground
        </span>
      </div>
      <CodeBlock
        code={cell.content}
        language={cell.language || 'rust'}
        caption={cell.caption || `Code Cell [${index + 1}]`}
        snippetId={`note_cell_${cell.id}`}
        executable={true}
        onRun={() => {
          if (noteId) {
            void incrementNoteRuns(noteId)
          }
        }}
      />
    </div>
  )
}
