import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { removeKeysWithPrefix } from '@/shared/lib/storage'

import { logout } from '../api/auth.api'
import { sessionStore } from '@/shared/session/session-store'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return async () => {
    try {
      await logout()
    } catch {
      // Local logout proceeds even if the server call fails.
    }
    sessionStore.clear()
    queryClient.clear()
    removeKeysWithPrefix('checkout.')
    removeKeysWithPrefix('checkout.', 'session')
    await navigate({ to: '/' })
  }
}
