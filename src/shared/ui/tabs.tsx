import { Tabs as TabsPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/shared/lib/cn'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />
  )
}

type Indicator = { left: number; width: number; animate: boolean }

function useActiveTabIndicator(list: React.RefObject<HTMLDivElement | null>) {
  const [indicator, setIndicator] = React.useState<Indicator | null>(null)

  React.useLayoutEffect(() => {
    const element = list.current
    if (!element) return
    const measure = () => {
      const active = element.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
      if (!active) return
      setIndicator((current) => ({
        left: active.offsetLeft,
        width: active.offsetWidth,
        animate: current !== null,
      }))
    }
    measure()
    const mutations = new MutationObserver(measure)
    mutations.observe(element, { subtree: true, attributes: true, attributeFilter: ['data-state'] })
    const resizes = new ResizeObserver(measure)
    resizes.observe(element)
    return () => {
      mutations.disconnect()
      resizes.disconnect()
    }
  }, [list])

  return indicator
}

function TabsList({
  className,
  indicatorClassName,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { indicatorClassName?: string }) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const indicator = useActiveTabIndicator(listRef)
  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn('relative flex items-start gap-5', className)}
      {...props}
    >
      {children}
      {indicator && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 h-0.5 bg-primary',
            indicator.animate &&
              'transition-[transform,width] duration-300 ease-out motion-reduce:transition-none',
            indicatorClassName,
          )}
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
      )}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'type-b-15-medium cursor-pointer border-b-2 border-transparent pb-[5px] whitespace-nowrap text-foreground transition-colors outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:text-accent',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
