import { useRouterState } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

function isViewTransitionActive() {
  try {
    return document.documentElement.matches(':active-view-transition')
  } catch {
    return false
  }
}

export function RouteTransition({ depth, children }: { depth: number; children: ReactNode }) {
  const matchId = useRouterState({ select: (state) => state.matches[depth]?.id ?? '' })
  const [entry, setEntry] = useState({ matchId, animate: false })
  if (entry.matchId !== matchId) setEntry({ matchId, animate: !isViewTransitionActive() })

  return (
    <div
      key={matchId}
      className={cn(
        'flex flex-1 flex-col',
        entry.animate && 'animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out',
      )}
    >
      {children}
    </div>
  )
}
