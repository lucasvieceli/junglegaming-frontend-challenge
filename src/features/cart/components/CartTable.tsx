import type { Cart } from '@/shared/contracts/cart'

import { CartRow } from './CartRow'

export function CartTable({ cart }: { cart: Cart }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 lg:max-w-[782px]">
      <div
        aria-hidden="true"
        className="flex items-center justify-between gap-3 pr-6 text-foreground"
      >
        <span className="type-b-16-bold w-[250px]">NFTs</span>
        <span className="type-b-16-medium-16 w-[77px]">Preço</span>
        <span className="type-b-16-bold w-[75px]">Edições</span>
        <span className="type-b-16-medium-16 w-[87px]">Total</span>
        <span className="w-6" />
      </div>
      <div aria-hidden="true" className="hairline" />
      <ul aria-label="Itens do carrinho" className="flex flex-col gap-3">
        {cart.items.map((item) => (
          <CartRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  )
}
