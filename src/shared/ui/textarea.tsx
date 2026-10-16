import * as React from 'react'

import { cn } from '@/shared/lib/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'type-b-14-22 h-[152px] w-full resize-none rounded-xs border border-line bg-transparent p-3 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-coral',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
