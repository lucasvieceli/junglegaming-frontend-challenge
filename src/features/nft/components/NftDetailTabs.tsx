import type { NftDetail } from '@/shared/contracts/nft'
import { cn } from '@/shared/lib/cn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import { DetailsPanel } from './DetailsPanel'
import { ReviewItem } from './ReviewItem'

const triggerClass =
  'type-b-17 border-b-[3px] pb-3 text-left lg:pb-[9px] data-[state=active]:font-bold data-[state=active]:text-accent'

export function NftDetailTabs({ nft }: { nft: NftDetail }) {
  return (
    <Tabs defaultValue="details" className="gap-3">
      <div className="flex flex-col">
        <TabsList
          aria-label="Informações do NFT"
          className="gap-8 overflow-x-auto"
          indicatorClassName="h-[3px]"
        >
          <TabsTrigger value="details" className={cn(triggerClass, 'lg:min-w-[161px]')}>
            Detalhes do NFT
          </TabsTrigger>
          <TabsTrigger value="reviews" className={triggerClass}>
            Avaliações de colecionadores ({nft.rating.count})
          </TabsTrigger>
        </TabsList>
        <div aria-hidden="true" className="hairline lg:-mt-px" />
      </div>
      <TabsContent value="details">
        <DetailsPanel nft={nft} />
      </TabsContent>
      <TabsContent value="reviews" className="flex flex-col gap-6">
        {nft.reviews.map((review) => (
          <ReviewItem key={`${review.author}-${review.date}`} review={review} />
        ))}
      </TabsContent>
    </Tabs>
  )
}
