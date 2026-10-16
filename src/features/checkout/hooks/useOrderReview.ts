import { useState } from 'react'

import type { CreateOrderRequest } from '@/shared/contracts/order'

import type { CheckoutController } from './useCheckoutController'

export function useOrderReview(checkout: CheckoutController) {
  const [review, setReview] = useState<CreateOrderRequest | null>(null)
  const [preparing, setPreparing] = useState(false)

  const prepare = async (then: (order: CreateOrderRequest) => void) => {
    if (preparing) return
    setPreparing(true)
    try {
      const order = await checkout.prepareOrder()
      if (order) then(order)
    } finally {
      setPreparing(false)
    }
  }

  const confirm = (order: CreateOrderRequest) => {
    void checkout.submission.submit(order)
  }

  return {
    review,
    preparing,
    start: () => prepare(setReview),
    prepareAndSubmit: () => prepare(confirm),
    confirm,
    close: () => setReview(null),
  }
}
