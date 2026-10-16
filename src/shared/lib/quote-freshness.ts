import { useSyncExternalStore } from 'react'

let stale = false
const listeners = new Set<() => void>()

function set(value: boolean) {
  if (stale === value) return
  stale = value
  listeners.forEach((listener) => listener())
}

export const quoteFreshness = {
  markStale: () => set(true),
  markFresh: () => set(false),
}

export function useQuoteStale(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => stale,
    () => false,
  )
}
