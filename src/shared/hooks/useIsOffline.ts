import { useSyncExternalStore } from 'react'

import { isApiUnreachable, subscribeNetworkStatus } from '@/shared/lib/network-status'

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  const unsubscribe = subscribeNetworkStatus(onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
    unsubscribe()
  }
}

export function useIsOffline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !navigator.onLine || isApiUnreachable(),
    () => false,
  )
}
