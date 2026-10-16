import type { Order } from '@/shared/contracts/order'
import { formatDiscount, formatEth } from '@/shared/lib/money'

export function ReceiptTotals({ pricing }: { pricing: Order['pricing'] }) {
  return (
    <dl className="flex w-full flex-col gap-3 self-end text-foreground sm:w-[321px]">
      {pricing.couponCode && (
        <div className="flex items-center justify-between">
          <dt className="type-b-15">Desconto ({pricing.couponCode})</dt>
          <dd className="type-b-15">{formatDiscount(pricing.discount)}</dd>
        </div>
      )}
      <div className="flex items-center justify-between">
        <dt className="type-b-15">Taxa de rede</dt>
        <dd className="type-b-18">{formatEth(pricing.networkFee)}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="type-b-16-bold">Total</dt>
        <dd className="type-b-18-bold text-accent">{formatEth(pricing.total)}</dd>
      </div>
    </dl>
  )
}
