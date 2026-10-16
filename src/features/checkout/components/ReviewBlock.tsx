import type { ReactNode } from 'react'

export function ReviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="type-b-15-bold text-foreground">{title}</h3>
      <p className="type-b-14-22 text-text-secondary">{children}</p>
    </div>
  )
}
