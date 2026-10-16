import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'

import { getFavorites } from './favorites.api'

export function useFavorites(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.favorites(userId ?? 'guest'),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: userId !== null,
  })
}
