import { RealtimeStatusDot } from '@/shared/components/feedback/RealtimeStatusDot'

import { useRealtime } from '../lib/realtime-context'

export function RealtimeIndicator() {
  const { state, lastEventId } = useRealtime()
  return (
    <span className="sr-only">
      <RealtimeStatusDot state={state} lastEventId={lastEventId} />
    </span>
  )
}
