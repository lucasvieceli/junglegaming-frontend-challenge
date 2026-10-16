import { PricingRows } from '@/shared/components/pricing/PricingRows'
import type { Quote } from '@/shared/contracts/cart'
import type { CreateOrderRequest } from '@/shared/contracts/order'
import { NETWORK_LABELS } from '@/shared/lib/network-label'
import { shortAddress } from '@/shared/lib/short-address'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'

import { OrderItemsList } from './OrderItemsList'
import { ReviewBlock } from './ReviewBlock'

type ReviewOrderDialogProps = {
  order: CreateOrderRequest | null
  quote: Quote | undefined
  walletLabel: string
  walletAddress: string
  busy: boolean
  onBack: () => void
  onConfirm: (order: CreateOrderRequest) => void
}

export function ReviewOrderDialog({
  order,
  quote,
  walletLabel,
  walletAddress,
  busy,
  onBack,
  onConfirm,
}: ReviewOrderDialogProps) {
  return (
    <Dialog open={order !== null} onOpenChange={(open) => !open && onBack()}>
      <DialogContent className="flex w-[578px] max-w-[calc(100vw-2rem)] flex-col gap-5 px-9 pt-8 pb-9">
        <DialogTitle className="type-b-16-bold" tabIndex={-1}>
          Revise seu pedido
        </DialogTitle>
        <DialogDescription className="sr-only">
          Confira os dados antes de confirmar a compra.
        </DialogDescription>
        {order && quote && (
          <>
            <ReviewBlock title="Colecionador">
              {order.collector.displayName} · {order.collector.ensName}.eth ·{' '}
              {order.collector.email}
            </ReviewBlock>
            <ReviewBlock title="Carteira e rede">
              {walletLabel} · {shortAddress(walletAddress)} · {NETWORK_LABELS[order.network]}
            </ReviewBlock>
            <OrderItemsList items={quote.items} />
            <PricingRows pricing={quote.pricing} />
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                radius="lg"
                className="type-b-15-bold flex-1"
                onClick={onBack}
              >
                Voltar
              </Button>
              <Button
                size="lg"
                radius="lg"
                className="type-b-15-bold flex-1"
                disabled={busy}
                aria-busy={busy}
                onClick={() => onConfirm(order)}
              >
                {busy ? 'Confirmando…' : 'Confirmar compra'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
