import { http } from 'msw'

import { FavoritesResponseSchema } from '@/shared/contracts/favorites'

import { getDb, transact } from '../db/db'
import { api } from '../lib/api-path'
import { requireUser } from '../lib/auth'
import { toSummary } from '../lib/catalog'
import { messages } from '../lib/messages'
import { MockHttpError, json, noContent } from '../lib/respond'
import { withScenario } from '../scenarios/apply'

function assertNft(nftId: string) {
  if (!getDb().nfts[nftId]) throw new MockHttpError(404, 'NFT_NOT_FOUND', messages.nftNotFound)
}

export const favoritesHandlers = [
  http.get(
    api('/favorites'),
    withScenario(({ request }) => {
      const { user } = requireUser(request)
      const db = getDb()
      const items = (db.favorites[user.id] ?? []).flatMap((id) =>
        db.nfts[id] ? [toSummary(db.nfts[id])] : [],
      )
      return json(FavoritesResponseSchema, { items })
    }),
  ),

  http.put(
    api('/favorites/:nftId'),
    withScenario(({ request, params }) => {
      const { user } = requireUser(request)
      const nftId = String(params.nftId)
      assertNft(nftId)
      transact((db) => {
        const list = db.favorites[user.id] ?? []
        if (!list.includes(nftId)) db.favorites[user.id] = [...list, nftId]
      })
      return noContent()
    }),
  ),

  http.delete(
    api('/favorites/:nftId'),
    withScenario(({ request, params }) => {
      const { user } = requireUser(request)
      const nftId = String(params.nftId)
      transact((db) => {
        db.favorites[user.id] = (db.favorites[user.id] ?? []).filter((id) => id !== nftId)
      })
      return noContent()
    }),
  ),
]
