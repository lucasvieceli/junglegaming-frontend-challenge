import type { Availability, Edition, NftDetail } from '@/shared/contracts/nft'
import { compareEth, eth, toEthString } from '@/shared/lib/money'

import { getDb, transact } from '../db/db'
import type { MockDb } from '../db/schema'
import { broadcastNftUpdated } from '../ws/connections'
import { maxQuantityOf } from './cart'

export function availabilityOf(editions: Edition[]): Availability {
  const totals = editions.map((e) => e.available)
  if (totals.every((a) => a === 0)) return 'sold_out'
  if (totals.some((a) => a === null || a > 3)) return 'available'
  return 'low'
}

function clampCarts(db: MockDb, nft: NftDetail): void {
  for (const cart of Object.values(db.carts)) {
    let changed = false
    for (const item of cart.items.filter((i) => i.nftId === nft.id)) {
      const edition = nft.editions.find((e) => e.id === item.editionId)
      const max = edition ? maxQuantityOf(edition) : 0
      if (max > 0 && item.quantity > max) {
        item.quantity = max
        changed = true
      }
    }
    if (changed) cart.version += 1
  }
}

export interface NftChange {
  price?: string
  editions?: Array<{ id: string; available: number | null }>
}

export function applyNftChange(nftId: string, change: NftChange): NftDetail | null {
  if (!getDb().nfts[nftId]) return null
  const updated = transact((db) => {
    const nft = db.nfts[nftId] as NftDetail
    if (change.price && compareEth(change.price, nft.price) !== 0) {
      nft.previousPrice = compareEth(change.price, nft.price) < 0 ? nft.price : null
      nft.price = change.price
    }
    for (const patch of change.editions ?? []) {
      const edition = nft.editions.find((e) => e.id === patch.id)
      if (edition) edition.available = patch.available
    }
    nft.availability = availabilityOf(nft.editions)
    nft.version += 1
    clampCarts(db, nft)
    return structuredClone(nft)
  })
  broadcastNftUpdated(
    {
      nftId,
      price: updated.price,
      previousPrice: updated.previousPrice,
      availability: updated.availability,
      editions: updated.editions.map(({ id, available }) => ({ id, available })),
      reason: change.price ? 'price_changed' : 'availability_changed',
    },
    updated.version,
  )
  return updated
}

export function raisePrice(nftId: string, percent = 10): NftDetail | null {
  const nft = getDb().nfts[nftId]
  if (!nft) return null
  return applyNftChange(nftId, { price: toEthString(eth(nft.price).times(1 + percent / 100)) })
}

export function sellOut(nftId: string): NftDetail | null {
  const nft = getDb().nfts[nftId]
  if (!nft) return null
  return applyNftChange(nftId, { editions: nft.editions.map((e) => ({ id: e.id, available: 0 })) })
}
