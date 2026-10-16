import { http } from '@/shared/api/http-client'
import { FavoritesResponseSchema, type FavoritesResponse } from '@/shared/contracts/favorites'

export async function getFavorites(signal?: AbortSignal): Promise<FavoritesResponse> {
  const { data } = await http.get('/favorites', { signal })
  return FavoritesResponseSchema.parse(data)
}

export async function addFavorite(nftId: string): Promise<void> {
  await http.put(`/favorites/${encodeURIComponent(nftId)}`)
}

export async function removeFavorite(nftId: string): Promise<void> {
  await http.delete(`/favorites/${encodeURIComponent(nftId)}`)
}
