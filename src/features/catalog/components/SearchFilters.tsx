import { useNavigate, useRouterState } from '@tanstack/react-router'

import type { CatalogSort } from '@/shared/contracts/nft'

import { useNftList } from '../api/useNftList'
import { catalogSearchSchema, type CatalogFilterPatch } from '../lib/catalog-search'
import { CatalogFilters } from './CatalogFilters'
import { SortSelect } from './SortSelect'

export function SearchFilters() {
  const navigate = useNavigate()
  const rawSearch = useRouterState({
    select: (state) => (state.location.pathname === '/' ? state.location.search : {}),
  })
  const search = catalogSearchSchema.parse(rawSearch)
  const list = useNftList(search)

  const apply = (patch: CatalogFilterPatch) =>
    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, ...patch, page: 1 }),
      hash: 'catalog',
      resetScroll: false,
    })

  return (
    <div className="flex flex-col gap-4">
      <SortSelect value={search.sort} onChange={(sort: CatalogSort) => apply({ sort })} />
      <CatalogFilters
        facets={list.data?.facets}
        search={search}
        onChange={apply}
        className="-mx-5 bg-transparent"
      />
    </div>
  )
}
