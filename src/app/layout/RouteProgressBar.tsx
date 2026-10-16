import { cn } from '@/shared/lib/cn'

import { useRouteProgress, type RouteProgressPhase } from './useRouteProgress'

const PHASE_CLASSES: Record<Exclude<RouteProgressPhase, 'idle'>, string> = {
  start: 'scale-x-0',
  loading: 'scale-x-[0.85] [transition:transform_8s_cubic-bezier(0.1,0.6,0.3,1)]',
  done: 'scale-x-100 opacity-0 [transition:transform_200ms_ease-out,opacity_300ms_ease_200ms]',
}

export function RouteProgressBar() {
  const phase = useRouteProgress()
  if (phase === 'idle') return null
  return (
    <div
      role="progressbar"
      aria-label="Carregando página"
      data-phase={phase}
      className={cn(
        'bg-accent pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left',
        PHASE_CLASSES[phase],
      )}
    />
  )
}
