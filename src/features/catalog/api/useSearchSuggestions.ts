import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'

import { DEFAULT_CATALOG_SEARCH } from '../lib/catalog-search'
import { getNfts } from './catalog.api'

export function useSearchSuggestions(q: string) {
  const search = { ...DEFAULT_CATALOG_SEARCH, q }
  return useQuery({
    queryKey: queryKeys.nfts.list(search),
    queryFn: ({ signal }) => getNfts(search, signal),
    enabled: q.length >= 2,
    select: (data) => data.items.slice(0, 5),
  })
}
