import type { WalletType } from '@/shared/contracts/common'

import { CUSTOM_WALLET_FIELDS } from '../lib/checkout-steps'
import { CUSTOM_WALLET, registeredWalletOfType } from '../lib/wallet-choice'
import type { CheckoutController } from './useCheckoutController'

export function useWalletSelection(checkout: CheckoutController) {
  const { form, wallets, customWallet, connection, chooseWallet } = checkout
  const canConnect =
    Boolean(checkout.target) && (!customWallet || !form.getFieldState('walletAddress').invalid)

  const connectCustom = async () => {
    if (!(await form.trigger([...CUSTOM_WALLET_FIELDS]))) return
    const { walletAddress, walletType, network } = form.getValues()
    connection.connect({
      choice: CUSTOM_WALLET,
      network,
      custom: { address: walletAddress, type: walletType },
    })
  }

  const selectWallet = (walletId: string) => {
    const wallet = wallets.find((item) => item.id === walletId)
    chooseWallet(walletId)
    if (wallet) connection.connect({ choice: wallet.id, network: wallet.network })
  }

  const selectType = (type: WalletType) => {
    const registered = customWallet ? undefined : registeredWalletOfType(wallets, type)
    if (registered) return selectWallet(registered.id)
    chooseWallet(CUSTOM_WALLET)
    form.setValue('walletType', type, { shouldValidate: true })
    void connectCustom()
  }

  const connectCurrent = () => {
    if (customWallet) void connectCustom()
    else if (checkout.target) connection.connect(checkout.target)
  }

  return {
    selectedType: checkout.walletType,
    canConnect,
    selectWallet,
    selectType,
    connectCurrent,
    disconnect: () => void checkout.connection.disconnect(),
  }
}
