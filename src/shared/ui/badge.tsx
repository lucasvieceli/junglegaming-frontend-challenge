import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/cn'

const badgeVariants = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      rare: 'type-c-13-medium h-8 w-[68px] justify-start bg-primary pl-2 text-ink',
      count: 'type-tiny-10 size-4 rounded-full border-2 border-ink bg-primary text-ink',
    },
  },
  defaultVariants: { variant: 'rare' },
})

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
