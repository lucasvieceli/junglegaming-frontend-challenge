import { getDb } from '../db/db'
import { raisePrice, sellOut } from '../lib/catalog-changes'
import { disconnectWallet } from '../lib/wallets'
import { dropConnections } from '../ws/connections'
import { getScenario, subscribeScenario } from './store'
import type { ScenarioAction, ScenarioTrigger } from './types'

interface TriggerContext {
  userId?: string | null
  ownerKey?: string
  walletId?: string
}

function firstCartNft(ownerKey?: string): string | undefined {
  return ownerKey ? getDb().carts[ownerKey]?.items[0]?.nftId : undefined
}

const ACTIONS: Record<ScenarioAction, (context: TriggerContext) => void> = {
  nft_price_up: (context) => {
    const nftId = firstCartNft(context.ownerKey)
    if (nftId) raisePrice(nftId, 10)
  },
  nft_sold_out: (context) => {
    const nftId = firstCartNft(context.ownerKey)
    if (nftId) sellOut(nftId)
  },
  drop_socket: (context) => dropConnections(context.userId ?? undefined),
  disconnect_wallet: (context) => {
    if (context.walletId) disconnectWallet(context.walletId)
  },
}

const fired = new Set<string>()
subscribeScenario(() => fired.clear())

export function runScenarioTrigger(trigger: ScenarioTrigger, context: TriggerContext): void {
  getScenario().realtime.forEach((rule, index) => {
    const key = `${getScenario().name}:${index}`
    if (rule.on !== trigger || fired.has(key)) return
    fired.add(key)
    setTimeout(() => ACTIONS[rule.action](context), rule.afterMs)
  })
}
