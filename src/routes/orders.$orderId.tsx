import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '@/app/guards'
import { OrderRoute } from '@/app/pages/OrderRoute'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/orders/$orderId')({
  beforeLoad: requireAuth,
  head: () => pageHead('Pedido'),
  component: OrderRoute,
})
