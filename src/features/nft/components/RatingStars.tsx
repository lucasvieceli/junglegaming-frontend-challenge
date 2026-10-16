import { StarIcon } from '@/shared/components/icons/StarIcon'
import { cn } from '@/shared/lib/cn'

export function RatingStars({ value, className }: { value: number; className?: string }) {
  const filled = Math.round(value)
  return (
    <span
      role="img"
      aria-label={`Nota ${value.toLocaleString('pt-BR')} de 5`}
      className={cn('flex items-center gap-1', className)}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className="flex size-[15px] items-center justify-center">
          <StarIcon
            className={cn(
              'h-[11.9px] w-[12.5px]',
              index < filled ? 'text-primary' : 'text-text-secondary',
            )}
          />
        </span>
      ))}
    </span>
  )
}
