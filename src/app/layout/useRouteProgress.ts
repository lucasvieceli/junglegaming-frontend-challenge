import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export type RouteProgressPhase = 'idle' | 'start' | 'loading' | 'done'

const SHOW_DELAY_MS = 150
const HIDE_AFTER_MS = 500

export function useRouteProgress(): RouteProgressPhase {
  const isChangingRoute = useRouterState({
    select: (state) =>
      state.status === 'pending' && state.location.pathname !== state.resolvedLocation?.pathname,
  })
  const [shown, setShown] = useState(false)
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    if (!isChangingRoute) return
    let frame = 0
    const timer = setTimeout(() => {
      setShown(true)
      setGrown(false)
      // Double rAF: paint the bar at 0 before growing it so the transition runs.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setGrown(true))
      })
    }, SHOW_DELAY_MS)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [isChangingRoute])

  useEffect(() => {
    if (isChangingRoute || !shown) return
    const timer = setTimeout(() => setShown(false), HIDE_AFTER_MS)
    return () => clearTimeout(timer)
  }, [isChangingRoute, shown])

  if (!shown) return 'idle'
  if (!isChangingRoute) return 'done'
  return grown ? 'loading' : 'start'
}
