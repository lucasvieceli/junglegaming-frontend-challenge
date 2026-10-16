import { cn } from '@/shared/lib/cn'
import { nftImageSrcSet, nftImageUrl, type NftImageKey } from '@/shared/lib/nft-image'

type NftImageProps = {
  imageKey: NftImageKey
  alt: string
  sizes: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function NftImage({
  imageKey,
  alt,
  sizes,
  width,
  height,
  priority = false,
  className,
}: NftImageProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={nftImageSrcSet(imageKey, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={nftImageSrcSet(imageKey, 'webp')} sizes={sizes} />
      <img
        src={nftImageUrl(imageKey, 512, 'webp')}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('block size-full object-cover', className)}
      />
    </picture>
  )
}
