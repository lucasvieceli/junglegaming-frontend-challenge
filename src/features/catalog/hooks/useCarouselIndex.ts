import { useState } from 'react'

type Direction = 'next' | 'prev'

export function useCarouselIndex(count: number) {
  const [index, setIndexState] = useState(0)
  const [direction, setDirection] = useState<Direction | null>(null)
  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0
  const setIndex = (next: number) => {
    if (next === safeIndex) return
    setDirection(next > safeIndex ? 'next' : 'prev')
    setIndexState(next)
  }
  return { index: safeIndex, setIndex, direction }
}
