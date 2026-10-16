import type { CreateOrderRequest, Order } from '@/shared/contracts/order'
import { hashBody } from '@/shared/lib/hash'
import { lineTotal } from '@/shared/lib/pricing'

import { getDb, nextId, transact } from '../db/db'
import type { DbCart, DbOrder, MockDb } from '../db/schema'
import { getScenario } from '../scenarios/store'
import { runScenarioTrigger } from '../scenarios/triggers'
import { emitOrderUpdated } from '../ws/connections'
import { buildCartView, maxQuantityOf } from './cart'
import { catalogVersionOf } from './quote'
import { applyNftChange } from './catalog-changes'
import { addMs, now, nowIso } from './clock'
import { messages } from './messages'
import { MockHttpError } from './respond'
import { NETWORK_EXPLORERS } from '@/shared/lib/network-label'

const timers = new Map<string, ReturnType<typeof setTimeout>>()

export function publicOrder(order: DbOrder): Order {
  const { settlement: _settlement, cartOwnerKey: _owner, ...rest } = order
  return rest
}

function quoteChangesError(db: MockDb, cart: DbCart, network: string) {
  const view = buildCartView(db, cart)
  return new MockHttpError(409, 'QUOTE_STALE', messages.quoteStale, {
    details: { reason: 'quote_outdated', network, cart: view },
  })
}

export async function createOrder(
  userId: string,
  key: string,
  body: CreateOrderRequest,
): Promise<{ order: Order; replay: boolean }> {
  const db = getDb()
  const bodyHash = await hashBody(body)
  const existing = db.idempotency[key]
  if (existing) {
    if (existing.userId !== userId || existing.bodyHash !== bodyHash) {
      throw new MockHttpError(409, 'IDEMPOTENCY_KEY_REUSED', messages.idempotencyReused)
    }
    return { order: publicOrder(db.orders[existing.orderId] as DbOrder), replay: true }
  }

  const ownerKey = `user:${userId}`
  const quote = db.quotes[body.quoteId]
  const cart = db.carts[ownerKey]
  if (!quote || quote.ownerKey !== ownerKey || !cart)
    throw new MockHttpError(409, 'QUOTE_STALE', messages.quoteStale)
  const outdated =
    quote.cartVersion !== cart.version ||
    quote.catalogVersion !== catalogVersionOf(db, cart) ||
    quote.feeNetwork !== body.network ||
    new Date(quote.expiresAt).getTime() < now().getTime()
  if (outdated) throw quoteChangesError(db, cart, body.network)

  const wallet = db.wallets[body.walletId]
  const connection = db.walletConnections[body.walletId]
  if (!wallet || wallet.userId !== userId)
    throw new MockHttpError(404, 'WALLET_NOT_FOUND', messages.walletNotFound)
  if (connection?.status !== 'connected') {
    throw new MockHttpError(409, 'WALLET_CONNECTION_REJECTED', messages.walletNotConnected)
  }

  const items = quote.items.filter((item) => item.status !== 'unavailable')
  for (const item of items) {
    const edition = db.nfts[item.nftId]?.editions.find((e) => e.id === item.editionId)
    if (!edition || maxQuantityOf(edition) < item.quantity) {
      throw new MockHttpError(409, 'EDITION_UNAVAILABLE', messages.editionUnavailable, {
        details: { itemId: item.id },
      })
    }
  }

  const scenario = getScenario()
  const orderId = nextId('ord')
  const order = transact((draft) => {
    const created: DbOrder = {
      id: orderId,
      number: `KUR-2026-${orderId.split('_')[1]}`,
      userId,
      status: 'pending',
      version: 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      confirmedAt: null,
      wallet: {
        id: wallet.id,
        kind: wallet.kind,
        label: wallet.alias,
        type: wallet.type,
        network: body.network,
        address: wallet.address,
      },
      collector: body.collector,
      items: items.map((item) => ({
        nftId: item.nftId,
        name: item.nft.name,
        tokenId: item.nft.tokenId,
        imageKey: item.nft.imageKey,
        editionId: item.editionId,
        editionLabel: item.nft.editionLabel,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: lineTotal(item.unitPrice, item.quantity),
      })),
      pricing: { ...quote.pricing, couponCode: quote.coupon?.code ?? null },
      transaction: null,
      declineReason: null,
      idempotencyKey: key,
      settlement:
        scenario.payment.outcome === 'stuck'
          ? null
          : {
              outcome: scenario.payment.outcome,
              settleAt: addMs(scenario.payment.delayMs),
              reason: scenario.payment.declineReason,
            },
      cartOwnerKey: ownerKey,
    }
    draft.orders[orderId] = created
    draft.idempotency[key] = { userId, bodyHash, orderId }
    return created
  })
  scheduleSettlement(order)
  runScenarioTrigger('order_created', { userId, ownerKey })
  return { order: publicOrder(order), replay: false }
}

