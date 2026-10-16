import { Slider as SliderPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/shared/lib/cn'

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbLabels: string[]
  formatValue?: (value: number) => string
}

function Slider({ className, thumbLabels, formatValue, ...props }: SliderProps) {
  const values = props.value ?? props.defaultValue ?? []
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        'relative flex h-[21px] w-full touch-none items-center select-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 grow bg-primary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {thumbLabels.map((label, index) => (
        <SliderPrimitive.Thumb
          key={label}
          aria-label={label}
          aria-valuetext={
            formatValue && values[index] !== undefined ? formatValue(values[index]) : undefined
          }
          className="block size-[21px] cursor-grab rounded-full border-[3px] border-ink bg-primary outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
