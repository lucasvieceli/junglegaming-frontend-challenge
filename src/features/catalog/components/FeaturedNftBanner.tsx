import { Link } from '@tanstack/react-router'
import { useRef } from 'react'

import { NftImage } from '@/shared/components/media/NftImage'
import type { NftSummary } from '@/shared/contracts/nft'
import { markArtworkSource } from '@/shared/lib/artwork-transition'

export function FeaturedNftBanner({ nft }: { nft: NftSummary }) {
  const artworkRef = useRef<HTMLDivElement>(null)
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: nft.id }}
      viewTransition
      onClick={() => markArtworkSource(artworkRef.current)}
      aria-label={`NFT em destaque: ${nft.name}, oferta limitada`}
      className="relative flex h-[470px] flex-col gap-4 overflow-hidden bg-gradient-featured pt-6 pb-1 outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <p aria-hidden="true" className="type-h-24-32 px-5 text-accent">
        NFT EM DESTAQUE
      </p>
      <p aria-hidden="true" className="type-t-22 px-5 text-center text-foreground">
        OFERTA LIMITADA
      </p>
      <div ref={artworkRef} className="h-[368px] shrink-0 overflow-hidden rounded-[22px]">
        <NftImage imageKey={nft.imageKey} alt="" sizes="310px" width={310} height={368} />
      </div>
      <span
        aria-hidden="true"
        className="absolute top-[299px] left-4 size-[22px] rounded-[7px] border-2 border-featured-green opacity-20"
      />
      <span
        aria-hidden="true"
        className="bg-gradient-orb absolute top-[343px] left-[248px] size-[45px] rounded-full"
      />
      <span
        aria-hidden="true"
        className="bg-gradient-orb absolute top-[105px] left-[38px] size-[15px] rounded-full"
      />
    </Link>
  )
}
