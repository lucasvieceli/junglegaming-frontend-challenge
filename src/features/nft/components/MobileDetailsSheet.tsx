import type { NftDetail } from '@/shared/contracts/nft'

import type { useEditionSelection } from '../hooks/useEditionSelection'
import { EditionSelector } from './EditionSelector'
import { LiveUpdateNotice } from './LiveUpdateNotice'
import { RatingPill } from './RatingPill'
import { TokenMeta } from './TokenMeta'

type MobileDetailsSheetProps = { nft: NftDetail; selection: ReturnType<typeof useEditionSelection> }

export function MobileDetailsSheet({ nft, selection }: MobileDetailsSheetProps) {
  return (
    <div className="relative -mx-6 -mt-[114px] flex flex-col gap-3 rounded-t-[31px] bg-surface-card px-6 pt-8 pb-6 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <h1 className="type-t-20 min-w-0 text-foreground">{nft.name}</h1>
        <RatingPill average={nft.rating.average} count={nft.rating.count} />
      </div>
      <LiveUpdateNotice nft={nft} />
      <p className="type-b-14-24 text-text-secondary">{nft.about}</p>
      <EditionSelector
        editions={nft.editions}
        selectedId={selection.edition?.id}
        onSelect={selection.selectEdition}
      />
      <TokenMeta nft={nft} />
    </div>
  )
}
