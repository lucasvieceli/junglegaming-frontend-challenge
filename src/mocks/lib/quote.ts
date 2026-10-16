import type { Cart, Quote, QuoteChange } from '@/shared/contracts/cart'
import type { Network } from '@/shared/contracts/common'
import { formatEth } from '@/shared/lib/money'

import { getDb, nextId, transact } from '../db/db'
import type { DbCart, DbCartItem, MockDb } from '../db/schema'
import { applyCoupon, buildCartView, defaultFeeNetwork, getOrCreateCart } from './cart'
import { addMs } from './clock'
import { messages } from './messages'
import { MockHttpError } from './respond'

export function catalogVersionOf(db: MockDb, cart: DbCart): number {
  return cart.items.reduce((sum, item) => sum + (db.nfts[item.nftId]?.version ?? 0), 0)
}

function changesOf(view: Cart, cart: DbCart): QuoteChange[] {
  return view.items
    .filter((item) => item.status !== 'ok')
    .map((item) => {
      const stored = cart.items.find((i) => i.id === item.id) as DbCartItem
      const label = `${item.nft.name} (${item.nft.editionLabel})`
      if (item.status === 'unavailable') {
        return {
          itemId: item.id,
          kind: 'unavailable' as const,
          from: null,
          to: null,
          message: `${label} esgotou.`,
        }
      }
      if (item.status === 'quantity_reduced') {
        return {
          itemId: item.id,
          kind: 'quantity_reduced' as const,
          from: String(stored.lastSeenQuantity),
          to: String(item.quantity),
          message: `Disponibilidade de ${label} reduzida para ${item.quantity}.`,
        }
      }
      return {
        itemId: item.id,
        kind: 'price_changed' as const,
        from: stored.lastSeenPrice,
        to: item.unitPrice,
        message: `Preço de ${item.nft.name} mudou: ${formatEth(stored.lastSeenPrice)} → ${formatEth(item.unitPrice)}.`,
      }
    })
}

export function createQuote(
  ownerKey: string,
  input: { couponCode?: string; network?: Network },
): Quote {
  const db = getDb()
  const cart = getOrCreateCart(ownerKey)
  if (input.couponCode && input.couponCode !== cart.couponCode)
    applyCoupon(ownerKey, input.couponCode)
  const feeNetwork = input.network ?? defaultFeeNetwork(db, ownerKey)
  const current = getDb().carts[ownerKey] as DbCart
  const view = buildCartView(db, current, feeNetwork)
  if (view.items.length && view.items.every((item) => item.status === 'unavailable')) {
    throw new MockHttpError(409, 'EDITION_UNAVAILABLE', messages.editionUnavailable, {
      details: { cart: view },
    })
  }
  const changes = changesOf(view, current)
  const quoteId = nextId('qte')
  return transact((draft) => {
    const stored = draft.carts[ownerKey] as DbCart
    stored.items.forEach((item) => {
      item.lastSeenPrice = draft.nfts[item.nftId]?.price ?? item.lastSeenPrice
      item.lastSeenQuantity = item.quantity
    })
    const quote = {
      quoteId,
      cartVersion: stored.version,
      catalogVersion: catalogVersionOf(draft, stored),
      items: view.items,
      coupon: view.coupon,
      pricing: view.pricing,
      changes,
      expiresAt: addMs(10 * 60_000),
    }
    draft.quotes[quoteId] = { ...quote, ownerKey, feeNetwork }
    return quote
  })
}
