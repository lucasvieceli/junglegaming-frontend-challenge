import { useNavigate } from '@tanstack/react-router'

import { ThankYouIllustration } from '@/shared/components/icons/ThankYouIllustration'
import { OrderItemRow } from '@/shared/components/nft/OrderItemRow'
import type { Order } from '@/shared/contracts/order'
import { NETWORK_EXPLORERS, NETWORK_LABELS } from '@/shared/lib/network-label'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'

import { ReceiptTotals } from './ReceiptTotals'
import { TransactionMeta } from './TransactionMeta'

export function OrderConfirmationModal({ order }: { order: Order }) {
  const navigate = useNavigate()
  return (
    <Dialog open onOpenChange={(open) => !open && void navigate({ to: '/account/profile' })}>
      <DialogContent
        className="top-6 flex w-[578px] max-w-[calc(100vw-1rem)] translate-y-0 flex-col lg:top-[166px]"
        closeLabel="Fechar recibo"
        closeClassName="top-[11px] right-[7px]"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          const dialog = event.currentTarget as HTMLElement
          dialog.focus()
        }}
      >
        <div className="flex min-h-[156px] flex-col items-center justify-center gap-4 px-6 py-[22px]">
          <ThankYouIllustration aria-hidden="true" className="h-20 w-[65px] text-primary" />
          <DialogTitle className="type-b-16-bold text-center text-text-secondary">
            Seus NFTs agora estão na sua carteira
          </DialogTitle>
          <DialogDescription className="sr-only">Recibo do pedido {order.number}</DialogDescription>
        </div>
        <div aria-hidden="true" className="h-px bg-primary" />
        <TransactionMeta order={order} />
        <div aria-hidden="true" className="h-px bg-primary" />
        <div className="flex flex-col gap-3 px-6 pt-5 pb-12 sm:px-11">
          <h3 className="type-b-15-bold text-foreground">Detalhes da transação</h3>
          <div aria-hidden="true" className="flex items-center justify-between text-foreground">
            <span className="type-b-16-bold">NFTs</span>
            <span className="flex items-center gap-12">
              <span className="type-b-16-bold">Edições</span>
              <span className="type-b-16-medium-16">Subtotal</span>
            </span>
          </div>
          <div aria-hidden="true" className="hairline" />
          <ul aria-label="NFTs comprados" className="flex flex-col gap-3">
            {order.items.map((item) => (
              <OrderItemRow key={`${item.nftId}-${item.editionId}`} item={item} variant="receipt" />
            ))}
          </ul>
          <ReceiptTotals pricing={order.pricing} />
          <div aria-hidden="true" className="hairline" />
          <p className="type-b-14-22 text-center text-text-secondary">
            Transação confirmada na {NETWORK_LABELS[order.wallet.network]}. A propriedade foi
            transferida para sua carteira conectada e registrada na rede.
          </p>
          {order.transaction && (
            <a
              href={order.transaction.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-b-16-bold mt-2 self-center rounded-[5px] bg-primary p-4 text-ink outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
            >
              Ver no {NETWORK_EXPLORERS[order.wallet.network].name}
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
