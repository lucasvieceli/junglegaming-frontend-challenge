import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'

import type { CatalogFilterPatch, CatalogSearch } from '../lib/catalog-search'

export function useCatalogSearch(search: CatalogSearch) {
  const navigate = useNavigate()

  const setFilter = useCallback(
    (patch: CatalogFilterPatch, options: { replace?: boolean } = {}) =>
      void navigate({
        to: '/',
        search: (prev) => ({ ...prev, ...patch, page: 1 }),
        replace: options.replace ?? false,
        resetScroll: false,
      }),
    [navigate],
  )

  const setPage = useCallback(
    (page: number) =>
      void navigate({ to: '/', search: (prev) => ({ ...prev, page }), hash: 'catalog' }),
    [navigate],
  )

  return { search, setFilter, setPage }
}
