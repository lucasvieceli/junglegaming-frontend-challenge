import { Skeleton } from '@/shared/ui/skeleton'

const ROW_HEIGHTS = { categories: 9, networks: 3 }

export function CatalogFiltersSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: ROW_HEIGHTS.categories }, (_, index) => (
          <Skeleton key={index} className="mx-3 my-3 h-4" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="ml-3 h-[21px]" />
        <Skeleton className="ml-3 h-[18px] w-48" />
        <Skeleton className="ml-3 h-9 w-[82px]" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-16" />
        {Array.from({ length: ROW_HEIGHTS.networks }, (_, index) => (
          <Skeleton key={index} className="my-3 ml-3 h-4" />
        ))}
      </div>
    </div>
  )
}
