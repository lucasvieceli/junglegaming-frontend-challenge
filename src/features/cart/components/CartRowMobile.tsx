import { MinusIcon } from '@/shared/components/icons/MinusIcon'
import { PlusIcon } from '@/shared/components/icons/PlusIcon'
import { TrashIcon } from '@/shared/components/icons/TrashIcon'
import { NftImage } from '@/shared/components/media/NftImage'
import type { CartItem } from '@/shared/contracts/cart'
import { cn } from '@/shared/lib/cn'
import { formatEth } from '@/shared/lib/money'

import { useRemoveCartItem } from '../api/useRemoveCartItem'
import { useUpdateCartItem } from '../api/useUpdateCartItem'
import { itemNotice } from '../lib/cart-status'
import { RoundStepButton } from './RoundStepButton'

export function CartRowMobile({ item }: { item: CartItem }) {
  const update = useUpdateCartItem()
  const remove = useRemoveCartItem()
  const notice = itemNotice(item)
  const unavailable = item.status === 'unavailable'
  const atMin = item.quantity <= 1
  const atMax = item.quantity >= item.maxQuantity

  return (
    <li
      aria-busy={update.isPending || remove.isPending}
      className={cn(
        'flex min-h-[100px] overflow-hidden rounded-[14px] bg-surface-card shadow-card-mobile',
        unavailable && 'ring-2 ring-coral',
      )}
    >
      <div className="w-[100px] shrink-0">
        <NftImage
          imageKey={item.nft.imageKey}
          alt=""
          sizes="100px"
          width={100}
          height={100}
          className="h-full"
        />
      </div>
      <div className="relative flex min-w-0 flex-1 pt-[13px] pr-4 pb-[15px] pl-[9px]">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="type-b-15-bold truncate text-foreground">{item.nft.name}</p>
          <p className="type-b-14 text-text-secondary">Edição: {item.nft.editionLabel}</p>
          {notice && (
            <p className={cn('type-c-12', unavailable ? 'text-coral' : 'text-amber')}>{notice}</p>
          )}
          <p className="type-b-18-bold mt-auto pt-2 whitespace-nowrap text-accent">
            {formatEth(item.lineTotal)}
          </p>
        </div>
        <div
          className="flex items-center gap-3"
          role="group"
          aria-label={`Quantidade de ${item.nft.name}`}
        >
          {atMin ? (
            <RoundStepButton
              aria-label={`Remover ${item.nft.name}`}
              onClick={() => remove.mutate(item.id)}
              className="border-0 bg-transparent text-primary"
            >
              <TrashIcon className="h-[18.5px] w-[16.4px]" />
            </RoundStepButton>
          ) : (
            <RoundStepButton
              aria-label={`Diminuir quantidade de ${item.nft.name}`}
              onClick={() => update.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
            >
              <MinusIcon className="size-3.5" />
            </RoundStepButton>
          )}
          <output aria-live="polite" className="type-b-16-22 min-w-3 text-center text-foreground">
            {item.quantity}
          </output>
          <RoundStepButton
            aria-label={`Aumentar quantidade de ${item.nft.name}`}
            disabled={atMax || unavailable}
            onClick={() => update.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
          >
            <PlusIcon className="size-3.5" />
          </RoundStepButton>
        </div>
      </div>
    </li>
  )
}
