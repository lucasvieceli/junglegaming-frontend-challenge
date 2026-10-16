import type { Cart } from '@/shared/contracts/cart'
import { computePricing, lineTotal } from '@/shared/lib/pricing'

export function withQuantity(cart: Cart, itemId: string, quantity: number): Cart {
  const items = cart.items.map((item) =>
    item.id === itemId
      ? { ...item, quantity, lineTotal: lineTotal(item.unitPrice, quantity) }
      : item,
  )
  const payable = items.filter((item) => item.status !== 'unavailable')
  return {
    ...cart,
    items,
    pricing: computePricing(payable, {
      percentOff: cart.coupon?.percentOff,
      feeNetwork: cart.pricing.feeNetwork,
    }),
  }
}
