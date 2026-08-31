import { PixelButton } from './ui/PixelButton'
import { PixelPanel } from './ui/PixelPanel'
import { useProgressStore } from '../store/progressStore'

export function RankUpModal() {
  const rankUp = useProgressStore((s) => s.rankUp)
  const clearRankUp = useProgressStore((s) => s.clearRankUp)
  if (!rankUp) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={clearRankUp}
    >
      <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <PixelPanel>
          <div className="text-center">
            <div className="font-pixel text-[9px] uppercase tracking-wider text-rust-orange">
              Rank up
            </div>
            <h2 className="mt-3 font-pixel text-sm uppercase text-ink">{rankUp}</h2>
            <p className="mt-3 read-body text-xl text-ink-dim">
              That title belongs on your profile card. Challenge a friend while it is warm.
            </p>
            <div className="mt-5">
              <PixelButton className="w-full" onClick={clearRankUp}>
                Flex it
              </PixelButton>
            </div>
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}
