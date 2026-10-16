import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  as: Heading = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4 py-12 text-center', className)}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center text-secondary [&_svg]:size-12"
        >
          {icon}
        </span>
      )}
      <Heading
        className={
          Heading === 'h1' ? 'type-h-28 text-foreground' : 'type-b-18-bold-24 text-foreground'
        }
      >
        {title}
      </Heading>
      {description && (
        <p className="type-b-14-24 max-w-[480px] text-text-secondary">{description}</p>
      )}
      {action}
    </div>
  )
}
