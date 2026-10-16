import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

export function NftGrid({
  children,
  className,
  busy = false,
}: {
  children: ReactNode
  className?: string
  busy?: boolean
}) {
  return (
    <ul
      aria-label="NFTs"
      aria-busy={busy}
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-6 pb-8 max-md:[&>li:nth-child(even)]:translate-y-8 md:grid-cols-3 md:gap-6 md:pb-0 lg:gap-x-[34px] lg:gap-y-[72px]',
        busy && 'opacity-70 transition-opacity',
        className,
      )}
    >
      {children}
    </ul>
  )
}
