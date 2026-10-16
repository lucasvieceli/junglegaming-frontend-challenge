import { useState } from 'react'

import { ZoomIcon } from '@/shared/components/icons/ZoomIcon'
import { NftImage } from '@/shared/components/media/NftImage'
import { LazyNftLightbox } from '@/shared/components/nft/LazyNftLightbox'
import type { NftDetail } from '@/shared/contracts/nft'
import { artworkTargetProps } from '@/shared/lib/artwork-transition'

import { GALLERY_VIEWS } from '../lib/gallery'
import { GalleryThumbnails } from './GalleryThumbnails'

export function NftGallery({ nft }: { nft: NftDetail }) {
  const [selected, setSelected] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  return (
    <div className="relative flex shrink-0 items-center gap-7 self-start">
      <GalleryThumbnails
        nft={nft}
        count={GALLERY_VIEWS}
        selected={selected}
        onSelect={setSelected}
      />
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        aria-label={`Ampliar ${nft.name}`}
        className="group relative size-[min(444px,36vw)] cursor-zoom-in rounded-md bg-surface-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div {...artworkTargetProps} className="size-full overflow-hidden rounded-[24px]">
          <NftImage
            imageKey={nft.imageKey}
            alt={`${nft.name}, vista ${selected + 1} de ${GALLERY_VIEWS}`}
            sizes="404px"
            width={404}
            height={404}
            priority
            className="transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        </div>
        <span className="absolute top-[13px] right-3 flex size-[30px] items-center justify-center rounded-full">
          <ZoomIcon className="size-[30px]" />
        </span>
      </button>
      <LazyNftLightbox
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        name={nft.name}
        imageKey={nft.imageKey}
      />
    </div>
  )
}
