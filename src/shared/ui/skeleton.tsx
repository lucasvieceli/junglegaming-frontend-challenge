import { cn } from '@/shared/lib/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      data-testid="skeleton"
      aria-hidden="true"
      className={cn('skeleton', className)}
      {...props}
    />
  )
}

export { Skeleton }
