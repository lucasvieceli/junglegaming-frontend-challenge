import { delay } from 'msw'

import type { Network, WalletType } from '@/shared/contracts/common'
import type { ConnectWalletResponse } from '@/shared/contracts/wallet'

import { getDb, nextId, transact } from '../db/db'
import { getScenario } from '../scenarios/store'
import { runScenarioTrigger } from '../scenarios/triggers'
import { nowIso } from './clock'
import { messages } from './messages'
import { MockHttpError } from './respond'

export async function connectWallet(
  userId: string,
  walletId: string,
  network: Network,
): Promise<ConnectWalletResponse> {
  const wallet = getDb().wallets[walletId]
  if (!wallet) throw new MockHttpError(404, 'WALLET_NOT_FOUND', messages.walletNotFound)
  if (wallet.userId !== userId) throw new MockHttpError(403, 'FORBIDDEN', messages.forbidden)
  const { outcome, delayMs } = getScenario().walletConnect
  await delay(delayMs)
  if (outcome === 'rejected')
    throw new MockHttpError(409, 'WALLET_CONNECTION_REJECTED', messages.walletConnectionRejected)
  const connectedAt = nowIso()
  transact((db) => {
    db.walletConnections[walletId] = { walletId, userId, network, status: 'connected', connectedAt }
  })
  runScenarioTrigger('wallet_connected', { userId, walletId })
  return { walletId, status: 'connected', address: wallet.address, connectedAt }
}

export async function connectCustomWallet(
  userId: string,
  input: { address: string; type: WalletType; network: Network },
): Promise<ConnectWalletResponse> {
  const user = getDb().users[userId]
  const walletId = nextId('wal_custom')
  transact((db) => {
    db.wallets[walletId] = {
      id: walletId,
      userId,
      kind: 'custom',
      displayName: user?.displayName ?? 'Carteira',
      alias: 'Outra carteira',
      profileName: user?.username ?? 'colecionador',
      network: input.network,
      address: input.address,
      secondaryAddress: null,
      type: input.type,
      referralCode: 'KURIO-OUTRA',
      email: user?.email ?? 'contato@kurio.test',
      ensName: 'outra',
      sameAsPrimary: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
  })
  return connectWallet(userId, walletId, input.network)
}

export function disconnectWallet(walletId: string): void {
  transact((db) => {
    const connection = db.walletConnections[walletId]
    if (connection) connection.status = 'disconnected'
  })
}
