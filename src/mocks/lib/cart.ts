import type { Cart, CartItem, CartItemStatus } from '@/shared/contracts/cart'
import type { Network } from '@/shared/contracts/common'
import type { Edition } from '@/shared/contracts/nft'
import { computePricing, lineTotal } from '@/shared/lib/pricing'

import { getDb, nextId, transact } from '../db/db'
import type { DbCart, DbCartItem, DbCoupon, MockDb } from '../db/schema'
import { now, nowIso } from './clock'
import { messages } from './messages'
import { MockHttpError } from './respond'

export function maxQuantityOf(edition: Edition): number {
  return edition.available === null
    ? edition.maxPerOrder
    : Math.min(edition.maxPerOrder, edition.available)
}

function findEdition(db: MockDb, nftId: string, editionId: string) {
  const nft = db.nfts[nftId]
  if (!nft) throw new MockHttpError(404, 'NFT_NOT_FOUND', messages.nftNotFound)
  const edition = nft.editions.find((e) => e.id === editionId)
  if (!edition) throw new MockHttpError(404, 'NFT_NOT_FOUND', messages.nftNotFound)
  return { nft, edition }
}

function statusOf(item: DbCartItem, price: string, maxQuantity: number): CartItemStatus {
  if (maxQuantity === 0) return 'unavailable'
  if (item.quantity < item.lastSeenQuantity) return 'quantity_reduced'
  if (price !== item.lastSeenPrice) return 'price_changed'
  return 'ok'
}

export function defaultFeeNetwork(db: MockDb, ownerKey: string): Network {
  const userId = ownerKey.startsWith('user:') ? ownerKey.slice(5) : null
  const primary = Object.values(db.wallets).find((w) => w.userId === userId && w.kind === 'primary')
  return primary?.network ?? 'ethereum'
}

export function isCouponExpired(coupon: DbCoupon): boolean {
  return coupon.expiresAt !== null && new Date(coupon.expiresAt).getTime() < now().getTime()
}

function toCartItem(db: MockDb, item: DbCartItem): CartItem {
  const { nft, edition } = findEdition(db, item.nftId, item.editionId)
  const maxQuantity = maxQuantityOf(edition)
  return {
    id: item.id,
    nftId: item.nftId,
    editionId: item.editionId,
    quantity: item.quantity,
    unitPrice: nft.price,
    lineTotal: lineTotal(nft.price, item.quantity),
    nft: {
      name: nft.name,
      tokenId: nft.tokenId,
      imageKey: nft.imageKey,
      editionLabel: edition.label,
    },
    available: edition.available,
    maxQuantity,
    status: statusOf(item, nft.price, maxQuantity),
  }
}

export function buildCartView(
  db: MockDb,
  cart: DbCart,
  feeNetwork = defaultFeeNetwork(db, cart.ownerKey),
): Cart {
  const items = cart.items.map((item) => toCartItem(db, item))
  const coupon = cart.couponCode ? db.coupons[cart.couponCode] : undefined
  const validCoupon = coupon && !isCouponExpired(coupon) ? coupon : null
  const payable = items.filter((item) => item.status !== 'unavailable')
  return {
    id: cart.id,
    ownerKey: cart.ownerKey,
    items,
    coupon: validCoupon ? { code: validCoupon.code, percentOff: validCoupon.percentOff } : null,
    pricing: computePricing(payable, { percentOff: validCoupon?.percentOff, feeNetwork }),
    version: cart.version,
    updatedAt: cart.updatedAt,
  }
}

export function getOrCreateCart(ownerKey: string): DbCart {
  const existing = getDb().carts[ownerKey]
  if (existing) return existing
  const cart: DbCart = {
    id: nextId('cart'),
    ownerKey,
    items: [],
    couponCode: null,
    version: 1,
    updatedAt: nowIso(),
  }
  transact((db) => {
    db.carts[ownerKey] = cart
  })
  return cart
}

export function mutateCart(ownerKey: string, mutator: (cart: DbCart, db: MockDb) => void): Cart {
  getOrCreateCart(ownerKey)
  return transact((db) => {
    const cart = db.carts[ownerKey] as DbCart
    mutator(cart, db)
    cart.version += 1
    cart.updatedAt = nowIso()
    return buildCartView(db, cart)
  })
}

