import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/shared/lib/cn'

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-[filter,background-color,color,border-color] outline-none select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-ink hover:brightness-110',
        outline: 'border border-primary bg-transparent text-accent hover:bg-primary/10',
        'ghost-link': 'bg-transparent text-accent hover:underline underline-offset-4',
        pill: 'bg-gradient-cta text-ink hover:brightness-110',
      },
      size: {
        sm: 'h-[35px] px-3',
        md: 'h-10 px-3',
        lg: 'h-[45px] px-4',
        xl: 'h-[60px] px-6',
        icon: 'size-10',
        none: '',
      },
      radius: {
        xs: 'rounded-xs',
        sm: 'rounded-[5px]',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-[10px]',
        pill: 'rounded-pill',
        none: 'rounded-none',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', radius: 'md' },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, radius, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, radius }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
