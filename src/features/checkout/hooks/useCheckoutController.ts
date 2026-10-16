import { useWatch } from 'react-hook-form'
import { toast } from '@/shared/lib/toast'

import type { ApiError } from '@/shared/api/api-error'
import { applyApiFieldErrors } from '@/shared/api/field-errors'
import type { User } from '@/shared/contracts/auth'
import type { Cart } from '@/shared/contracts/cart'
import type { CreateOrderRequest } from '@/shared/contracts/order'
import type { Wallet } from '@/shared/contracts/wallet'

import { toCollector } from '../lib/form-defaults'
import { walletTargetKey, type WalletTarget } from '../lib/wallet-choice'
import { quoteFreshness } from '@/shared/lib/quote-freshness'
import { useCheckoutForm } from './useCheckoutForm'
import { useCheckoutQuote } from './useCheckoutQuote'
import { useSubmitOrder } from './useSubmitOrder'
import { useWalletConnection } from './useWalletConnection'

const STALE_CODES = ['QUOTE_STALE', 'EDITION_UNAVAILABLE']

export function useCheckoutController(userId: string, me: User, wallets: Wallet[], cart: Cart) {
  const { form, choice, chooseWallet, chosenWallet, customWallet } = useCheckoutForm(
    userId,
    me,
    wallets,
  )
  const [formNetwork, walletType, walletAddress] = useWatch({
    control: form.control,
    name: ['network', 'walletType', 'walletAddress'],
  })
  const network = customWallet ? (formNetwork ?? null) : (chosenWallet?.network ?? null)
  const target: WalletTarget | null = network
    ? {
        choice,
        network,
        custom: customWallet ? { address: walletAddress ?? '', type: walletType } : undefined,
      }
    : null
  const connection = useWalletConnection(userId, target ? walletTargetKey(target) : null)

  const onRejected = (error: ApiError) => {
    if (STALE_CODES.includes(error.code)) quoteFreshness.markStale()
    else if (error.code === 'WALLET_CONNECTION_REJECTED') connection.markDisconnected()
    else if (!applyApiFieldErrors(error, form.setError)) toast.error(error.message)
  }
  const submission = useSubmitOrder(userId, onRejected)
  const quoteState = useCheckoutQuote(cart, network, Boolean(submission.attempt))
  const { quote } = quoteState

  const canConfirm =
    form.formState.isValid &&
    Boolean(quote.data) &&
    !quote.isFetching &&
    !quoteState.needsAcknowledge &&
    !quoteState.stale &&
    !quoteState.hasUnavailable &&
    connection.state.status === 'connected' &&
    submission.phase === 'idle'

  const prepareOrder = async (): Promise<CreateOrderRequest | null> => {
    if (!(await form.trigger()) || connection.state.status !== 'connected' || !network) return null
    const walletId = connection.state.walletId
    const shownTotal = quote.data?.pricing.total
    const fresh = (await quote.refetch()).data
    if (!fresh || fresh.changes.length > 0 || fresh.pricing.total !== shownTotal) {
      quoteState.resetAcknowledge()
      if (fresh && fresh.changes.length === 0) quoteFreshness.markStale()
      return null
    }
    return { quoteId: fresh.quoteId, walletId, network, collector: toCollector(form.getValues()) }
  }

  return {
    ...quoteState,
    form,
    wallets,
    choice,
    chooseWallet,
    customWallet,
    walletType,
    network,
    target,
    connection,
    submission,
    canConfirm,
    prepareOrder,
  }
}

export type CheckoutController = ReturnType<typeof useCheckoutController>
