export const NFT_IMAGE_KEYS = ['emerald-ape', 'sage-nomad', 'ivory-baron', 'golden-beat'] as const
export type NftImageKey = (typeof NFT_IMAGE_KEYS)[number]

export const NFT_IMAGE_WIDTHS = [256, 512, 1024] as const
export type NftImageFormat = 'avif' | 'webp'

export function nftImageUrl(key: NftImageKey, width: number, format: NftImageFormat): string {
  return `/images/nfts/${key}-${width}.${format}`
}

export function nftImageSrcSet(key: NftImageKey, format: NftImageFormat): string {
  return NFT_IMAGE_WIDTHS.map((width) => `${nftImageUrl(key, width, format)} ${width}w`).join(', ')
}
