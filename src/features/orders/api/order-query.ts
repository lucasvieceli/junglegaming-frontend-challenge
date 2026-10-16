import { queryOptions } from '@tanstack/react-query'

import { isClientError } from '@/shared/api/api-error'
import { http } from '@/shared/api/http-client'
import { queryKeys } from '@/shared/api/query-keys'
import { OrderSchema } from '@/shared/contracts/order'

const POLL_MS = 5000

export function orderQuery(userId: string, orderId: string, realtimeConnected: boolean) {
  return queryOptions({
    queryKey: queryKeys.orders.detail(userId, orderId),
    queryFn: async ({ signal }) =>
      OrderSchema.parse(
        (await http.get(`/orders/${encodeURIComponent(orderId)}`, { signal })).data,
      ),
    staleTime: 0,
    retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
    refetchInterval: (query) =>
      query.state.data?.status === 'pending' && !realtimeConnected ? POLL_MS : false,
  })
}
