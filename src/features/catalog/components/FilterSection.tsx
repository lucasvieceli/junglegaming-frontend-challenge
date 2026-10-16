import { useId, type ReactNode } from 'react'

export function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <h2 id={titleId} className="type-b-18-bold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}
