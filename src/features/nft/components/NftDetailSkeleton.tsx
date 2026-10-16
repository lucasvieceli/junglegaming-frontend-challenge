import { Skeleton } from '@/shared/ui/skeleton'

export function NftDetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3 pt-4 lg:pt-8">
      <Skeleton className="-mx-6 -mt-10 h-[506px] lg:hidden" />
      <Skeleton className="hidden h-4 w-40 lg:block" />
      <div className="hidden gap-8 lg:flex">
        <div className="flex gap-7">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="size-[100px] rounded-lg" />
            ))}
          </div>
          <Skeleton className="size-[min(444px,36vw)] rounded-md" />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24" />
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-[50px]" />
          <Skeleton className="h-20 w-80" />
        </div>
      </div>
    </div>
  )
}
