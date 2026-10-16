import { Link } from '@tanstack/react-router'
import { memo, useRef, useState } from 'react'

import { NftImage } from '@/shared/components/media/NftImage'
import type { NftSummary } from '@/shared/contracts/nft'
import { markArtworkSource } from '@/shared/lib/artwork-transition'
import { cn } from '@/shared/lib/cn'

import { MobileFavoriteButton } from './MobileFavoriteButton'
import { NftCardActionBar } from './NftCardActionBar'
import { LazyNftLightbox } from './LazyNftLightbox'
import { PriceTag } from './PriceTag'
import { RareBadge } from './RareBadge'

const IMAGE_SIZES = '(min-width: 1024px) 250px, (min-width: 768px) 30vw, 45vw'

function NftCardView({
  nft,
  priority = false,
  staggered = false,
}: {
  nft: NftSummary
  priority?: boolean
  staggered?: boolean
}) {
  const [zoomOpen, setZoomOpen] = useState(false)
  const artworkRef = useRef<HTMLDivElement>(null)

  return (
    <article className="group relative flex min-w-0 flex-col gap-2 lg:gap-3">
      <div
        className={cn(
          'relative rounded-[20px] bg-gradient-tile px-1 pt-3 pb-5 lg:rounded-none lg:bg-surface-card lg:bg-none lg:pt-6 lg:pb-[26px]',
          staggered && 'max-md:pt-5 max-md:pb-3',
        )}
      >
        {nft.rare && <RareBadge className="top-4" />}
        <div
          ref={artworkRef}
          className="aspect-square overflow-hidden rounded-[16px] lg:rounded-[15px]"
        >
          <NftImage
            imageKey={nft.imageKey}
            alt=""
            sizes={IMAGE_SIZES}
            width={250}
            height={250}
            priority={priority}
            className="transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
        <MobileFavoriteButton nft={nft} />
        <NftCardActionBar nft={nft} onZoom={() => setZoomOpen(true)} />
      </div>
      <div className="flex flex-col pl-2 lg:gap-1.5 lg:pl-0">
        <h3 className="type-b-15 truncate text-foreground lg:type-b-16">
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
        <PriceTag price={nft.price} previousPrice={nft.previousPrice} />
        {nft.availability === 'sold_out' && <p className="type-c-13 text-coral">Esgotado</p>}
      </div>
      <LazyNftLightbox
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        name={nft.name}
        imageKey={nft.imageKey}
      />
    </article>
  )
}

export const NftCard = memo(NftCardView)
