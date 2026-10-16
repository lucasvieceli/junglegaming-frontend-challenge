import { useState } from 'react'

import { HeartIcon } from '@/shared/components/icons/HeartIcon'
import { HeartTabIcon } from '@/shared/components/icons/HeartTabIcon'
import { cn } from '@/shared/lib/cn'

export function FavoriteIcon({ active, className }: { active: boolean; className?: string }) {
  const [previous, setPrevious] = useState(active)
  const [pops, setPops] = useState(0)
  if (previous !== active) {
    setPrevious(active)
    setPops((count) => count + 1)
  }

  return (
    <span
      key={pops}
      className={cn('inline-flex', pops > 0 && 'motion-safe:animate-[heart-pop_400ms_ease-out]')}
    >
      {active ? (
        <HeartTabIcon className={cn('text-primary', className)} />
      ) : (
        <HeartIcon className={className} />
      )}
    </span>
  )
}
