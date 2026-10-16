import type { CartPricing } from '@/shared/contracts/cart'
import { cn } from '@/shared/lib/cn'
import { formatDiscount, formatEth } from '@/shared/lib/money'

type PricingRowsProps = {
  pricing: CartPricing
  size?: 'lg' | 'sm'
  variant?: 'cart' | 'quote'
  className?: string
}

function layoutOf(size: 'lg' | 'sm', variant: 'cart' | 'quote') {
  if (variant === 'quote') {
    return {
      fee: 'gap-y-3',
      estimate: 'text-center',
      total: 'hairline -mt-px w-full max-w-[321px] self-center pt-3',
    }
  }
  return size === 'lg'
    ? { fee: 'gap-y-3', estimate: 'text-right', total: 'mt-3' }
    : { fee: '', estimate: 'text-right', total: '' }
}

export function PricingRows({
  pricing,
  size = 'lg',
  variant = 'cart',
  className,
}: PricingRowsProps) {
  const value = size === 'lg' ? 'type-b-18' : 'type-b-16'
  const layout = layoutOf(size, variant)
  return (
    <dl className={cn('flex flex-col gap-3 text-foreground', className)}>
      <div className="flex items-start justify-between gap-4">
        <dt className="type-b-15">Subtotal</dt>
        <dd className={value}>{formatEth(pricing.subtotal)}</dd>
      </div>
      <div className="flex items-start justify-between gap-4">
        <dt className="type-b-15">Desconto do lançamento</dt>
        <dd className="type-b-15">{formatDiscount(pricing.discount)}</dd>
      </div>
      <div className={cn('grid grid-cols-[1fr_auto] items-center gap-x-4', layout.fee)}>
        <dt className="type-b-15">Taxa de rede</dt>
        <dd className={value}>{formatEth(pricing.networkFee)}</dd>
        <dd className={cn('type-c-12 col-span-2 text-accent', layout.estimate)}>Taxa estimada</dd>
      </div>
      <div className={cn('flex items-start justify-between gap-4', layout.total)}>
        <dt className="type-b-16-bold">Total</dt>
        <dd className="type-b-18-bold text-accent" aria-live="polite">
          {formatEth(pricing.total)}
        </dd>
      </div>
    </dl>
  )
}
