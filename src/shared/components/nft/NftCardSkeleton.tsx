import { Skeleton } from '@/shared/ui/skeleton'

export function NftCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <Skeleton className="aspect-[175/200] rounded-[20px] lg:aspect-[258/300] lg:rounded-none" />
      <div className="flex flex-col pl-2 lg:gap-1.5 lg:pl-0">
        <Skeleton className="h-5 w-3/4 lg:h-4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
