import type { QueryClient } from '@tanstack/react-query'

export interface AuthContext {
  status: 'loading' | 'guest' | 'authenticated' | 'expired'
  userId: string | null
  ready: Promise<void>
}

export interface RouterContext {
  auth: AuthContext
  queryClient: QueryClient
}
