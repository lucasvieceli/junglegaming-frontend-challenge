import { http } from 'msw'

import {
  FeaturedResponseSchema,
  NftDetailSchema,
  NftListResponseSchema,
} from '@/shared/contracts/nft'

import { getDb } from '../db/db'
import { api } from '../lib/api-path'
import { listNfts, parseListParams, toSummary } from '../lib/catalog'
import { messages } from '../lib/messages'
import { MockHttpError, json } from '../lib/respond'
import { withScenario } from '../scenarios/apply'
import { getScenario } from '../scenarios/store'

// /nfts/featured must be registered before /nfts/:id.
export const nftHandlers = [
  http.get(
    api('/nfts'),
    withScenario(({ request }) => {
      const params = parseListParams(new URL(request.url))
      if (!params.success) throw new MockHttpError(400, 'BAD_REQUEST', messages.badRequest)
      return json(
        NftListResponseSchema,
        listNfts(getDb(), params.data, { empty: getScenario().catalog.empty }),
      )
    }),
  ),

  http.get(
    api('/nfts/featured'),
    withScenario(() => {
      const db = getDb()
      const pick = (id: string) => toSummary(db.nfts[id] as NonNullable<(typeof db.nfts)[string]>)
      return json(FeaturedResponseSchema, {
        hero: db.featured.hero.map(pick),
        sidebar: pick(db.featured.sidebar),
      })
    }),
  ),

  http.get(
    api('/nfts/:id'),
    withScenario(({ params }) => {
      const nft = getDb().nfts[String(params.id)]
      if (!nft) throw new MockHttpError(404, 'NFT_NOT_FOUND', messages.nftNotFound)
      return json(NftDetailSchema, nft)
    }),
  ),
]
