import React from 'react'

export type InlineMarkdownVariant = 'default' | 'title' | 'subtle'

type InlineMarkdownProps = {
  text?: string
  className?: string
  codeClassName?: string
  variant?: InlineMarkdownVariant
}


export function InlineMarkdown({
  text,
  className = '',
  codeClassName,
  variant = 'default',
}: InlineMarkdownProps) {
  if (!text) return null

  
  let resolvedCodeClass = codeClassName
  if (!resolvedCodeClass) {
    if (variant === 'title') {
      
      resolvedCodeClass = 'font-pixel text-rust-orange normal-case tracking-normal px-0.5'
    } else if (variant === 'subtle') {
      resolvedCodeClass = 'font-code text-emerald-400 bg-night-raised px-1 py-0.2 text-[0.9em]'
    } else {
      resolvedCodeClass =
        'border border-night-edge bg-night-raised px-1.5 py-0.5 font-code text-emerald-300 text-[0.88em] font-medium align-baseline mx-0.5'
    }
  }

  
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)

  return (
    <span className={className}>
      {tokens.map((token, idx) => {
        if (!token) return null

        if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
          const content = token.slice(1, -1)
          return (
            <code key={idx} className={resolvedCodeClass}>
              {content}
            </code>
          )
        }

        if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
          const content = token.slice(2, -2)
          return (
            <strong key={idx} className="font-bold text-ink">
              {content}
            </strong>
          )
        }

        if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
          const content = token.slice(1, -1)
          return (
            <em key={idx} className="italic text-ink-dim">
              {content}
            </em>
          )
        }

        return <React.Fragment key={idx}>{token}</React.Fragment>
      })}
    </span>
  )
}
