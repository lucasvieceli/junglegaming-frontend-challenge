import { Breadcrumb } from '@/shared/components/layout/Breadcrumb'
import { OrderItemRow } from '@/shared/components/nft/OrderItemRow'
import type { Order } from '@/shared/contracts/order'
import { NETWORK_LABELS } from '@/shared/lib/network-label'
import { shortAddress } from '@/shared/lib/short-address'

export function OrderBackdrop({ order }: { order: Order }) {
  const rows = [
    ['Nome de exibição', order.collector.displayName],
    ['Nome de usuário', order.collector.username],
    ['E-mail', order.collector.email],
    ['Nome do perfil', order.collector.profileName],
    ['Rede', NETWORK_LABELS[order.wallet.network]],
    ['Endereço da carteira', shortAddress(order.wallet.address)],
  ]
  return (
    <div inert aria-hidden="true" className="hidden flex-col gap-8 pt-8 lg:flex">
      <Breadcrumb
        items={[{ label: 'Início', to: '/' }, { label: 'Mercado' }, { label: 'Pagamento' }]}
      />
      <div className="flex gap-8">
        <div className="grid flex-1 grid-cols-2 content-start gap-x-6 gap-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-2.5">
              <span className="type-b-15-15 text-foreground">{label}</span>
              <span className="type-b-14-15 flex h-10 items-center rounded-xs border border-line px-3 text-text-secondary">
                {value}
              </span>
            </div>
          ))}
        </div>
        <ul className="flex w-[405px] flex-col gap-3">
          {order.items.map((item) => (
            <OrderItemRow key={`${item.nftId}-${item.editionId}`} item={item} />
          ))}
        </ul>
      </div>
    </div>
  )
}
