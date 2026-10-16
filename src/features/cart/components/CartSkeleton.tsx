import { Skeleton } from '@/shared/ui/skeleton'

export function CartSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6 lg:flex-row lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 lg:max-w-[782px]">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[100px] rounded-[14px] lg:h-[70px] lg:rounded-none" />
        ))}
      </div>
      <Skeleton className="h-[320px] lg:w-[332px]" />
    </div>
  )
}
