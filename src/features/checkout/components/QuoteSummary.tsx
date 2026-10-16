import { PricingRows } from '@/shared/components/pricing/PricingRows'
import { Skeleton } from '@/shared/ui/skeleton'

import type { CheckoutController } from '../hooks/useCheckoutController'
import { couponErrorOf } from '../lib/quote-errors'
import { QuoteCouponField } from './QuoteCouponField'
import { QuoteStaleBanner } from './QuoteStaleBanner'

export function QuoteSummary({
  checkout,
  size = 'lg',
}: {
  checkout: CheckoutController
  size?: 'lg' | 'sm'
}) {
  const { quote } = checkout
  return (
    <div className="flex flex-col items-center gap-3" aria-busy={quote.isFetching}>
      <QuoteCouponField
        appliedCode={quote.data?.coupon?.code ?? null}
        error={couponErrorOf(quote.error)}
        onApply={checkout.setCouponCode}
      />
      {(checkout.needsAcknowledge || checkout.stale) && (
        <div className="w-full">
          <QuoteStaleBanner
            changes={checkout.changes}
            outdated={checkout.stale}
            updating={checkout.refreshing || quote.isFetching}
            onUpdate={() => void checkout.refreshQuote()}
          />
        </div>
      )}
      {quote.data ? (
        <PricingRows pricing={quote.data.pricing} size={size} variant="quote" className="w-full" />
      ) : quote.isLoading ? (
        <Skeleton className="h-[150px] w-full" />
      ) : null}
    </div>
  )
}
