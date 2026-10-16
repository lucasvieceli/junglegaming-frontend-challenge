import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { createQueryClient } from '@/app/query-client'

import { AppRouterProvider } from './providers/AppRouterProvider'
import { AuthProvider } from './providers/AuthProvider'

export function App() {
  const [queryClient] = useState(createQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouterProvider />
      </AuthProvider>
    </QueryClientProvider>
  )
}
