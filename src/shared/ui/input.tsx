import * as React from 'react'

import { cn } from '@/shared/lib/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'type-b-14 h-10 w-full min-w-0 rounded-xs border border-line bg-transparent px-3 text-foreground transition-colors outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-coral read-only:text-text-secondary',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
