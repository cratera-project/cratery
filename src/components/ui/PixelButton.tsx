import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cx } from '../../lib/cx'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'gold'

type Size = 'sm' | 'md' | 'lg'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    size?: Size
  }
>

export function PixelButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...rest
}: Props) {
  const variantClass =
    variant === 'primary'
      ? 'bg-rust-orange hover:bg-rust-dark text-white'
      : variant === 'secondary'
        ? 'bg-night-raised hover:bg-night-edge text-ink'
        : variant === 'success'
          ? 'bg-emerald hover:bg-grass text-stone-darkest'
          : variant === 'gold'
            ? 'bg-gold hover:bg-amber-400 text-stone-darkest'
            : 'bg-redstone hover:bg-redstone/80 text-white'

  const sizeClass =
    size === 'sm'
      ? 'px-3 py-2 text-[10px]'
      : size === 'lg'
        ? 'px-6 py-4 text-xs'
        : 'px-4 py-3 text-[11px]'

  return (
    <button
      {...rest}
      className={cx(
        'pixel-ui font-pixel uppercase tracking-[0.02em]',
        'border-4 border-black/60 shadow-pixel',
        'transition-all duration-100 ease-linear',
        'hover:-translate-y-0.5 hover:shadow-pixel-lg',
        'active:translate-y-0.5 active:shadow-none',
        'focus:outline-none focus:ring-2 focus:ring-diamond focus:ring-offset-2 focus:ring-offset-night',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-pixel',
        sizeClass,
        variantClass,
        className,
      )}
    >
      {children}
    </button>
  )
}
