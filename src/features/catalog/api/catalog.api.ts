import { http } from '@/shared/api/http-client'
import {
  FeaturedResponseSchema,
  NftListResponseSchema,
  type FeaturedResponse,
  type NftListResponse,
} from '@/shared/contracts/nft'

import type { CatalogSearch } from '../lib/catalog-search'

function toQueryParams(search: CatalogSearch) {
  return {
    ...search,
    categories: search.categories?.join(','),
    networks: search.networks?.join(','),
  }
}

export async function getNfts(
  search: CatalogSearch,
  signal?: AbortSignal,
): Promise<NftListResponse> {
  const { data } = await http.get('/nfts', { params: toQueryParams(search), signal })
  return NftListResponseSchema.parse(data)
}

export async function getFeaturedNfts(signal?: AbortSignal): Promise<FeaturedResponse> {
  const { data } = await http.get('/nfts/featured', { signal })
  return FeaturedResponseSchema.parse(data)
}
