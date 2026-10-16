import { createContext, useContext } from 'react'

import type { RealtimeState } from '@/shared/components/feedback/RealtimeStatusDot'

export type RealtimeValue = {
  state: RealtimeState
  isConnected: boolean
  lastEventId: string | null
}

const OFFLINE: RealtimeValue = { state: 'offline', isConnected: false, lastEventId: null }

export const RealtimeContext = createContext<RealtimeValue>(OFFLINE)

export function useRealtime(): RealtimeValue {
  return useContext(RealtimeContext)
}
