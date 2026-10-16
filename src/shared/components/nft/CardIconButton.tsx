import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export function CardIconButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'flex cursor-pointer items-center justify-center border border-line bg-surface-raised text-primary outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
