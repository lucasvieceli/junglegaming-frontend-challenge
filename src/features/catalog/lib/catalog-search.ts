import { z } from 'zod'

import { EthAmountSchema, NetworkSchema } from '@/shared/contracts/common'
import { CatalogSortSchema, CatalogTabSchema } from '@/shared/contracts/nft'
import { csvList } from '@/shared/lib/search-params'

export const CATALOG_SEARCH_DEFAULTS = { sort: 'recent', tab: 'all', page: 1 } as const

export const catalogSearchSchema = z.object({
  q: z.string().trim().max(60).optional().catch(undefined),
  categories: csvList(z.string()).catch(undefined),
  networks: csvList(NetworkSchema).catch(undefined),
  priceMin: EthAmountSchema.optional().catch(undefined),
  priceMax: EthAmountSchema.optional().catch(undefined),
  sort: CatalogSortSchema.default('recent').catch('recent'),
  tab: CatalogTabSchema.default('all').catch('all'),
  page: z.coerce.number().int().min(1).default(1).catch(1),
})

export type CatalogSearch = z.infer<typeof catalogSearchSchema>

export type CatalogFilterPatch = Partial<Omit<CatalogSearch, 'page'>>

export const DEFAULT_CATALOG_SEARCH: CatalogSearch = catalogSearchSchema.parse({})

export const CLEARED_FILTERS: CatalogFilterPatch = {
  q: undefined,
  categories: undefined,
  networks: undefined,
  priceMin: undefined,
  priceMax: undefined,
}

export function hasActiveFilters(search: CatalogSearch): boolean {
  return Boolean(
    search.q ||
    search.categories?.length ||
    search.networks?.length ||
    search.priceMin ||
    search.priceMax,
  )
}

export function countActiveFilters(search: CatalogSearch): number {
  return (
    (search.categories?.length ?? 0) +
    (search.networks?.length ?? 0) +
    (search.priceMin || search.priceMax ? 1 : 0)
  )
}

export function toggleInList<T extends string>(list: T[] | undefined, value: T): T[] | undefined {
  const next = list?.includes(value)
    ? list.filter((item) => item !== value)
    : [...(list ?? []), value]
  return next.length > 0 ? next : undefined
}
