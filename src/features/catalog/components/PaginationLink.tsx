import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type PaginationLinkProps = {
  page: number
  label: string
  current?: boolean
  children: ReactNode
}

export function PaginationLink({ page, label, current = false, children }: PaginationLinkProps) {
  return (
    <Link
      to="/"
      search={(prev) => ({ ...prev, page })}
      hash="catalog"
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'flex size-[35px] items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent',
        current
          ? 'type-b-18-bold bg-primary text-ink'
          : 'type-b-18 border border-line text-foreground hover:border-primary hover:text-accent',
      )}
    >
      {children}
    </Link>
  )
}
