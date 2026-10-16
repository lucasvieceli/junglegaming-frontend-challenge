import { useState } from 'react'

import type { NftDetail } from '@/shared/contracts/nft'
import { formatEth } from '@/shared/lib/money'

type Snapshot = Pick<NftDetail, 'price' | 'availability'>

const AVAILABILITY_LABELS: Record<NftDetail['availability'], string> = {
  available: 'disponível',
  low: 'poucas unidades',
  sold_out: 'esgotado',
}

export function LiveUpdateNotice({ nft }: { nft: NftDetail }) {
  const [seen, setSeen] = useState<Snapshot>({ price: nft.price, availability: nft.availability })
  const priceChanged = seen.price !== nft.price
  const availabilityChanged = seen.availability !== nft.availability

  // Empty live region leaves the flex flow but stays in the a11y tree.
  return (
    <div role="status" aria-live="polite" className="empty:absolute">
      {(priceChanged || availabilityChanged) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border-l-4 border-primary bg-surface-raised px-4 py-3">
          <p className="type-b-14-22 text-foreground">
            {priceChanged &&
              `Preço atualizado: ${formatEth(seen.price)} → ${formatEth(nft.price)}. `}
            {availabilityChanged && `Disponibilidade: ${AVAILABILITY_LABELS[nft.availability]}.`}
          </p>
          <button
            type="button"
            onClick={() => setSeen({ price: nft.price, availability: nft.availability })}
            className="type-b-14-bold cursor-pointer text-accent hover:underline"
          >
            Entendi
          </button>
        </div>
      )}
    </div>
  )
}
