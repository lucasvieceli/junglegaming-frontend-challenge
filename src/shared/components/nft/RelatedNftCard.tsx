import { Link } from '@tanstack/react-router'
import { useRef } from 'react'

import { NftImage } from '@/shared/components/media/NftImage'
import type { NftSummary } from '@/shared/contracts/nft'
import { markArtworkSource } from '@/shared/lib/artwork-transition'
import { cn } from '@/shared/lib/cn'

import { PriceTag } from './PriceTag'
import { RELATED_CARD_VARIANTS, type RelatedCardVariant } from './related-card-variants'

const IMAGE_SIZES = '(min-width: 1024px) 212px, (min-width: 768px) 30vw, 44vw'

export function RelatedNftCard({
  nft,
  variant = 'detail',
}: {
  nft: NftSummary
  variant?: RelatedCardVariant
}) {
  const styles = RELATED_CARD_VARIANTS[variant]
  const artworkRef = useRef<HTMLDivElement>(null)
  return (
    <article className={cn('group relative flex min-w-0 flex-col', styles.card)}>
      <div className="flex aspect-[219/255] items-center bg-surface-card px-1 lg:aspect-auto lg:h-[255px]">
        <div ref={artworkRef} className={cn('aspect-square w-full overflow-hidden', styles.art)}>
          <NftImage
            imageKey={nft.imageKey}
            alt=""
            sizes={IMAGE_SIZES}
            width={212}
            height={212}
            className="transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
      </div>
      <div className={cn('flex flex-col', styles.text)}>
        <h3 className="type-b-15 truncate text-foreground">
          <Link
            to="/nfts/$nftId"
            params={{ nftId: nft.id }}
            viewTransition
            onClick={() => markArtworkSource(artworkRef.current)}
            className={cn(
              'outline-none after:absolute after:inset-0 after:content-[""] hover:text-accent',
              'focus-visible:after:ring-2 focus-visible:after:ring-accent',
            )}
          >
            {nft.name}
          </Link>
        </h3>
        <PriceTag price={nft.price} previousPrice={nft.previousPrice} size="sm" />
        {nft.availability === 'sold_out' && <p className="type-c-13 text-coral">Esgotado</p>}
      </div>
    </article>
  )
}
