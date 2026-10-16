import { Breadcrumb } from '@/shared/components/layout/Breadcrumb'
import { RelatedNftsSection } from '@/shared/components/nft/RelatedNftsSection'
import type { NftDetail } from '@/shared/contracts/nft'

import { useRelatedNfts } from '../api/useRelatedNfts'
import { MobileBuyBar } from '../components/MobileBuyBar'
import { MobileDetailsSheet } from '../components/MobileDetailsSheet'
import { NftDetailTabs } from '../components/NftDetailTabs'
import { NftGallery } from '../components/NftGallery'
import { NftHeroMobile } from '../components/NftHeroMobile'
import { NftSummaryPanel } from '../components/NftSummaryPanel'
import { useEditionSelection } from '../hooks/useEditionSelection'

export function NftDetailPage({ nft }: { nft: NftDetail }) {
  const selection = useEditionSelection(nft)
  const related = useRelatedNfts(nft.relatedIds)

  return (
    <div className="flex flex-col gap-10 lg:gap-24 lg:pt-8">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: 'Início', to: '/' },
            { label: 'Mercado', to: '/', hash: 'catalog' },
          ]}
        />
        <div className="hidden gap-8 lg:flex">
          <NftGallery nft={nft} />
          <NftSummaryPanel nft={nft} selection={selection} />
        </div>
        <div className="lg:hidden">
          <NftHeroMobile nft={nft} />
          <MobileDetailsSheet nft={nft} selection={selection} />
        </div>
      </div>
      <div className="hidden lg:block">
        <NftDetailTabs nft={nft} />
      </div>
      <RelatedNftsSection title="Mais desta coleção" items={related} />
      <MobileBuyBar nft={nft} selection={selection} />
    </div>
  )
}
