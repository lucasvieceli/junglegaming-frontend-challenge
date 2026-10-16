import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from '@/shared/lib/toast'

import { useSession } from '@/shared/session/useSession'
import { isSessionPastExpiry, sessionStore } from '@/shared/session/session-store'

const CHECK_INTERVAL_MS = 5000

export function SessionExpiryHandler() {
  const session = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (isSessionPastExpiry(sessionStore.get())) sessionStore.expire()
    }, CHECK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (session.status !== 'expired') return
    queryClient.clear()
    toast.error('Sua sessão expirou. Entre novamente.')
    const { href } = router.state.location
    sessionStore.acknowledgeExpiry()
    void router.navigate({ to: '/login', search: { redirect: href }, replace: true })
  }, [session.status, queryClient, router])

  return null
}