export function scheduleSettlement(order: DbOrder): void {
  if (!order.settlement || order.status !== 'pending') return
  clearTimeout(timers.get(order.id))
  const wait = Math.max(0, new Date(order.settlement.settleAt).getTime() - now().getTime())
  const { outcome, reason } = order.settlement
  timers.set(
    order.id,
    setTimeout(() => settleOrder(order.id, outcome, reason), wait),
  )
}

export function rescheduleSettlements(): void {
  Object.values(getDb().orders).forEach(scheduleSettlement)
}

function removePurchasedFromCart(cart: DbCart | undefined, order: DbOrder): void {
  if (!cart) return
  for (const purchased of order.items) {
    const line = cart.items.find(
      (i) => i.nftId === purchased.nftId && i.editionId === purchased.editionId,
    )
    if (line) line.quantity -= purchased.quantity
  }
  cart.items = cart.items.filter((i) => i.quantity > 0)
  cart.version += 1
  cart.updatedAt = nowIso()
}

export function settleOrder(
  orderId: string,
  outcome: 'confirmed' | 'declined',
  reason?: string,
): Order | null {
  timers.delete(orderId)
  const current = getDb().orders[orderId]
  if (!current || current.status !== 'pending') return current ? publicOrder(current) : null

  const order = transact((db) => {
    const draft = db.orders[orderId] as DbOrder
    draft.status = outcome
    draft.version += 1
    draft.updatedAt = nowIso()
    draft.settlement = null
    if (outcome === 'confirmed') {
      draft.confirmedAt = nowIso()
      const ref = `0x${orderId.replace(/\D/g, '').padStart(8, '0')}a91f${'e82c'.repeat(13)}`
      draft.transaction = {
        ref,
        explorerUrl: `${NETWORK_EXPLORERS[draft.wallet.network].txUrl}${ref}`,
      }
      removePurchasedFromCart(db.carts[draft.cartOwnerKey], draft)
    } else {
      draft.declineReason = reason ?? 'Transação recusada pela carteira.'
    }
    return structuredClone(draft)
  })

  emitOrderUpdated(
    order.userId,
    {
      orderId,
      status: order.status,
      transaction: order.transaction,
      declineReason: order.declineReason,
    },
    order.version,
  )
  if (outcome === 'confirmed') debitStock(order)
  return publicOrder(order)
}

function debitStock(order: DbOrder): void {
  const byNft = new Map<string, Array<{ id: string; available: number | null }>>()
  for (const item of order.items) {
    const edition = getDb().nfts[item.nftId]?.editions.find((e) => e.id === item.editionId)
    if (!edition || edition.available === null) continue
    const list = byNft.get(item.nftId) ?? []
    list.push({ id: edition.id, available: Math.max(0, edition.available - item.quantity) })
    byNft.set(item.nftId, list)
  }
  byNft.forEach((editions, nftId) => applyNftChange(nftId, { editions }))
}
