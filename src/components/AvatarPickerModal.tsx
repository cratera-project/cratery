import { useEffect, useState, type ReactNode } from 'react'
import {
  AVATAR_ACCESSORIES,
  AVATAR_BACKGROUNDS,
  AVATAR_CLOTHING,
  AVATAR_CLOTHING_COLORS,
  AVATAR_GLASSES,
  AVATAR_HAIR,
  AVATAR_HAIR_COLORS,
  AVATAR_HATS,
  AVATAR_SKIN,
  avatarUrl,
  defaultAvatarConfig,
  randomAvatarSeed,
  sanitizeAvatarConfig,
  type AvatarConfig,
} from '../lib/avatar'
import { PixelButton } from './ui/PixelButton'
import { PixelPanel } from './ui/PixelPanel'
import { cx } from '../lib/cx'

type Props = {
  isOpen: boolean
  userId: string
  initial: AvatarConfig | null | undefined
  onClose: () => void
  onSave: (avatar: AvatarConfig) => Promise<{ error: string | null }>
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="font-pixel text-[9px] uppercase text-ink-dim">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Swatch({
  color,
  selected,
  onClick,
}: {
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={color || 'None'}
      onClick={onClick}
      className={cx(
        'h-8 w-8 border-2 border-black/60 shadow-pixel transition-transform hover:scale-105',
        selected ? 'ring-2 ring-rust-orange ring-offset-1 ring-offset-night' : ''
      )}
      style={{ background: color ? `#${color}` : 'transparent' }}
    >
      {!color ? <span className="font-code text-[10px] text-ink-faint">∅</span> : null}
    </button>
  )
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'border-2 border-black/60 px-2 py-1 font-code text-sm transition-transform hover:scale-105',
        selected ? 'bg-rust-orange text-white' : 'bg-night-raised text-ink-dim hover:text-ink'
      )}
    >
      {label}
    </button>
  )
}

export function AvatarPickerModal({ isOpen, userId, initial, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<AvatarConfig>(
    () => sanitizeAvatarConfig(initial, userId) ?? defaultAvatarConfig(userId)
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setDraft(sanitizeAvatarConfig(initial, userId) ?? defaultAvatarConfig(userId))
    setError(null)
    setSaving(false)
  }, [isOpen, initial, userId])

  if (!isOpen) return null

  const set = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    const res = await onSave(draft)
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Edit profile picture"
      >
        <PixelPanel title="Edit avatar">
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="h-28 w-28 overflow-hidden border-4 border-black/60 bg-night-raised shadow-pixel">
                <img src={avatarUrl(userId, draft)} alt="" className="h-full w-full" />
              </div>
              <PixelButton size="sm" variant="secondary" onClick={() => set('seed', randomAvatarSeed())}>
                Shuffle face
              </PixelButton>
            </div>

            <Row label="Background">
              {AVATAR_BACKGROUNDS.map((c) => (
                <Swatch
                  key={c || 'none'}
                  color={c}
                  selected={(draft.backgroundColor ?? '') === c}
                  onClick={() => set('backgroundColor', c === '' ? undefined : c)}
                />
              ))}
            </Row>

            <Row label="Skin">
              {AVATAR_SKIN.map((c) => (
                <Swatch key={c} color={c} selected={draft.skinColor === c} onClick={() => set('skinColor', c)} />
              ))}
            </Row>

            <Row label="Hair">
              {AVATAR_HAIR.map((h, i) => (
                <Chip key={h} label={`${i + 1}`} selected={draft.hair === h} onClick={() => set('hair', h)} />
              ))}
            </Row>

            <Row label="Hair color">
              {AVATAR_HAIR_COLORS.map((c) => (
                <Swatch key={c} color={c} selected={draft.hairColor === c} onClick={() => set('hairColor', c)} />
              ))}
            </Row>

            <Row label="Clothes">
              {AVATAR_CLOTHING.map((v, i) => (
                <Chip
                  key={v}
                  label={`${i + 1}`}
                  selected={draft.clothing === v}
                  onClick={() => set('clothing', v)}
                />
              ))}
            </Row>

            <Row label="Clothes color">
              {AVATAR_CLOTHING_COLORS.map((c) => (
                <Swatch
                  key={c}
                  color={c}
                  selected={draft.clothingColor === c}
                  onClick={() => set('clothingColor', c)}
                />
              ))}
            </Row>

            <Row label="Glasses">
              <Chip
                label="None"
                selected={draft.glasses == null}
                onClick={() => set('glasses', null)}
              />
              {AVATAR_GLASSES.map((v, i) => (
                <Chip key={v} label={`${i + 1}`} selected={draft.glasses === v} onClick={() => set('glasses', v)} />
              ))}
            </Row>

            <Row label="Accessories">
              <Chip
                label="None"
                selected={draft.accessories == null}
                onClick={() => set('accessories', null)}
              />
              {AVATAR_ACCESSORIES.map((v, i) => (
                <Chip
                  key={v}
                  label={`${i + 1}`}
                  selected={draft.accessories === v}
                  onClick={() => set('accessories', v)}
                />
              ))}
            </Row>

            <Row label="Hat">
              <Chip label="None" selected={draft.hat == null} onClick={() => set('hat', null)} />
              {AVATAR_HATS.map((v, i) => (
                <Chip key={v} label={`${i + 1}`} selected={draft.hat === v} onClick={() => set('hat', v)} />
              ))}
            </Row>

            {error ? <p className="font-code text-base text-redstone">{error}</p> : null}

            <div className="flex gap-2">
              <PixelButton size="sm" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
                Cancel
              </PixelButton>
              <PixelButton size="sm" className="flex-1" onClick={() => void save()} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </PixelButton>
            </div>
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}
