import { useEffect, useMemo, useState, type ReactNode } from 'react'

import type { AuthContext } from '@/app/router-context'
import { apiReady } from '@/shared/api/api-gate'
import { configureHttpAuth } from '@/shared/api/http-auth'
import { getGuestId } from '@/shared/session/guest-id'
import { sessionStore } from '@/shared/session/session-store'
import { useSession } from '@/shared/session/useSession'

import { AuthStateContext } from './auth-state-context'
import { validateStoredSession } from './validate-stored-session'

function connectHttpToSession() {
  configureHttpAuth({
    getToken: () => sessionStore.get().token,
    getGuestId,
    onUnauthorized: () => sessionStore.expire(),
  })
}

function waitForSession(): Promise<void> {
  return new Promise((resolve) => {
    if (sessionStore.get().status !== 'loading') return resolve()
    const unsubscribe = sessionStore.subscribe(() => {
      if (sessionStore.get().status === 'loading') return
      unsubscribe()
      resolve()
    })
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  useState(connectHttpToSession)
  const [ready] = useState(waitForSession)
  const session = useSession()

  useEffect(() => {
    void apiReady.then(() => {
      sessionStore.boot()
      if (sessionStore.get().status === 'loading') void validateStoredSession()
    })
  }, [])

  const value = useMemo<AuthContext>(
    () => ({ status: session.status, userId: session.user?.id ?? null, ready }),
    [session.status, session.user?.id, ready],
  )
  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>
}
