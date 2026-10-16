import { useState } from 'react'

import type { Cart } from '@/shared/contracts/cart'
import { formatEth } from '@/shared/lib/money'

export function CartChangeNotice({ cart }: { cart: Cart }) {
  const [dismissedVersion, setDismissedVersion] = useState<number | null>(null)
  const changed = cart.items.filter((item) => item.status !== 'ok')
  if (changed.length === 0 || dismissedVersion === cart.version) return null

  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-md border-l-4 border-primary bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <ul className="type-b-14-22 flex flex-col gap-1 text-foreground">
        {changed.map((item) => (
          <li key={item.id}>
            {item.status === 'price_changed' &&
              `Preço de ${item.nft.name} mudou: agora ${formatEth(item.unitPrice)}.`}
            {item.status === 'quantity_reduced' &&
              `Disponibilidade de ${item.nft.name} reduzida: máximo ${item.maxQuantity}.`}
            {item.status === 'unavailable' && `${item.nft.name} ficou indisponível.`}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setDismissedVersion(cart.version)}
        className="type-b-14-bold shrink-0 cursor-pointer text-accent hover:underline"
      >
        Entendi
      </button>
    </div>
  )
}
