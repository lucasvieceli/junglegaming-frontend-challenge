import type { ReactNode } from 'react'

export function WalletSectionHeading({
  id,
  title,
  actions,
  subtitle,
}: {
  id: string
  title: string
  actions?: ReactNode
  subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 id={id} className="type-b-17-bold text-foreground">
          {title}
        </h2>
        {actions}
      </div>
      {subtitle && <p className="type-b-14-15 text-text-secondary">{subtitle}</p>}
    </div>
  )
}
