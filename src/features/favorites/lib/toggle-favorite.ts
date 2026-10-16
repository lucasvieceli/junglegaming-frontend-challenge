import type { FavoritesResponse } from '@/shared/contracts/favorites'
import type { NftSummary } from '@/shared/contracts/nft'

export function toggleFavoriteInList(
  current: FavoritesResponse | undefined,
  nft: NftSummary,
  next: boolean,
): FavoritesResponse {
  const items = (current?.items ?? []).filter((item) => item.id !== nft.id)
  return { items: next ? [...items, nft] : items }
}
