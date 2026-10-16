import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { queryKeys } from '@/shared/api/query-keys'
import { formatEth } from '@/shared/lib/money'

import { getOrders } from '../api/profile.api'

const STATUS_LABELS = { pending: 'em processamento', confirmed: 'confirmado', declined: 'recusado' }

export function LatestOrder({ userId }: { userId: string }) {
  const orders = useQuery({
    queryKey: queryKeys.orders.list(userId),
    queryFn: ({ signal }) => getOrders(signal),
  })
  const latest = orders.data?.[0]
  if (!latest) return null
  return (
    <section
      aria-labelledby="latest-order"
      className="flex flex-col gap-2 rounded-md bg-surface-card p-4"
    >
      <h2 id="latest-order" className="type-b-15-bold text-foreground">
        Último pedido
      </h2>
      <p className="type-b-14-22 text-text-secondary">
        {latest.number} · {formatEth(latest.pricing.total)} · {STATUS_LABELS[latest.status]}
      </p>
      <Link
        to="/orders/$orderId"
        params={{ orderId: latest.id }}
        className="type-b-14-bold text-accent hover:underline"
      >
        Ver pedido
      </Link>
    </section>
  )
}
