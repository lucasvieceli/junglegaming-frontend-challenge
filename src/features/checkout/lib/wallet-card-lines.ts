import type { Wallet } from '@/shared/contracts/wallet'
import { NETWORK_LABELS } from '@/shared/lib/network-label'
import { shortAddress } from '@/shared/lib/short-address'

export function walletCardLines(wallet: Wallet): [string, string] {
  const network = NETWORK_LABELS[wallet.network]
  return [
    wallet.secondaryAddress ?? shortAddress(wallet.address),
    wallet.kind === 'primary' ? `Rede principal ${network}` : `Rede ${network}`,
  ]
}
