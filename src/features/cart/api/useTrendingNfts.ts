import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'

import { getTrendingNfts } from './cart.api'

export function useTrendingNfts() {
  return useQuery({
    queryKey: [...queryKeys.nfts.all, 'trending'],
    queryFn: ({ signal }) => getTrendingNfts(signal),
    staleTime: 60_000,
  })
}
