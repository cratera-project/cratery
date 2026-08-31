import { ExternalLink } from 'lucide-react'

interface EditOnGitHubProps {
  filePath: string
  className?: string
  label?: string
}

export function EditOnGitHub({
  filePath,
  className = '',
  label = 'Edit this page on GitHub',
}: EditOnGitHubProps) {
  const repoUrl = 'https://github.com/cratera-project/cratery'
  const fileUrl = `${repoUrl}/blob/main/${filePath.replace(/^\//, '')}`

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 font-code text-xs text-ink-dim transition-colors hover:text-rust-orange hover:underline ${className}`}
      title="View this content file on GitHub"
    >
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
    </a>
  )
}
