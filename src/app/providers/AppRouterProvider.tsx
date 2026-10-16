import { useQueryClient } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useState } from 'react'

import { createAppRouter } from '@/app/router'

import { useAuthContext } from './useAuthContext'

export function AppRouterProvider() {
  const auth = useAuthContext()
  const queryClient = useQueryClient()
  const [router] = useState(() => createAppRouter({ auth, queryClient }))
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}
