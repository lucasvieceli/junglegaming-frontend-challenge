import { Link } from '@tanstack/react-router'

import { NftImage } from '@/shared/components/media/NftImage'
import type { NftSummary } from '@/shared/contracts/nft'
import { formatEth } from '@/shared/lib/money'

export function SearchSuggestions({
  items,
  onSelect,
}: {
  items: NftSummary[]
  onSelect: () => void
}) {
  return (
    <ul aria-label="Sugestões" className="flex flex-col">
      {items.map((nft) => (
        <li key={nft.id}>
          <Link
            to="/nfts/$nftId"
            params={{ nftId: nft.id }}
            onClick={onSelect}
            className="flex items-center gap-3 rounded-md px-2 py-2 outline-none hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="size-10 shrink-0 overflow-hidden rounded-lg">
              <NftImage imageKey={nft.imageKey} alt="" sizes="40px" width={40} height={40} />
            </span>
            <span className="type-b-15 min-w-0 flex-1 truncate text-foreground">{nft.name}</span>
            <span className="type-b-14-bold text-accent">{formatEth(nft.price)}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
