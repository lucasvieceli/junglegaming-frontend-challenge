import type { QueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'

export function reconcile(queryClient: QueryClient, ownerKey: string) {
  const active = { type: 'active' as const }
  void queryClient.invalidateQueries({ queryKey: queryKeys.cart(ownerKey), ...active })
  void queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all, ...active })
  void queryClient.invalidateQueries({ queryKey: ['orders'], ...active })
  void queryClient.invalidateQueries({ queryKey: ['quote'], ...active })
}
