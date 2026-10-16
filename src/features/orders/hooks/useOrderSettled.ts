import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { queryKeys } from '@/shared/api/query-keys'
import type { Order } from '@/shared/contracts/order'
import { checkoutAttemptKey } from '@/shared/lib/checkout-keys'
import { removeKey } from '@/shared/lib/storage'

export function useOrderSettled(order: Order | undefined) {
  const queryClient = useQueryClient()
  const status = order?.status
  const userId = order?.userId

  useEffect(() => {
    if (!userId || (status !== 'confirmed' && status !== 'declined')) return
    removeKey(checkoutAttemptKey(userId))
    if (status !== 'confirmed') return
    void queryClient.invalidateQueries({ queryKey: queryKeys.cart(`user:${userId}`) })
    void queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all })
  }, [status, userId, queryClient])
}
