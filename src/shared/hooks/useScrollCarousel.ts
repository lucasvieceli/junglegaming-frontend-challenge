import { useCallback, useEffect, useRef, useState } from 'react'

export function useScrollCarousel<T extends HTMLElement>(itemCount: number) {
  const ref = useRef<T>(null)
  const [positions, setPositions] = useState(1)
  const [index, setIndex] = useState(0)

  const step = useCallback(() => {
    const first = ref.current?.firstElementChild as HTMLElement | null
    const gap = ref.current ? parseFloat(getComputedStyle(ref.current).columnGap) || 0 : 0
    return first ? first.offsetWidth + gap : 1
  }, [])

  const measure = useCallback(() => {
    const element = ref.current
    if (!element) return
    const visible = Math.max(1, Math.round(element.clientWidth / step()))
    setPositions(Math.max(1, itemCount - visible + 1))
    setIndex(Math.round(element.scrollLeft / step()))
  }, [itemCount, step])

  useEffect(() => {
    measure()
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    element.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      element.removeEventListener('scroll', measure)
    }
  }, [measure])

  const scrollTo = (target: number) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ref.current?.scrollTo({ left: target * step(), behavior: reduce ? 'auto' : 'smooth' })
  }

  return { ref, positions, index: Math.min(index, positions - 1), scrollTo }
}