function assertQuantity(
  db: MockDb,
  ownerKey: string,
  nftId: string,
  editionId: string,
  quantity: number,
) {
  const { edition } = findEdition(db, nftId, editionId)
  const max = maxQuantityOf(edition)
  if (max === 0) throw new MockHttpError(409, 'EDITION_UNAVAILABLE', messages.editionUnavailable)
  if (quantity > max) {
    const cart = db.carts[ownerKey]
    throw new MockHttpError(409, 'QUANTITY_EXCEEDS_AVAILABILITY', messages.quantityExceeds(max), {
      details: { maxQuantity: max, cart: cart ? buildCartView(db, cart) : null },
    })
  }
}

export function addCartItem(
  ownerKey: string,
  input: { nftId: string; editionId: string; quantity: number },
): Cart {
  const db = getDb()
  const existing = db.carts[ownerKey]?.items.find(
    (i) => i.nftId === input.nftId && i.editionId === input.editionId,
  )
  assertQuantity(
    db,
    ownerKey,
    input.nftId,
    input.editionId,
    (existing?.quantity ?? 0) + input.quantity,
  )
  const itemId = existing?.id ?? nextId('item')
  return mutateCart(ownerKey, (cart, draft) => {
    const price = draft.nfts[input.nftId]?.price ?? '0'
    const line = cart.items.find((i) => i.id === itemId)
    if (line) {
      line.quantity += input.quantity
      line.lastSeenQuantity = line.quantity
      line.lastSeenPrice = price
    } else {
      cart.items.push({
        id: itemId,
        ...input,
        lastSeenPrice: price,
        lastSeenQuantity: input.quantity,
      })
    }
  })
}

export function updateCartItem(ownerKey: string, itemId: string, quantity: number): Cart {
  const db = getDb()
  const item = db.carts[ownerKey]?.items.find((i) => i.id === itemId)
  if (!item) throw new MockHttpError(404, 'CART_ITEM_NOT_FOUND', messages.cartItemNotFound)
  assertQuantity(db, ownerKey, item.nftId, item.editionId, quantity)
  return mutateCart(ownerKey, (cart, draft) => {
    const line = cart.items.find((i) => i.id === itemId) as DbCartItem
    line.quantity = quantity
    line.lastSeenQuantity = quantity
    line.lastSeenPrice = draft.nfts[line.nftId]?.price ?? line.lastSeenPrice
  })
}

export function removeCartItem(ownerKey: string, itemId: string): Cart {
  if (!getDb().carts[ownerKey]?.items.some((i) => i.id === itemId)) {
    throw new MockHttpError(404, 'CART_ITEM_NOT_FOUND', messages.cartItemNotFound)
  }
  return mutateCart(ownerKey, (cart) => {
    cart.items = cart.items.filter((i) => i.id !== itemId)
  })
}

export function validateCoupon(db: MockDb, code: string): DbCoupon {
  const coupon = db.coupons[code.trim().toUpperCase()]
  if (!coupon) throw new MockHttpError(422, 'COUPON_INVALID', messages.couponInvalid)
  if (isCouponExpired(coupon)) {
    const date = new Intl.DateTimeFormat('pt-BR').format(new Date(coupon.expiresAt as string))
    throw new MockHttpError(422, 'COUPON_EXPIRED', messages.couponExpired(date))
  }
  return coupon
}

export function applyCoupon(ownerKey: string, code: string): Cart {
  const coupon = validateCoupon(getDb(), code)
  return mutateCart(ownerKey, (cart) => {
    cart.couponCode = coupon.code
  })
}

export function removeCoupon(ownerKey: string): Cart {
  return mutateCart(ownerKey, (cart) => {
    cart.couponCode = null
  })
}

export function mergeGuestCart(userOwnerKey: string, guestId: string): Cart {
  const guestKey = `guest:${guestId}`
  getOrCreateCart(userOwnerKey)
  return mutateCart(userOwnerKey, (cart, db) => {
    const guest = db.carts[guestKey]
    if (!guest) return
    for (const item of guest.items) {
      const { edition } = findEdition(db, item.nftId, item.editionId)
      const max = maxQuantityOf(edition)
      const line = cart.items.find((i) => i.nftId === item.nftId && i.editionId === item.editionId)
      if (line) line.quantity = Math.min(max, line.quantity + item.quantity)
      else if (max > 0)
        cart.items.push({ ...item, id: nextId('item'), quantity: Math.min(max, item.quantity) })
    }
    if (!cart.couponCode && guest.couponCode) cart.couponCode = guest.couponCode
    guest.items = []
    guest.couponCode = null
    guest.version += 1
  })
}
