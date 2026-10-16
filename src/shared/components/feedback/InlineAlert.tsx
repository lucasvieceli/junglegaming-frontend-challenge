import type { ReactNode } from 'react'

import { DangerIcon } from '@/shared/components/icons/DangerIcon'
import { cn } from '@/shared/lib/cn'

const TONES = {
  info: { border: 'border-primary', icon: 'text-primary' },
  warning: { border: 'border-amber', icon: 'text-amber' },
  error: { border: 'border-coral', icon: 'text-coral' },
} as const

type InlineAlertProps = {
  tone?: keyof typeof TONES
  title?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export function InlineAlert({
  tone = 'info',
  title,
  children,
  action,
  className,
}: InlineAlertProps) {
  const colors = TONES[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-md border-l-4 bg-surface-card p-4',
        colors.border,
        className,
      )}
    >
      <DangerIcon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', colors.icon)} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="type-b-15-bold text-foreground">{title}</p>}
        <div className="type-b-14-22 text-text-secondary">{children}</div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  )
}
