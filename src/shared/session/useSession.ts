import { useSyncExternalStore } from 'react'

import { sessionStore, type SessionState } from '@/shared/session/session-store'

export function useSession(): SessionState {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.get, sessionStore.get)
}
