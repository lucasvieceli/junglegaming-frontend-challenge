import { z } from 'zod'

import { NftSummarySchema } from './nft'

export const FavoritesResponseSchema = z.object({ items: z.array(NftSummarySchema) })
export type FavoritesResponse = z.infer<typeof FavoritesResponseSchema>
