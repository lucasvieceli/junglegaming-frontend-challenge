import { PricingRows } from '@/shared/components/pricing/PricingRows'
import type { Cart } from '@/shared/contracts/cart'

import { hasUnavailableItems } from '../lib/cart-status'
import { CheckoutCta } from './CheckoutCta'
import { CouponForm } from './CouponForm'

export function CartSummaryMobile({ cart }: { cart: Cart }) {
  return (
    <section
      aria-label="Resumo do pagamento"
      className="-mx-7 mt-2 flex flex-1 flex-col justify-between gap-8 rounded-t-pill bg-surface-card px-6 pt-6 pb-9"
    >
      <div className="flex flex-col gap-3">
        <CouponForm coupon={cart.coupon} variant="mobile" showLabel={false} />
        <PricingRows pricing={cart.pricing} size="sm" />
      </div>
      <CheckoutCta variant="mobile" blocked={hasUnavailableItems(cart)} />
    </section>
  )
}
