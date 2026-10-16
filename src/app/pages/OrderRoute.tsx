import { getRouteApi } from '@tanstack/react-router'

import { OrderPage } from '@/features/orders/pages/OrderPage'
import { useRealtime } from '@/features/realtime/lib/realtime-context'
import { useSession } from '@/shared/session/useSession'

const routeApi = getRouteApi('/orders/$orderId')

export function OrderRoute() {
  const userId = useSession().user?.id
  const { orderId } = routeApi.useParams()
  const { isConnected } = useRealtime()
  return userId ? (
    <OrderPage
      key={`${userId}-${orderId}`}
      userId={userId}
      orderId={orderId}
      realtimeConnected={isConnected}
    />
  ) : null
}
