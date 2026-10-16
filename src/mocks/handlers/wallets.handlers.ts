import { http } from 'msw'
import { z } from 'zod'

import { NetworkSchema } from '@/shared/contracts/common'
import {
  ConnectCustomWalletRequestSchema,
  ConnectWalletResponseSchema,
  SaveWalletRequestSchema,
  WalletConnectionSchema,
  WalletSchema,
  WalletsResponseSchema,
} from '@/shared/contracts/wallet'

import { getDb, nextId, transact } from '../db/db'
import { api } from '../lib/api-path'
import { requireUser } from '../lib/auth'
import { nowIso } from '../lib/clock'
import { messages } from '../lib/messages'
import { MockHttpError, json, noContent, parseBody } from '../lib/respond'
import { connectCustomWallet, connectWallet, disconnectWallet } from '../lib/wallets'
import { withScenario } from '../scenarios/apply'

function ownedWallet(userId: string, walletId: string) {
  const wallet = getDb().wallets[walletId]
  if (!wallet) throw new MockHttpError(404, 'WALLET_NOT_FOUND', messages.walletNotFound)
  if (wallet.userId !== userId) throw new MockHttpError(403, 'FORBIDDEN', messages.forbidden)
  return wallet
}

export const walletHandlers = [
  http.get(
    api('/wallets'),
    withScenario(({ request }) => {
      const { user } = requireUser(request)
      const items = Object.values(getDb().wallets).filter(
        (w) => w.userId === user.id && w.kind !== 'custom',
      )
      return json(WalletsResponseSchema, { items })
    }),
  ),

  http.post(
    api('/wallets/connect-custom'),
    withScenario(async ({ request }) => {
      const { user } = requireUser(request)
      const body = await parseBody(request, ConnectCustomWalletRequestSchema)
      return json(ConnectWalletResponseSchema, await connectCustomWallet(user.id, body))
    }),
  ),

  http.post(
    api('/wallets'),
    withScenario(async ({ request }) => {
      const { user } = requireUser(request)
      const body = await parseBody(request, SaveWalletRequestSchema)
      if (
        Object.values(getDb().wallets).some((w) => w.userId === user.id && w.kind === body.kind)
      ) {
        throw new MockHttpError(409, 'WALLET_KIND_EXISTS', messages.walletKindExists)
      }
      const id = nextId('wal')
      const wallet = transact((db) => {
        db.wallets[id] = { ...body, id, userId: user.id, createdAt: nowIso(), updatedAt: nowIso() }
        return db.wallets[id]
      })
      return json(WalletSchema, wallet, { status: 201 })
    }),
  ),

  http.patch(
    api('/wallets/:id'),
    withScenario(async ({ request, params }) => {
      const { user } = requireUser(request)
      const current = ownedWallet(user.id, String(params.id))
      const body = await parseBody(request, SaveWalletRequestSchema.partial())
      const wallet = transact((db) => {
        const updated = { ...current, ...body, kind: current.kind, updatedAt: nowIso() }
        db.wallets[current.id] = updated
        return updated
      })
      return json(WalletSchema, wallet)
    }),
  ),

  http.delete(
    api('/wallets/:id'),
    withScenario(({ request, params }) => {
      const { user } = requireUser(request)
      const wallet = ownedWallet(user.id, String(params.id))
      if (wallet.kind === 'primary')
        throw new MockHttpError(409, 'PRIMARY_WALLET_REQUIRED', messages.primaryWalletRequired)
      transact((db) => {
        delete db.wallets[wallet.id]
        delete db.walletConnections[wallet.id]
      })
      return noContent()
    }),
  ),

  http.post(
    api('/wallets/:id/connect'),
    withScenario(async ({ request, params }) => {
      const { user } = requireUser(request)
      const { network } = await parseBody(request, z.object({ network: NetworkSchema }))
      return json(
        ConnectWalletResponseSchema,
        await connectWallet(user.id, String(params.id), network),
      )
    }),
  ),

  http.post(
    api('/wallets/:id/disconnect'),
    withScenario(({ request, params }) => {
      const { user } = requireUser(request)
      disconnectWallet(ownedWallet(user.id, String(params.id)).id)
      return noContent()
    }),
  ),

  http.get(
    api('/wallets/:id/connection'),
    withScenario(({ request, params }) => {
      const { user } = requireUser(request)
      const wallet = ownedWallet(user.id, String(params.id))
      const connection = getDb().walletConnections[wallet.id]
      return json(WalletConnectionSchema, {
        status: connection?.status ?? 'never',
        network: connection?.network ?? null,
        connectedAt: connection?.connectedAt ?? null,
      })
    }),
  ),
]
