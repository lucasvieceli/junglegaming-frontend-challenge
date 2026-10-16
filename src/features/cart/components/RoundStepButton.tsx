import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export function RoundStepButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line before:absolute before:-inset-[10px] before:content-[""] bg-surface-raised text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:text-line-soft',
        className,
      )}
      {...props}
    />
  )
}
