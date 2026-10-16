import { useId } from 'react'

import { ChevronDownSmallIcon } from '@/shared/components/icons/ChevronDownSmallIcon'
import { CatalogSortSchema, type CatalogSort } from '@/shared/contracts/nft'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { CATALOG_SORTS } from '../lib/catalog-options'

export function SortSelect({
  value,
  onChange,
}: {
  value: CatalogSort
  onChange: (sort: CatalogSort) => void
}) {
  const labelId = useId()
  return (
    <div className="relative h-[18px] w-[300px] max-w-full shrink-0 whitespace-nowrap">
      <span id={labelId} className="type-b-15 absolute top-0 left-0 text-foreground">
        Ordenar por:
      </span>
      <Select value={value} onValueChange={(next) => onChange(CatalogSortSchema.parse(next))}>
        <SelectTrigger
          aria-labelledby={labelId}
          className="type-b-15 absolute inset-y-0 right-0 left-[110px] block h-[18px] w-auto rounded-none border-0 p-0 text-left whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent [&>span]:line-clamp-none"
          icon={
            <ChevronDownSmallIcon className="pointer-events-none absolute top-[6.92px] left-[170.58px] text-foreground" />
          }
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {CATALOG_SORTS.map((sort) => (
            <SelectItem key={sort.value} value={sort.value}>
              {sort.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
