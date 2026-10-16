import type { CatalogSort } from '@/shared/contracts/nft'

import { CatalogTabs } from './CatalogTabs'
import { SortSelect } from './SortSelect'

export function CatalogToolbar({
  sort,
  onSortChange,
}: {
  sort: CatalogSort
  onSortChange: (sort: CatalogSort) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 lg:h-[18px]">
      <CatalogTabs />
      <div className="hidden md:block">
        <SortSelect value={sort} onChange={onSortChange} />
      </div>
    </div>
  )
}
