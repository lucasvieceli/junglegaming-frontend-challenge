import type { NftListResponse, NftSummary } from '@/shared/contracts/nft'
import { NftListParamsSchema } from '@/shared/contracts/nft'
import { compareEth, eth } from '@/shared/lib/money'

import { CATEGORIES, NETWORKS } from '../db/fixtures/catalog-taxonomy'
import type { MockDb } from '../db/schema'
import { now } from './clock'

const NEW_WINDOW_MS = 7 * 24 * 3_600_000

export function toSummary(nft: MockDb['nfts'][string]): NftSummary {
  const {
    id,
    slug,
    name,
    tokenId,
    collection,
    category,
    network,
    price,
    previousPrice,
    imageKey,
    rare,
    trending,
    listedAt,
    availability,
    version,
  } = nft
  return {
    id,
    slug,
    name,
    tokenId,
    collection,
    category,
    network,
    price,
    previousPrice,
    imageKey,
    rare,
    trending,
    listedAt,
    availability,
    version,
  }
}

export function parseListParams(url: URL) {
  const csv = (key: string) => url.searchParams.get(key)?.split(',').filter(Boolean)
  const number = (key: string) =>
    url.searchParams.has(key) ? Number(url.searchParams.get(key)) : undefined
  return NftListParamsSchema.safeParse({
    q: url.searchParams.get('q') ?? undefined,
    categories: csv('categories'),
    networks: csv('networks'),
    priceMin: url.searchParams.get('priceMin') ?? undefined,
    priceMax: url.searchParams.get('priceMax') ?? undefined,
    sort: url.searchParams.get('sort') ?? undefined,
    tab: url.searchParams.get('tab') ?? undefined,
    page: number('page'),
    pageSize: number('pageSize'),
  })
}

type Params = ReturnType<typeof NftListParamsSchema.parse>
type Filter = (nft: NftSummary) => boolean

function filtersFor(
  params: Params,
): Record<'q' | 'categories' | 'networks' | 'price' | 'tab', Filter> {
  const query = params.q?.trim().toLowerCase()
  const isNew = (nft: NftSummary) =>
    now().getTime() - new Date(nft.listedAt).getTime() <= NEW_WINDOW_MS
  return {
    q: (nft) =>
      !query ||
      nft.name.toLowerCase().includes(query) ||
      nft.collection.name.toLowerCase().includes(query),
    categories: (nft) => !params.categories?.length || params.categories.includes(nft.category),
    networks: (nft) => !params.networks?.length || params.networks.includes(nft.network),
    price: (nft) =>
      (!params.priceMin || compareEth(nft.price, params.priceMin) >= 0) &&
      (!params.priceMax || compareEth(nft.price, params.priceMax) <= 0),
    tab: (nft) =>
      params.tab === 'new' ? isNew(nft) : params.tab === 'trending' ? nft.trending : true,
  }
}

const SORTERS: Record<Params['sort'], (a: NftSummary, b: NftSummary) => number> = {
  recent: (a, b) => b.listedAt.localeCompare(a.listedAt),
  price_asc: (a, b) => compareEth(a.price, b.price) || a.name.localeCompare(b.name),
  price_desc: (a, b) => compareEth(b.price, a.price) || a.name.localeCompare(b.name),
  trending: (a, b) =>
    Number(b.trending) - Number(a.trending) || b.listedAt.localeCompare(a.listedAt),
}

export function listNfts(db: MockDb, params: Params, options: { empty: boolean }): NftListResponse {
  const all = options.empty ? [] : Object.values(db.nfts).map(toSummary)
  const filters = filtersFor(params)
  const apply = (except?: keyof typeof filters) =>
    all.filter((nft) =>
      Object.entries(filters).every(([key, filter]) => key === except || filter(nft)),
    )

  const matching = apply().sort(SORTERS[params.sort])
  const totalPages = Math.max(1, Math.ceil(matching.length / params.pageSize))
  const start = (params.page - 1) * params.pageSize
  const forCategories = apply('categories')
  const forNetworks = apply('networks')
  const prices = all.map((nft) => eth(nft.price))

  return {
    items: matching.slice(start, start + params.pageSize),
    page: params.page,
    pageSize: params.pageSize,
    total: matching.length,
    totalPages,
    facets: {
      categories: CATEGORIES.map((c) => ({
        ...c,
        count: forCategories.filter((n) => n.category === c.slug).length,
      })),
      networks: NETWORKS.map((n) => ({
        ...n,
        count: forNetworks.filter((nft) => nft.network === n.slug).length,
      })),
      priceRange: {
        min: prices.length ? prices.reduce((a, b) => (a.lt(b) ? a : b)).toString() : '0',
        max: prices.length ? prices.reduce((a, b) => (a.gt(b) ? a : b)).toString() : '0',
      },
    },
  }
}
