import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { cartQuery } from '@/shared/api/cart-query'
import { quoteFreshness, useQuoteStale } from '@/shared/lib/quote-freshness'
import type { Cart } from '@/shared/contracts/cart'
import type { Network } from '@/shared/contracts/common'

import { quoteQuery, useQuote } from '../api/useQuote'

export function useCheckoutQuote(cart: Cart, network: Network | null, paused: boolean) {
  const queryClient = useQueryClient()
  const ownerKey = cart.ownerKey
  const [couponCode, setCouponCode] = useState<string | null>(cart.coupon?.code ?? null)
  const [acknowledgedQuoteId, setAcknowledgedQuoteId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const stale = useQuoteStale()
  const quote = useQuote({
    ownerKey,
    cartVersion: cart.version,
    couponCode,
    network,
    enabled: !paused,
  })
  const changes = quote.data?.changes ?? []

  const refreshQuote = async () => {
    setRefreshing(true)
    try {
      await fetchAndAcknowledge()
    } finally {
      setRefreshing(false)
    }
  }
  const fetchAndAcknowledge = async () => {
    const freshCart = await queryClient.fetchQuery(cartQuery(ownerKey))
    const fresh = await queryClient.fetchQuery(
      quoteQuery({ ownerKey, cartVersion: freshCart.version, couponCode, network }),
    )
    setAcknowledgedQuoteId(fresh.quoteId)
    quoteFreshness.markFresh()
  }

  return {
    quote,
    couponCode,
    setCouponCode,
    changes,
    stale,
    needsAcknowledge: changes.length > 0 && acknowledgedQuoteId !== quote.data?.quoteId,
    hasUnavailable: (quote.data?.items ?? cart.items).some((item) => item.status === 'unavailable'),
    refreshQuote,
    refreshing,
    resetAcknowledge: () => setAcknowledgedQuoteId(null),
  }
}
