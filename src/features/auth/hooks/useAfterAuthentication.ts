import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import type { AuthResponse } from '@/shared/contracts/auth'

import { mergeGuestCart } from '../api/auth.api'
import { sessionStore } from '@/shared/session/session-store'
import { safeRedirect } from '../lib/safe-redirect'

export function useAfterAuthentication(redirect: string | undefined) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return async (response: AuthResponse) => {
    sessionStore.authenticate(response)
    try {
      await mergeGuestCart()
    } catch {
      // Merge failure is non-fatal: the user's own cart stays valid.
    }
    queryClient.removeQueries({ queryKey: ['cart'] })
    queryClient.removeQueries({ queryKey: ['quote'] })
    await navigate({ href: safeRedirect(redirect), replace: true })
  }
}
