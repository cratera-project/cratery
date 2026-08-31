import { useState } from 'react'
import { cx } from '../../lib/cx'

type RatingControlProps = {
    rating: number
    onChange: (rating: number) => void
    disabled?: boolean
    className?: string
}


function fillClassForScore(score: number): string {
    if (score >= 5) return 'bg-emerald text-stone-darkest'
    if (score >= 4) return 'bg-grass text-stone-darkest'
    if (score >= 3) return 'bg-gold text-stone-darkest'
    if (score >= 2) return 'bg-rust-orange text-white'
    return 'bg-redstone text-white'
}

export function RatingControl({ rating, onChange, disabled, className }: RatingControlProps) {
    const [hoverRating, setHoverRating] = useState(0)
    const active = hoverRating || rating

    return (
        <div className={cx('flex flex-col gap-3', className)}>
            <div className="font-pixel text-[10px] uppercase text-ink-dim">Rate this quest</div>
            <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = active >= star
                    return (
                        <button
                            key={star}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(star)}
                            onMouseEnter={() => !disabled && setHoverRating(star)}
                            className={cx(
                                'group relative h-10 w-10 transition-all duration-100 ease-linear',
                                'border-3 border-black/60 shadow-pixel',
                                disabled
                                    ? 'cursor-default opacity-50'
                                    : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-pixel-lg active:translate-y-0 active:shadow-none',
                                isFilled
                                    ? fillClassForScore(active)
                                    : 'bg-night-raised text-ink-faint',
                                !isFilled && !disabled && 'hover:bg-night-edge'
                            )}
                        >
                            <div className="absolute inset-0 flex items-center justify-center font-code text-xl font-bold leading-none">
                                {star}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
