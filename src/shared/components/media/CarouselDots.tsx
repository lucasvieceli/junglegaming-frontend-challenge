import { cn } from '@/shared/lib/cn'

const SIZES = {
  sm: { dot: 'size-[7px]', gap: 'gap-1.5', hitX: 'before:-inset-x-[3px]' },
  md: { dot: 'size-2', gap: 'gap-2', hitX: 'before:-inset-x-1' },
  lg: { dot: 'size-3', gap: 'gap-2', hitX: 'before:-inset-x-1' },
}

const INACTIVE_OUTLINE = 'bg-transparent ring-[1.3px] ring-primary ring-inset'

type CarouselDotsProps = {
  count: number
  index: number
  onSelect?: (index: number) => void
  label: string
  size?: keyof typeof SIZES
  className?: string
}

export function CarouselDots({
  count,
  index,
  onSelect,
  label,
  size = 'md',
  className,
}: CarouselDotsProps) {
  const { dot, gap, hitX } = SIZES[size]
  if (!onSelect) {
    return (
      <div aria-hidden="true" className={cn('flex items-center', gap, className)}>
        {Array.from({ length: count }, (_, dotIndex) => (
          <span
            key={dotIndex}
            className={cn(
              'rounded-full bg-primary',
              dot,
              size === 'lg' && dotIndex !== index && INACTIVE_OUTLINE,
            )}
          />
        ))}
      </div>
    )
  }
  return (
    <div role="group" aria-label={label} className={cn('flex items-center', gap, className)}>
      {Array.from({ length: count }, (_, dotIndex) => (
        <button
          key={dotIndex}
          type="button"
          aria-label={`Destaque ${dotIndex + 1} de ${count}`}
          aria-current={dotIndex === index ? 'true' : undefined}
          onClick={() => onSelect(dotIndex)}
          className={cn(
            'relative cursor-pointer rounded-full bg-primary outline-none before:absolute before:-inset-y-[9px] focus-visible:ring-2 focus-visible:ring-accent',
            dot,
            hitX,
            size === 'lg' && dotIndex !== index && INACTIVE_OUTLINE,
          )}
        />
      ))}
    </div>
  )
}
