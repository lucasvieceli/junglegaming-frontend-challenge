import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto w-full max-w-[1248px] px-6', className)}>{children}</div>
}
