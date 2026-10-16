import { Link } from '@tanstack/react-router'

import { PricingRows } from '@/shared/components/pricing/PricingRows'
import type { Cart } from '@/shared/contracts/cart'

import { hasUnavailableItems } from '../lib/cart-status'
import { CheckoutCta } from './CheckoutCta'
import { CouponForm } from './CouponForm'

export function CartSummary({ cart }: { cart: Cart }) {
  return (
    <section
      aria-labelledby="cart-summary-title"
      className="flex w-full flex-col gap-6 lg:w-[332px] lg:shrink-0"
    >
      <div className="flex flex-col gap-3">
        <h2 id="cart-summary-title" className="type-b-18-bold text-foreground">
          Resumo da carteira
        </h2>
        <div aria-hidden="true" className="hairline" />
      </div>
      <CouponForm coupon={cart.coupon} variant="desktop" />
      <PricingRows pricing={cart.pricing} />
      <div className="flex flex-col items-center gap-3">
        <CheckoutCta variant="desktop" blocked={hasUnavailableItems(cart)} />
        <Link to="/" className="type-b-15 text-accent hover:underline">
          Continuar explorando
        </Link>
      </div>
    </section>
  )
}
