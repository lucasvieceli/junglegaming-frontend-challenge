import { queryOptions, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import type { Network } from '@/shared/contracts/common'

import { postQuote } from './checkout.api'

export type QuoteParams = {
  ownerKey: string
  cartVersion: number
  couponCode: string | null
  network: Network | null
}

export function quoteQuery({ ownerKey, cartVersion, couponCode, network }: QuoteParams) {
  return queryOptions({
    queryKey: queryKeys.quote(ownerKey, cartVersion, couponCode, network),
    queryFn: () =>
      postQuote({ couponCode: couponCode ?? undefined, network: network ?? undefined }),
    staleTime: 0,
    gcTime: 5_000,
  })
}

export function useQuote(params: QuoteParams & { enabled: boolean }) {
  return useQuery({ ...quoteQuery(params), enabled: params.enabled })
}
