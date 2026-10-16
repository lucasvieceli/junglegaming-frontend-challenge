import type { KeyboardEvent } from 'react'

import { NftImage } from '@/shared/components/media/NftImage'
import type { NftDetail } from '@/shared/contracts/nft'
import { cn } from '@/shared/lib/cn'

type GalleryThumbnailsProps = {
  nft: NftDetail
  count: number
  selected: number
  onSelect: (index: number) => void
}

export function GalleryThumbnails({ nft, count, selected, onSelect }: GalleryThumbnailsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    const next = (selected + step + count) % count
    onSelect(next)
    event.currentTarget.querySelectorAll('button')[next]?.focus()
  }

  return (
    <div
      role="group"
      aria-label="Vistas do NFT"
      onKeyDown={handleKeyDown}
      className="flex w-[100px] flex-col gap-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Vista ${index + 1}`}
          aria-pressed={index === selected}
          tabIndex={index === selected ? 0 : -1}
          onClick={() => onSelect(index)}
          className={cn(
            'size-[100px] cursor-pointer overflow-hidden rounded-lg border outline-none focus-visible:ring-2 focus-visible:ring-accent',
            index === selected ? 'border-primary' : 'border-transparent',
          )}
        >
          <NftImage imageKey={nft.imageKey} alt="" sizes="100px" width={100} height={100} />
        </button>
      ))}
    </div>
  )
}
