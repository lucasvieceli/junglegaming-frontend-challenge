import { useEffect, useEffectEvent, useState } from 'react'

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

import { SEARCH_DEBOUNCE_MS } from '../lib/search-constants'

export function useSearchDraft(
  applied: string | undefined,
  onCommit: (value: string | undefined) => void,
) {
  const [draft, setDraft] = useState(applied ?? '')
  const [lastApplied, setLastApplied] = useState(applied)
  if (lastApplied !== applied) {
    setLastApplied(applied)
    setDraft(applied ?? '')
  }

  const debounced = useDebouncedValue(draft, SEARCH_DEBOUNCE_MS)
  const commit = useEffectEvent((text: string) => {
    const next = text.trim() || undefined
    if (next !== applied) onCommit(next)
  })
  useEffect(() => commit(debounced), [debounced])

  return { draft, setDraft }
}
