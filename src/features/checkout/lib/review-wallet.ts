import { WALLET_TYPE_LABELS } from '@/shared/lib/wallet-labels'

import type { CheckoutController } from '../hooks/useCheckoutController'

export function reviewWallet(checkout: CheckoutController): { label: string; address: string } {
  const values = checkout.form.getValues()
  const wallet = checkout.wallets.find((item) => item.id === checkout.choice)
  const state = checkout.connection.state
  return {
    label: wallet
      ? `${wallet.alias} (${WALLET_TYPE_LABELS[wallet.type]})`
      : WALLET_TYPE_LABELS[values.walletType],
    address: state.status === 'connected' ? state.address : values.walletAddress,
  }
}
