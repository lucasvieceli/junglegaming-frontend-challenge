import type { NftListResponse } from '@/shared/contracts/nft'

import { toggleInList, type CatalogFilterPatch } from '../lib/catalog-search'
import { FilterOptionRow } from './FilterOptionRow'
import { FilterSection } from './FilterSection'

type CategoryFilterProps = {
  facets: NftListResponse['facets']['categories']
  selected: string[] | undefined
  onChange: (patch: CatalogFilterPatch) => void
}

export function CategoryFilter({ facets, selected, onChange }: CategoryFilterProps) {
  return (
    <FilterSection title="Coleções">
      <ul className="px-3">
        {facets.map((facet) => (
          <li key={facet.slug}>
            <FilterOptionRow
              label={facet.name}
              count={facet.count}
              boldCount
              selected={selected?.includes(facet.slug) ?? false}
              onToggle={() => onChange({ categories: toggleInList(selected, facet.slug) })}
            />
          </li>
        ))}
      </ul>
    </FilterSection>
  )
}
