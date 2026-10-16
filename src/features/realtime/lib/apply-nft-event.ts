import type { QueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import type { Cart } from '@/shared/contracts/cart'
import type { NftUpdatedPayload } from '@/shared/contracts/events'
import type { FavoritesResponse } from '@/shared/contracts/favorites'
import type {
  FeaturedResponse,
  NftDetail,
  NftListResponse,
  NftSummary,
} from '@/shared/contracts/nft'
import { compareEth } from '@/shared/lib/money'
import { quoteFreshness } from '@/shared/lib/quote-freshness'
import { toast } from '@/shared/lib/toast'

import { patchDetail, patchList, patchSummary } from './patch-nft'

export function applyNftEvent(
  queryClient: QueryClient,
  ownerKey: string,
  payload: NftUpdatedPayload,
  version: number,
) {
  queryClient.setQueriesData<NftListResponse>(
    { queryKey: queryKeys.nfts.lists },
    (list) => list && patchList(list, payload, version),
  )
  queryClient.setQueryData<NftDetail>(
    queryKeys.nfts.detail(payload.nftId),
    (nft) => nft && patchDetail(nft, payload, version),
  )
  queryClient.setQueryData<FeaturedResponse>(
    queryKeys.nfts.featured,
    (featured) =>
      featured && {
        hero: featured.hero.map((nft) => patchSummary(nft, payload, version)),
        sidebar: patchSummary(featured.sidebar, payload, version),
      },
  )
  queryClient.setQueriesData<NftSummary[]>(
    { queryKey: [...queryKeys.nfts.all, 'trending'] },
    (items) => items?.map((nft) => patchSummary(nft, payload, version)),
  )
  queryClient.setQueriesData<FavoritesResponse>(
    { queryKey: ['favorites'] },
    (favorites) =>
      favorites && { items: favorites.items.map((nft) => patchSummary(nft, payload, version)) },
  )

  const cart = queryClient.getQueryData<Cart>(queryKeys.cart(ownerKey))
  const inCart = cart?.items.find((item) => item.nftId === payload.nftId)
  if (!inCart) return
  void queryClient.invalidateQueries({ queryKey: queryKeys.cart(ownerKey) })

  const priceChanged = compareEth(payload.price, inCart.unitPrice) !== 0
  const available = payload.editions.find((edition) => edition.id === inCart.editionId)?.available
  const availabilityShort = available != null && available < inCart.quantity
  if (!priceChanged && !availabilityShort) return

  quoteFreshness.markStale()
  toast.info(
    priceChanged
      ? `O preço de ${inCart.nft.name} no seu carrinho mudou.`
      : `A disponibilidade de ${inCart.nft.name} no seu carrinho mudou.`,
  )
}
