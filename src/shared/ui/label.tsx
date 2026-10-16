import { Label as LabelPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/shared/lib/cn'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'type-b-15-15 inline-flex items-center text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
