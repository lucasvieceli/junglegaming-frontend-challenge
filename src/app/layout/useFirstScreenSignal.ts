import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

import { markFirstScreen } from '@/shared/lib/first-screen'

export function useFirstScreenSignal() {
  const router = useRouter()
  useEffect(() => {
    // Double rAF: wait until the frame is painted before the mock takes the main thread.
    const afterPaint = () => {
      requestAnimationFrame(() => requestAnimationFrame(markFirstScreen))
    }
    return router.subscribe('onRendered', afterPaint)
  }, [router])
}
