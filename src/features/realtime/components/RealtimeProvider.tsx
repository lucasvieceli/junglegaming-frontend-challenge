import { useMemo, type ReactNode } from 'react'

import { useRealtimeSocket } from '../hooks/useRealtimeSocket'
import { RealtimeContext } from '../lib/realtime-context'

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { state, isConnected, lastEventId } = useRealtimeSocket()
  const value = useMemo(
    () => ({ state, isConnected, lastEventId }),
    [state, isConnected, lastEventId],
  )
  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}
