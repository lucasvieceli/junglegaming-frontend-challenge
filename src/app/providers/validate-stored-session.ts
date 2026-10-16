import { getSession } from '@/features/auth/api/auth.api'
import { isApiError } from '@/shared/api/api-error'
import { sessionStore } from '@/shared/session/session-store'

export async function validateStoredSession(): Promise<void> {
  try {
    sessionStore.authenticate(await getSession())
  } catch (error) {
    const stored = sessionStore.get()
    if (isApiError(error) && error.status === 401) sessionStore.clear()
    else if (stored.user && stored.token && stored.expiresAt) {
      sessionStore.authenticate({
        user: stored.user,
        session: { token: stored.token, expiresAt: stored.expiresAt },
      })
    } else sessionStore.clear()
  }
}
