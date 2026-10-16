import { OrderItemRow } from '@/shared/components/nft/OrderItemRow'
import type { CartItem } from '@/shared/contracts/cart'

export function OrderItemsList({ items }: { items: CartItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden="true" className="flex items-center justify-between text-foreground">
        <span className="type-b-16-bold">NFTs</span>
        <span className="type-b-16-medium-16">Subtotal</span>
      </div>
      <div aria-hidden="true" className="hairline -mb-px" />
      <ul aria-label="NFTs do pedido" className="flex flex-col gap-3">
        {items.map((item) => (
          <OrderItemRow
            key={item.id}
            item={{ ...item.nft, quantity: item.quantity, lineTotal: item.lineTotal }}
          />
        ))}
      </ul>
    </div>
  )
}
