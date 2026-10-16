import type { NftListResponse } from '@/shared/contracts/nft'
import { cn } from '@/shared/lib/cn'

import type { CatalogFilterPatch, CatalogSearch } from '../lib/catalog-search'
import { CategoryFilter } from './CategoryFilter'
import { CatalogFiltersSkeleton } from './CatalogFiltersSkeleton'
import { NetworkFilter } from './NetworkFilter'
import { PriceRangeFilter } from './PriceRangeFilter'

type CatalogFiltersProps = {
  facets: NftListResponse['facets'] | undefined
  search: CatalogSearch
  onChange: (patch: CatalogFilterPatch) => void
  className?: string
}

export function CatalogFilters({ facets, search, onChange, className }: CatalogFiltersProps) {
  return (
    <div className={cn('bg-surface-card p-5', className)}>
      {facets ? (
        <div className="flex flex-col gap-10">
          <CategoryFilter
            facets={facets.categories}
            selected={search.categories}
            onChange={onChange}
          />
          <PriceRangeFilter
            range={facets.priceRange}
            priceMin={search.priceMin}
            priceMax={search.priceMax}
            onChange={onChange}
          />
          <NetworkFilter facets={facets.networks} selected={search.networks} onChange={onChange} />
        </div>
      ) : (
        <CatalogFiltersSkeleton />
      )}
    </div>
  )
}
