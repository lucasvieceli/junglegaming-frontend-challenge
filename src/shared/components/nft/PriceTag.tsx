import { formatEth } from '@/shared/lib/money'
import { cn } from '@/shared/lib/cn'

const SIZES = {
  responsive: { price: 'type-b-16-bold lg:type-b-18-bold', previous: 'type-b-16 lg:type-b-18' },
  sm: { price: 'type-b-16-bold', previous: 'type-b-16' },
}

type PriceTagProps = {
  price: string
  previousPrice?: string | null
  size?: keyof typeof SIZES
  className?: string
}

export function PriceTag({ price, previousPrice, size = 'responsive', className }: PriceTagProps) {
  const styles = SIZES[size]
  return (
    <p className={cn('flex items-center gap-3 whitespace-nowrap', className)}>
      <span className={cn('text-accent', styles.price)}>{formatEth(price)}</span>
      {previousPrice && (
        <span className={cn('text-secondary', styles.previous)}>
          <span className="sr-only">Preço anterior: </span>
          {formatEth(previousPrice)}
        </span>
      )}
    </p>
  )
}
