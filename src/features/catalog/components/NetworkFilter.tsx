import type { Network } from '@/shared/contracts/common'
import type { NftListResponse } from '@/shared/contracts/nft'

import { toggleInList, type CatalogFilterPatch } from '../lib/catalog-search'
import { FilterOptionRow } from './FilterOptionRow'
import { FilterSection } from './FilterSection'

type NetworkFilterProps = {
  facets: NftListResponse['facets']['networks']
  selected: Network[] | undefined
  onChange: (patch: CatalogFilterPatch) => void
}

export function NetworkFilter({ facets, selected, onChange }: NetworkFilterProps) {
  return (
    <FilterSection title="Rede">
      <ul className="pl-3">
        {facets.map((facet) => (
          <li key={facet.slug}>
            <FilterOptionRow
              label={facet.name}
              count={facet.count}
              selected={selected?.includes(facet.slug) ?? false}
              onToggle={() => onChange({ networks: toggleInList(selected, facet.slug) })}
            />
          </li>
        ))}
      </ul>
    </FilterSection>
  )
}
