import { createContext } from 'react'

import type { AuthContext } from '@/app/router-context'

export const AuthStateContext = createContext<AuthContext | null>(null)
