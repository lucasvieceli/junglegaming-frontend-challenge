import { QuantityStepper } from '@/shared/components/forms/QuantityStepper'
import type { NftDetail } from '@/shared/contracts/nft'
import { Button } from '@/shared/ui/button'

import { usePurchaseActions } from '../hooks/usePurchaseActions'
import { FavoriteButton } from './FavoriteButton'

type PurchaseRowProps = {
  nft: NftDetail
  editionId: string | undefined
  quantity: number
  maxQuantity: number
  onQuantityChange: (value: number) => void
}

export function PurchaseRow({
  nft,
  editionId,
  quantity,
  maxQuantity,
  onQuantityChange,
}: PurchaseRowProps) {
  const purchase = usePurchaseActions(nft, editionId, quantity)
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="relative">
        <QuantityStepper
          value={quantity}
          max={Math.max(maxQuantity, 1)}
          onChange={onQuantityChange}
          itemName={nft.name}
          disabled={!editionId}
        />
        <p
          className="type-c-13 absolute top-full left-0 mt-1 whitespace-nowrap text-coral"
          aria-live="polite"
        >
          {editionId && quantity >= maxQuantity && `Máximo disponível: ${maxQuantity}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="none"
          className="type-b-14-bold-20 h-10 w-[130px]"
          disabled={!purchase.canBuy || purchase.isAdding}
          onClick={() => void purchase.addToCart()}
        >
          {purchase.isAdding ? 'ADICIONANDO…' : 'COMPRAR'}
        </Button>
        <FavoriteButton
          active={purchase.favorite}
          disabled={!purchase.hasActions}
          onToggle={purchase.toggleFavorite}
        />
      </div>
    </div>
  )
}
