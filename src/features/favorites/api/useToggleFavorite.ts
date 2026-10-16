import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/shared/lib/toast'

import { queryKeys } from '@/shared/api/query-keys'
import type { FavoritesResponse } from '@/shared/contracts/favorites'
import type { NftSummary } from '@/shared/contracts/nft'

import { toggleFavoriteInList } from '../lib/toggle-favorite'
import { addFavorite, removeFavorite } from './favorites.api'

type ToggleVariables = { nft: NftSummary; next: boolean }

export function useToggleFavorite(userId: string) {
  const queryClient = useQueryClient()
  const key = queryKeys.favorites(userId)

  return useMutation({
    mutationFn: ({ nft, next }: ToggleVariables) =>
      next ? addFavorite(nft.id) : removeFavorite(nft.id),
    onMutate: async ({ nft, next }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<FavoritesResponse>(key)
      queryClient.setQueryData<FavoritesResponse>(key, (current) =>
        toggleFavoriteInList(current, nft, next),
      )
      return { previous }
    },
    onError: (_error, { next }, context) => {
      queryClient.setQueryData(key, context?.previous)
      toast.error(
        next
          ? 'Não foi possível favoritar agora.'
          : 'Não foi possível remover dos favoritos agora.',
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  })
}
