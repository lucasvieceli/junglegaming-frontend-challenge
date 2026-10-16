import type { Network, WalletType } from '@/shared/contracts/common'
import type { Wallet } from '@/shared/contracts/wallet'

export const CUSTOM_WALLET = 'custom'

export const WALLET_OPTION_TYPES: WalletType[] = ['walletconnect', 'metamask', 'coinbase']

export type WalletConnectionState =
  | { status: 'idle' }
  | { status: 'connecting' }
  | { status: 'connected'; walletId: string; address: string }
  | { status: 'rejected'; message: string }
  | { status: 'disconnected' }

export type WalletTarget = {
  choice: string
  network: Network
  custom?: { address: string; type: WalletType }
}

export function walletTargetKey(target: WalletTarget): string {
  return target.custom
    ? `${CUSTOM_WALLET}:${target.custom.type}:${target.network}:${target.custom.address.toLowerCase()}`
    : `${target.choice}:${target.network}`
}

export function registeredWalletOfType(wallets: Wallet[], type: WalletType): Wallet | undefined {
  return (
    wallets.find((wallet) => wallet.type === type && wallet.kind === 'primary') ??
    wallets.find((wallet) => wallet.type === type)
  )
}
