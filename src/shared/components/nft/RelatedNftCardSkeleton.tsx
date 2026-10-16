import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/lib/cn'

import { RELATED_CARD_VARIANTS, type RelatedCardVariant } from './related-card-variants'

export function RelatedNftCardSkeleton({ variant = 'detail' }: { variant?: RelatedCardVariant }) {
  const styles = RELATED_CARD_VARIANTS[variant]
  return (
    <div className={cn('flex flex-col', styles.card)}>
      <Skeleton className="aspect-[219/255] lg:aspect-auto lg:h-[255px]" />
      <div className={cn('flex flex-col', styles.text)}>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
