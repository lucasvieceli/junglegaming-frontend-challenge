export type ScenarioTrigger = 'connect' | 'order_created' | 'checkout_quote' | 'wallet_connected'
export type ScenarioAction = 'nft_price_up' | 'nft_sold_out' | 'drop_socket' | 'disconnect_wallet'

export interface ScenarioFailure {
  match: RegExp
  method?: string
  status: number
  code: string
  message: string
  mode: 'always' | 'first-n' | 'alternate'
  times?: number
  fieldErrors?: Record<string, string[]>
}

export interface ScenarioConfig {
  name: string
  description: string
  latency: { mode: 'fixed' | 'variable' | 'out-of-order'; minMs: number; maxMs: number }
  network: 'online' | 'offline'
  failures: ScenarioFailure[]
  timeouts: Array<{ match: RegExp; method?: string; delayMs: number; times: number }>
  session: { ttlMs: number }
  payment: { outcome: 'confirmed' | 'declined' | 'stuck'; delayMs: number; declineReason?: string }
  walletConnect: { outcome: 'connected' | 'rejected'; delayMs: number }
  catalog: { empty: boolean }
  realtime: Array<{ on: ScenarioTrigger; afterMs: number; action: ScenarioAction }>
}
