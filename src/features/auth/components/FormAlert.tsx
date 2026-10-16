import type { ReactNode } from 'react'

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="type-c-13 rounded-[5px] border border-coral px-3 py-2 text-coral">
      {children}
    </p>
  )
}
