import type { NftUpdatedPayload, OrderUpdatedPayload } from '@/shared/contracts/events'

import { getDb, nextId, resetDb, transact } from '../db/db'
import type { MockDb } from '../db/schema'
import { createSession, publicUser } from '../lib/auth'
import { applyNftChange } from '../lib/catalog-changes'
import { getOrCreateCart } from '../lib/cart'
import { settleOrder } from '../lib/orders'
import { disconnectWallet } from '../lib/wallets'
import { seedRandom } from '../lib/prng'
import { SCENARIO_NAMES, isScenarioName, type ScenarioName } from '../scenarios/presets'
import { getScenarioName, setLatencyOverride, setScenario } from '../scenarios/store'
import { dropConnections, emitOrderUpdated, getLastEmittedId, redeliver } from '../ws/connections'
import { clearClientStorage, writeClientSession } from './client-storage'

export interface EmitOptions {
  duplicateOf?: string
  version?: number
  userId?: string
  deliverTo?: 'owner' | 'all'
}

export function createControlApi() {
  return {
    version: '1',
    scenarios: SCENARIO_NAMES,
    getScenario: () => getScenarioName(),
    async setScenario(name: ScenarioName) {
      if (!isScenarioName(name)) throw new Error(`Unknown scenario: ${String(name)}`)
      setScenario(name)
    },
    async reset(options: { scenario?: ScenarioName } = {}) {
      await resetDb()
      seedRandom()
      clearClientStorage()
      dropConnections()
      setScenario(options.scenario ?? 'default')
    },
    loginAs(email: string) {
      const user = Object.values(getDb().users).find((u) => u.email === email)
      if (!user) throw new Error(`User not found: ${email}`)
      const session = createSession(user.id)
      writeClientSession({
        token: session.token,
        expiresAt: session.expiresAt,
        user: publicUser(user),
      })
    },
    expireSession() {
      transact((db) => {
        Object.values(db.sessions).forEach((s) => (s.expiresAt = new Date(0).toISOString()))
      })
    },
    emit(
      event: 'nft.updated' | 'order.updated',
      payload: Partial<NftUpdatedPayload & OrderUpdatedPayload>,
      options: EmitOptions = {},
    ): string | null {
      if (options.duplicateOf || options.version !== undefined) {
        const target = options.duplicateOf ?? ''
        return (
          redeliver(target, options.version !== undefined ? { version: options.version } : {})
            ?.id ?? null
        )
      }
      if (event === 'nft.updated' && payload.nftId) {
        const change = { price: payload.price, editions: payload.editions }
        applyNftChange(payload.nftId, change)
        return getLastEmittedId()
      }
      if (event === 'order.updated' && payload.orderId) {
        const order = getDb().orders[payload.orderId]
        const userId = options.userId ?? order?.userId
        if (!userId) return null
        const ev = emitOrderUpdated(
          userId,
          {
            orderId: payload.orderId,
            status: payload.status ?? order?.status ?? 'pending',
            transaction: payload.transaction ?? null,
            declineReason: payload.declineReason ?? null,
          },
          (order?.version ?? 0) + 1,
          options.deliverTo,
        )
        return ev.id
      }
      return null
    },
    dropSocket: () => dropConnections(),
    settleOrder: (orderId: string, status: 'confirmed' | 'declined') =>
      settleOrder(orderId, status)?.status ?? null,
    disconnectWallet: (walletId: string) => disconnectWallet(walletId),
    seedCart(
      items: Array<{ nftId: string; editionId: string; quantity: number }>,
      ownerKey: string,
    ) {
      getOrCreateCart(ownerKey)
      transact((db) => {
        const cart = db.carts[ownerKey]
        if (!cart) return
        for (const item of items) {
          const price = db.nfts[item.nftId]?.price ?? '0'
          cart.items.push({
            id: nextId('item'),
            ...item,
            lastSeenPrice: price,
            lastSeenQuantity: item.quantity,
          })
        }
        cart.version += 1
      })
    },
    getDb: (): MockDb => structuredClone(getDb()),
    setLatency: (ms: number | null) => setLatencyOverride(ms),
  }
}

export type KurioControlApi = ReturnType<typeof createControlApi>
