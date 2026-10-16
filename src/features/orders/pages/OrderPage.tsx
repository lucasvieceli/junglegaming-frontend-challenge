import { useQuery } from '@tanstack/react-query'

import { isApiError } from '@/shared/api/api-error'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { NotFoundPage } from '@/shared/components/feedback/NotFoundPage'
import { Skeleton } from '@/shared/ui/skeleton'

import { orderQuery } from '../api/order-query'
import { OrderBackdrop } from '../components/OrderBackdrop'
import { LazyOrderConfirmationModal } from '../components/LazyOrderConfirmationModal'
import { OrderStatusView } from '../components/OrderStatusView'
import { useOrderSettled } from '../hooks/useOrderSettled'

type OrderPageProps = { userId: string; orderId: string; realtimeConnected: boolean }

export function OrderPage({ userId, orderId, realtimeConnected }: OrderPageProps) {
  const order = useQuery(orderQuery(userId, orderId, realtimeConnected))
  useOrderSettled(order.data)

  if (order.isPending) return <Skeleton className="mt-8 h-[60vh]" />
  if (order.isError) {
    if (isApiError(order.error) && (order.error.status === 403 || order.error.status === 404)) {
      return (
        <NotFoundPage
          title="Pedido não encontrado"
          description="Este pedido não existe ou pertence a outra conta."
        />
      )
    }
    return (
      <ErrorState
        title="Não foi possível carregar o pedido"
        onRetry={() => void order.refetch()}
        isRetrying={order.isFetching}
      />
    )
  }
  if (order.data.status !== 'confirmed') return <OrderStatusView order={order.data} />
  return (
    <>
      <h1 className="sr-only">Pedido confirmado</h1>
      <OrderBackdrop order={order.data} />
      <LazyOrderConfirmationModal order={order.data} />
    </>
  )
}
