import { queryOptions } from '@tanstack/react-query'

import { isClientError } from '@/shared/api/api-error'
import { queryKeys } from '@/shared/api/query-keys'

import { getNft } from './nft.api'

export function nftDetailQuery(id: string) {
  return queryOptions({
    queryKey: queryKeys.nfts.detail(id),
    queryFn: ({ signal }) => getNft(id, signal),
    staleTime: 60_000,
    retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
  })
}
