import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'

import type { CatalogSearch } from '../lib/catalog-search'
import { getNfts } from './catalog.api'

export function useNftList(search: CatalogSearch) {
  return useQuery({
    queryKey: queryKeys.nfts.list(search),
    queryFn: ({ signal }) => getNfts(search, signal),
    placeholderData: keepPreviousData,
  })
}
