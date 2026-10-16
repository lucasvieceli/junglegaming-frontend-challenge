import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'

import { getFeaturedNfts } from './catalog.api'

export function useFeaturedNfts() {
  return useQuery({
    queryKey: queryKeys.nfts.featured,
    queryFn: ({ signal }) => getFeaturedNfts(signal),
    staleTime: 60_000,
  })
}
