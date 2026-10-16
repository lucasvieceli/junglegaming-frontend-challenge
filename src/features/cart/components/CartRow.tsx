import { Link } from '@tanstack/react-router'

import { QuantityStepper } from '@/shared/components/forms/QuantityStepper'
import { NftImage } from '@/shared/components/media/NftImage'
import type { CartItem } from '@/shared/contracts/cart'
import { cn } from '@/shared/lib/cn'
import { formatEth } from '@/shared/lib/money'

import { useUpdateCartItem } from '../api/useUpdateCartItem'
import { itemNotice } from '../lib/cart-status'
import { RemoveItemButton } from './RemoveItemButton'

export function CartRow({ item }: { item: CartItem }) {
  const update = useUpdateCartItem()
  const notice = itemNotice(item)
  const unavailable = item.status === 'unavailable'

  return (
    <li
      aria-busy={update.isPending}
      className={cn(
        'flex min-h-[70px] items-center justify-between gap-3 bg-surface-card pr-6',
        unavailable && 'border-l-[3px] border-coral',
      )}
    >
      <div className="flex w-[250px] shrink-0 items-center gap-4">
        <div className="size-[70px] shrink-0 overflow-hidden rounded-md">
          <NftImage imageKey={item.nft.imageKey} alt="" sizes="70px" width={70} height={70} />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <Link
            to="/nfts/$nftId"
            params={{ nftId: item.nftId }}
            className="type-b-16-bold truncate text-foreground hover:text-accent"
          >
            {item.nft.name}
          </Link>
          <p className="type-b-14 text-secondary">ID do token: {item.nft.tokenId}</p>
          <p className="type-b-14 text-secondary">Edição {item.nft.editionLabel}</p>
          {notice && (
            <p role="status" className={cn('type-c-12', unavailable ? 'text-coral' : 'text-amber')}>
              {notice}
            </p>
          )}
        </div>
      </div>
      <p className="type-b-16-bold w-[77px] text-text-secondary">{formatEth(item.unitPrice)}</p>
      <div className="w-[75px]">
        <QuantityStepper
          size="sm"
          value={item.quantity}
          max={Math.max(item.maxQuantity, 1)}
          onChange={(quantity) => update.mutate({ itemId: item.id, quantity })}
          itemName={item.nft.name}
          disabled={unavailable}
          valueClassName="type-b-17-24"
        />
      </div>
      <p className="type-b-16-bold w-[87px] text-accent">{formatEth(item.lineTotal)}</p>
      <RemoveItemButton itemId={item.id} name={item.nft.name} />
    </li>
  )
}
