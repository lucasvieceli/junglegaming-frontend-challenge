import { QuantityStepper } from '@/shared/components/forms/QuantityStepper'
import { ShopIcon } from '@/shared/components/icons/ShopIcon'
import type { NftDetail } from '@/shared/contracts/nft'
import { formatEth } from '@/shared/lib/money'

import type { useEditionSelection } from '../hooks/useEditionSelection'
import { usePurchaseActions } from '../hooks/usePurchaseActions'

type MobileBuyBarProps = { nft: NftDetail; selection: ReturnType<typeof useEditionSelection> }

export function MobileBuyBar({ nft, selection }: MobileBuyBarProps) {
  const purchase = usePurchaseActions(nft, selection.edition?.id, selection.quantity)
  const blocked = !purchase.canBuy || purchase.isAdding

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-pill bg-surface-card px-6 pt-5 pb-[max(36px,env(safe-area-inset-bottom))] drop-shadow-[0_0_10px_rgba(10,6,4,0.45)] lg:hidden">
      <div className="mx-auto flex max-w-[480px] flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="type-b-15-medium text-text-secondary" aria-hidden="true">
              Qtd.
            </p>
            <QuantityStepper
              size="sm"
              value={selection.quantity}
              max={Math.max(selection.maxQuantity, 1)}
              onChange={selection.setQuantity}
              itemName={nft.name}
              disabled={!selection.edition}
            />
          </div>
          <p className="type-t-20 text-accent">{formatEth(nft.price)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={blocked}
            onClick={() => void purchase.buyNow()}
            className="type-b-16-bold-20 flex h-[60px] w-[196px] cursor-pointer items-center justify-center rounded-pill bg-gradient-cta-buy text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selection.allSoldOut ? 'Esgotado' : 'Comprar NFT'}
          </button>
          <button
            type="button"
            disabled={blocked}
            onClick={() => void purchase.addToCart()}
            aria-label={`Adicionar ${nft.name} ao carrinho`}
            className="flex size-[60px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-raised text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShopIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
