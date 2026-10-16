import type { ReactNode } from 'react'

export function FavoritesGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-x-[34px] lg:gap-y-[72px]">
      {children}
    </ul>
  )
}
