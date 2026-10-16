import type { Ref } from 'react'

import { NftImage } from '@/shared/components/media/NftImage'
import type { NftSummary } from '@/shared/contracts/nft'
import { cn } from '@/shared/lib/cn'
import { Skeleton } from '@/shared/ui/skeleton'

type HeroMobileArtProps = {
  current: NftSummary | undefined
  next: NftSummary | undefined
  priority: boolean
  className?: string
  artworkRef?: Ref<HTMLDivElement>
}

const FRAME_CLASS = 'relative h-[146px] w-[138px] shrink-0'

export function HeroMobileArt({
  current,
  next,
  priority,
  className,
  artworkRef,
}: HeroMobileArtProps) {
  if (!current) {
    return (
      <div className={FRAME_CLASS}>
        <Skeleton className="size-[138px] rounded-[16px]" />
      </div>
    )
  }
  return (
    <div className={cn(FRAME_CLASS, className)}>
      <div ref={artworkRef} className="size-[138px] overflow-hidden rounded-[16px]">
        <NftImage
          imageKey={current.imageKey}
          alt={current.name}
          sizes="138px"
          width={138}
          height={138}
          priority={priority}
        />
      </div>
      {next && next !== current && (
        <div className="absolute top-[88px] left-3.5 size-[58px] overflow-hidden rounded-[16px]">
          <NftImage imageKey={next.imageKey} alt="" sizes="58px" width={58} height={58} />
        </div>
      )}
    </div>
  )
}
