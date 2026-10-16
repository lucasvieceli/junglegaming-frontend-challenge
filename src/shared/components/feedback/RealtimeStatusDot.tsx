import { cn } from '@/shared/lib/cn'

export type RealtimeState = 'connected' | 'reconnecting' | 'offline'

const STATES: Record<RealtimeState, { color: string; label: string }> = {
  connected: { color: 'bg-success', label: 'Atualizações em tempo real ativas' },
  reconnecting: {
    color: 'bg-amber animate-pulse motion-reduce:animate-none',
    label: 'Reconectando às atualizações em tempo real…',
  },
  offline: { color: 'bg-coral', label: 'Atualizações em tempo real indisponíveis' },
}

export function RealtimeStatusDot({
  state,
  lastEventId,
}: {
  state: RealtimeState
  lastEventId?: string | null
}) {
  const { color, label } = STATES[state]
  return (
    <span
      data-testid="realtime-status"
      data-state={state}
      data-last-event-id={lastEventId ?? ''}
      title={label}
      className="inline-flex items-center"
    >
      <span aria-hidden="true" className={cn('size-2 rounded-full', color)} />
      <span className="sr-only" role="status">
        {label}
      </span>
    </span>
  )
}
