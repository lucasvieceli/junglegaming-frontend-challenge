import { Skeleton } from '@/shared/ui/skeleton'

export function CheckoutSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6 pt-8 lg:flex-row lg:gap-8">
      <div className="grid flex-1 gap-3 lg:grid-cols-2 lg:gap-x-6">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="h-[65px]" />
        ))}
      </div>
      <Skeleton className="h-[480px] lg:w-[405px]" />
    </div>
  )
}
