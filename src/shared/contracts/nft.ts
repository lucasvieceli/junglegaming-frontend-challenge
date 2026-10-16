import { z } from 'zod'

import { EthAmountSchema, IsoDateSchema, NetworkSchema, NftImageKeySchema } from './common'

export const EditionSchema = z.object({
  id: z.string(),
  label: z.string(),
  supply: z.int().nullable(), // null = open edition
  available: z.int().nullable(), // null = unlimited, 0 = sold out
  maxPerOrder: z.int().min(1),
})
export type Edition = z.infer<typeof EditionSchema>

export const AvailabilitySchema = z.enum(['available', 'low', 'sold_out'])
export type Availability = z.infer<typeof AvailabilitySchema>

export const NftSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tokenId: z.string(),
  collection: z.object({ slug: z.string(), name: z.string() }),
  category: z.string(),
  network: NetworkSchema,
  price: EthAmountSchema,
  previousPrice: EthAmountSchema.nullable(),
  imageKey: NftImageKeySchema,
  rare: z.boolean(),
  trending: z.boolean(),
  listedAt: IsoDateSchema,
  availability: AvailabilitySchema,
  version: z.int(),
})
export type NftSummary = z.infer<typeof NftSummarySchema>

export const ReviewSchema = z.object({
  author: z.string(),
  stars: z.int().min(1).max(5),
  text: z.string(),
  date: IsoDateSchema,
})
export type Review = z.infer<typeof ReviewSchema>

export const NftDetailSchema = NftSummarySchema.extend({
  description: z.string(),
  about: z.string(),
  attributes: z.array(z.string()),
  creator: z.string(),
  royaltiesPct: z.number(),
  contract: z.string(),
  rating: z.object({ average: z.number(), count: z.int() }),
  reviews: z.array(ReviewSchema),
  editions: z.array(EditionSchema),
  relatedIds: z.array(z.string()),
})
export type NftDetail = z.infer<typeof NftDetailSchema>

export const CatalogSortSchema = z.enum(['recent', 'price_asc', 'price_desc', 'trending'])
export type CatalogSort = z.infer<typeof CatalogSortSchema>
export const CatalogTabSchema = z.enum(['all', 'new', 'trending'])
export type CatalogTab = z.infer<typeof CatalogTabSchema>

const FacetSchema = z.object({ slug: z.string(), name: z.string(), count: z.int() })

export const NftListResponseSchema = z.object({
  items: z.array(NftSummarySchema),
  page: z.int(),
  pageSize: z.int(),
  total: z.int(),
  totalPages: z.int(),
  facets: z.object({
    categories: z.array(FacetSchema),
    networks: z.array(FacetSchema.extend({ slug: NetworkSchema })),
    priceRange: z.object({ min: EthAmountSchema, max: EthAmountSchema }),
  }),
})
export type NftListResponse = z.infer<typeof NftListResponseSchema>

export const FeaturedResponseSchema = z.object({
  hero: z.array(NftSummarySchema),
  sidebar: NftSummarySchema,
})
export type FeaturedResponse = z.infer<typeof FeaturedResponseSchema>

export const NftListParamsSchema = z.object({
  q: z.string().optional(),
  categories: z.array(z.string()).optional(),
  networks: z.array(NetworkSchema).optional(),
  priceMin: EthAmountSchema.optional(),
  priceMax: EthAmountSchema.optional(),
  sort: CatalogSortSchema.default('recent'),
  tab: CatalogTabSchema.default('all'),
  page: z.int().min(1).default(1),
  pageSize: z.int().min(1).max(48).default(9),
})
export type NftListParams = z.input<typeof NftListParamsSchema>
