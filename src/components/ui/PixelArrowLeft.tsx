import { cx } from '../../lib/cx'

export function PixelArrowLeft({ className }: { className?: string }) {
  
  const s = 2 
  const fill = 'currentColor'

  
  const pixels: Array<[number, number]> = [
    [0, 3],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
  ]

  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className={cx('pixel-ui inline-block align-middle', className)}
      style={{ imageRendering: 'pixelated' }}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x * s} y={y * s} width={s} height={s} fill={fill} />
      ))}
    </svg>
  )
}
