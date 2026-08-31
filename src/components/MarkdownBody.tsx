import type { Components } from 'react-markdown'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cx } from '../lib/cx'
import { CodeBlock } from './ui/CodeBlock'

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-5 mb-2 font-pixel text-xs uppercase tracking-wide text-ink first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2 font-pixel text-xs uppercase tracking-wide text-ink first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-1.5 font-pixel text-[11px] uppercase tracking-wide text-gold first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-3.5 mb-1 font-pixel text-[10px] uppercase tracking-wide text-ink-dim first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-2.5 text-stone-200 leading-relaxed first:mt-0 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-2.5 list-disc space-y-1.5 pl-5 marker:text-rust-orange/80">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2.5 list-decimal space-y-1.5 pl-5 marker:text-rust-orange/80">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="pl-0.5 text-stone-300 leading-relaxed [&>p]:my-1">{children}</li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-stone-200">{children}</em>,
  del: ({ children }) => <del className="line-through text-stone-400">{children}</del>,
  code: ({ children, className }) => {
    const match = /language-(\w+)/.exec(className || '')
    const isBlock = Boolean(className) || Boolean(match)
    if (isBlock) {
      const codeString = String(children).replace(/\n$/, '')
      const lang = match ? match[1] : 'rust'
      return <CodeBlock code={codeString} language={lang} />
    }
    return (
      <code className="border border-night-edge bg-night-raised px-1.5 py-0.5 font-code text-xs text-emerald-300 font-medium">
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-diamond underline hover:text-rust-orange"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-4 border-t-2 border-night-edge" />,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-rust-orange/80 bg-night-raised px-3 py-2 text-stone-300 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto border-2 border-night-edge bg-night/80 shadow-pixel">
      <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b-2 border-night-edge bg-night-raised text-ink uppercase font-pixel text-[9px] sm:text-[10px] tracking-wider">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-night-edge/50 font-code text-xs text-stone-200">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-night-raised/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-3.5 py-2.5 font-pixel text-[9px] sm:text-[10px] text-gold tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3.5 py-2 align-middle leading-relaxed text-stone-200 font-sans text-xs sm:text-sm">
      {children}
    </td>
  ),
}

type MarkdownBodyProps = {
  children: string
  className?: string
}


export function MarkdownBody({ children, className }: MarkdownBodyProps) {
  if (!children) return null
  return (
    <div className={cx('font-sans text-sm sm:text-[14.5px] leading-relaxed text-stone-200 antialiased', className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  )
}
