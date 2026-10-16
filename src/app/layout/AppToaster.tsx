import { lazy, Suspense } from 'react'

import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { DESKTOP_QUERY } from '@/shared/lib/breakpoints'

const Toaster = lazy(() =>
  import('@/shared/ui/sonner').then((module) => ({ default: module.Toaster })),
)

export function AppToaster() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  return (
    <Suspense fallback={null}>
      <Toaster position={isDesktop ? 'bottom-right' : 'top-center'} />
    </Suspense>
  )
}
