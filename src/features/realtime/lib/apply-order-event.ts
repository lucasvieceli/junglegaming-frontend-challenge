import type { QueryClient } from '@tanstack/react-query'
import { toast } from '@/shared/lib/toast'

import { queryKeys } from '@/shared/api/query-keys'
import type { OrderUpdatedPayload } from '@/shared/contracts/events'
import type { Order } from '@/shared/contracts/order'

export function applyOrderEvent(
  queryClient: QueryClient,
  userId: string,
  payload: OrderUpdatedPayload,
  version: number,
) {
  const key = queryKeys.orders.detail(userId, payload.orderId)
  queryClient.setQueryData<Order>(key, (order) =>
    order && order.status === 'pending'
      ? {
          ...order,
          status: payload.status,
          transaction: payload.transaction,
          declineReason: payload.declineReason,
          version,
        }
      : order,
  )
  void queryClient.invalidateQueries({ queryKey: key })
  if (payload.status === 'confirmed') {
    void queryClient.invalidateQueries({ queryKey: queryKeys.cart(`user:${userId}`) })
    void queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all })
    toast.success('Pedido confirmado.')
  } else if (payload.status === 'declined') {
    toast.error('Pagamento recusado.')
  }
}
