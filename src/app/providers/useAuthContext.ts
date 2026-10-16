import { useContext } from 'react'

import type { AuthContext } from '@/app/router-context'

import { AuthStateContext } from './auth-state-context'

export function useAuthContext(): AuthContext {
  const value = useContext(AuthStateContext)
  if (!value) throw new Error('useAuthContext must be used within <AuthProvider>')
  return value
}
