import type { ReactNode } from 'react'

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="type-t-20 text-foreground">{children}</h1>
}
