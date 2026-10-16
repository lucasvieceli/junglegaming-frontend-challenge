import { NftImage } from '@/shared/components/media/NftImage'
import { cn } from '@/shared/lib/cn'
import { formatEth } from '@/shared/lib/money'
import type { NftImageKey } from '@/shared/lib/nft-image'

export type OrderItemRowData = {
  name: string
  tokenId: string
  imageKey: NftImageKey
  editionLabel: string
  quantity: number
  lineTotal: string
}

const VARIANTS = {
  summary: { row: 'gap-2 pr-4 pl-1', values: 'gap-5' },
  receipt: { row: 'gap-3', values: 'gap-6 sm:gap-12' },
}

export function OrderItemRow({
  item,
  variant = 'summary',
}: {
  item: OrderItemRowData
  variant?: keyof typeof VARIANTS
}) {
  const styles = VARIANTS[variant]
  return (
    <li className={cn('flex min-h-[70px] items-center bg-surface-card', styles.row)}>
      <div className="size-[62px] shrink-0 overflow-hidden rounded-lg lg:size-[70px]">
        <NftImage imageKey={item.imageKey} alt="" sizes="70px" width={70} height={70} />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 lg:shrink-0">
        <p className="type-b-16-bold break-words text-foreground lg:whitespace-nowrap">
          {item.name}
        </p>
        <p className="type-b-14 break-words text-secondary lg:whitespace-nowrap">
          ID do token: {item.tokenId}
          <span className="sr-only">, edição {item.editionLabel}</span>
        </p>
      </div>
      <div className={cn('ml-auto flex shrink-0 items-center text-right', styles.values)}>
        <p className="type-b-14 text-text-secondary">
          <span className="sr-only">Quantidade: </span>(x {item.quantity})
        </p>
        <p className="type-b-18-bold text-accent">{formatEth(item.lineTotal)}</p>
      </div>
    </li>
  )
}
