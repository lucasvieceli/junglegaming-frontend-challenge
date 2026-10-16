import type { CatalogSort, NftListResponse } from '@/shared/contracts/nft'
import { FilterIcon } from '@/shared/components/icons/FilterIcon'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/shared/ui/sheet'

import {
  countActiveFilters,
  type CatalogFilterPatch,
  type CatalogSearch,
} from '../lib/catalog-search'
import { CatalogFilters } from './CatalogFilters'
import { SortSelect } from './SortSelect'

type MobileFiltersSheetProps = {
  facets: NftListResponse['facets'] | undefined
  search: CatalogSearch
  onChange: (patch: CatalogFilterPatch) => void
}

export function MobileFiltersSheet({ facets, search, onChange }: MobileFiltersSheetProps) {
  const active = countActiveFilters(search)
  return (
    <Sheet>
      <SheetTrigger
        aria-label={active > 0 ? `Filtros, ${active} ativos` : 'Filtros'}
        className="relative flex size-[45px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] bg-gradient-filter-btn text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <FilterIcon aria-hidden="true" className="size-[22px]" />
        {active > 0 && (
          <span
            aria-hidden="true"
            className="type-tiny-10 absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-ink bg-primary text-ink"
          >
            {active}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetTitle className="type-b-18-bold px-5 pt-5 text-foreground">Filtros</SheetTitle>
        <SheetDescription className="sr-only">
          Os resultados atualizam a cada filtro escolhido.
        </SheetDescription>
        <div className="px-5 pt-5">
          <SortSelect value={search.sort} onChange={(sort: CatalogSort) => onChange({ sort })} />
        </div>
        <CatalogFilters
          facets={facets}
          search={search}
          onChange={onChange}
          className="bg-transparent"
        />
      </SheetContent>
    </Sheet>
  )
}
