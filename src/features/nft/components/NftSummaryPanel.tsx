import { InlineAlert } from '@/shared/components/feedback/InlineAlert'
import type { NftDetail } from '@/shared/contracts/nft'
import { formatEth } from '@/shared/lib/money'

import type { useEditionSelection } from '../hooks/useEditionSelection'
import { EditionSelector } from './EditionSelector'
import { LiveUpdateNotice } from './LiveUpdateNotice'
import { PurchaseRow } from './PurchaseRow'
import { RatingStars } from './RatingStars'
import { ShareRow } from './ShareRow'
import { TokenMeta } from './TokenMeta'

type NftSummaryPanelProps = { nft: NftDetail; selection: ReturnType<typeof useEditionSelection> }

export function NftSummaryPanel({ nft, selection }: NftSummaryPanelProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 self-stretch">
      <div className="flex flex-col gap-3">
        <h1 className="type-h-28 text-foreground">{nft.name}</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="type-t-22 text-accent">{formatEth(nft.price)}</p>
          <div className="flex items-center gap-1">
            <RatingStars value={nft.rating.average} />
            <p className="type-b-15 text-foreground">
              {nft.rating.count} avaliações de colecionadores
            </p>
          </div>
        </div>
        <LiveUpdateNotice nft={nft} />
        <div aria-hidden="true" className="hairline max-w-[573px]" />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="type-b-15-bold text-foreground">Sobre este NFT:</h2>
        <p className="type-b-14-24 text-text-secondary">{nft.about}</p>
      </div>
      <EditionSelector
        editions={nft.editions}
        selectedId={selection.edition?.id}
        onSelect={selection.selectEdition}
      />
      {selection.allSoldOut && (
        <InlineAlert tone="warning">Todas as edições estão esgotadas.</InlineAlert>
      )}
      <PurchaseRow
        nft={nft}
        editionId={selection.edition?.id}
        quantity={selection.quantity}
        maxQuantity={selection.maxQuantity}
        onQuantityChange={selection.setQuantity}
      />
      <div className="flex flex-col gap-3">
        <TokenMeta nft={nft} />
        <ShareRow name={nft.name} />
      </div>
    </div>
  )
}
