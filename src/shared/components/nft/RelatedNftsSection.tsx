import { useId } from 'react'

import { CarouselDots } from '@/shared/components/media/CarouselDots'
import type { NftSummary } from '@/shared/contracts/nft'
import { useScrollCarousel } from '@/shared/hooks/useScrollCarousel'

import { RelatedNftCard } from './RelatedNftCard'
import { RelatedNftCardSkeleton } from './RelatedNftCardSkeleton'
import type { RelatedCardVariant } from './related-card-variants'

type RelatedNftsSectionProps = {
  title: string
  items: NftSummary[] | undefined
  placeholderCount?: number
  variant?: RelatedCardVariant
}

const itemClass = 'w-[44%] shrink-0 snap-start md:w-[30%] lg:w-[calc((100%-96px)/5)]'

export function RelatedNftsSection({
  title,
  items,
  placeholderCount = 5,
  variant = 'detail',
}: RelatedNftsSectionProps) {
  const titleId = useId()
  const { ref, positions, index, scrollTo } = useScrollCarousel<HTMLUListElement>(
    items?.length ?? 0,
  )
  if (items?.length === 0) return null

  return (
    <section
      aria-labelledby={titleId}
      aria-roledescription="carrossel"
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <h2 id={titleId} className="type-b-17-bold text-accent">
          {title}
        </h2>
        <div aria-hidden="true" className="hairline" />
      </div>
      <ul
        ref={ref}
        aria-busy={!items}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {items
          ? items.map((nft) => (
              <li key={nft.id} className={itemClass}>
                <RelatedNftCard nft={nft} variant={variant} />
              </li>
            ))
          : Array.from({ length: placeholderCount }, (_, slot) => (
              <li key={slot} className={itemClass}>
                <RelatedNftCardSkeleton variant={variant} />
              </li>
            ))}
      </ul>
      {items && positions > 1 && (
        <CarouselDots
          count={positions}
          index={index}
          onSelect={scrollTo}
          size="lg"
          label={`Posição do carrossel ${title}`}
          className="self-center"
        />
      )}
    </section>
  )
}
