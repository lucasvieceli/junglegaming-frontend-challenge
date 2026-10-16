import type { CatalogSort, CatalogTab } from '@/shared/contracts/nft'

export const CATALOG_TABS: Array<{ value: CatalogTab; label: string }> = [
  { value: 'all', label: 'Todos os NFTs' },
  { value: 'new', label: 'Novos lançamentos' },
  { value: 'trending', label: 'Em alta' },
]

export const CATALOG_SORTS: Array<{ value: CatalogSort; label: string }> = [
  { value: 'recent', label: 'Listados recentemente' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'trending', label: 'Mais populares' },
]
