import { Link } from '@tanstack/react-router'

import { DangerIcon } from '@/shared/components/icons/DangerIcon'
import type { Order } from '@/shared/contracts/order'
import { Button } from '@/shared/ui/button'

export function OrderStatusView({ order }: { order: Order }) {
  if (order.status === 'pending') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center"
      >
        <span
          aria-hidden="true"
          className="size-12 animate-spin rounded-full border-4 border-line border-t-primary motion-reduce:animate-none"
        />
        <h1 className="type-h-24 text-foreground">Pagamento em processamento</h1>
        <p className="type-b-14-24 max-w-[480px] text-text-secondary">
          Pedido {order.number}: aguardando a confirmação da rede. Você pode sair desta página; o
          recibo fica disponível aqui.
        </p>
      </div>
    )
  }
  return (
    <div
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center"
    >
      <DangerIcon aria-hidden="true" className="size-12 text-coral" />
      <h1 className="type-h-24 text-foreground">Pagamento recusado</h1>
      <p className="type-b-14-24 max-w-[480px] text-text-secondary">
        {order.declineReason ?? 'A rede recusou a transação.'} Nenhum valor foi cobrado e seus itens
        continuam no carrinho.
      </p>
      <Button asChild className="type-b-16-bold-20">
        <Link to="/cart">Voltar ao carrinho</Link>
      </Button>
    </div>
  )
}
