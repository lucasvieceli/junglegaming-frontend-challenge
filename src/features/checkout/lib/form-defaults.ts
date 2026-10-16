import type { User } from '@/shared/contracts/auth'
import type { Wallet } from '@/shared/contracts/wallet'

import type { CheckoutDraft } from './checkout-storage'
import type { CollectorFormValues } from './collector-form'

export function walletFields(wallet: Wallet): Partial<CollectorFormValues> {
  return {
    network: wallet.network,
    walletType: wallet.type,
    walletAddress: wallet.address,
    referralCode: wallet.referralCode,
    profileName: wallet.profileName,
    secondaryWallet: wallet.secondaryAddress ?? '',
  }
}

function ensLabelFrom(username: string): string {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)
    .padEnd(3, '0')
}

export function formDefaults(
  me: User,
  wallet: Wallet | undefined,
  draft: CheckoutDraft | null,
): Partial<CollectorFormValues> {
  return {
    displayName: me.displayName,
    username: me.username,
    email: me.email,
    note: '',
    ...(wallet ? walletFields(wallet) : {}),
    ...(draft?.values as Partial<CollectorFormValues> | undefined),
    ensName: me.ensName ?? wallet?.ensName ?? ensLabelFrom(me.username),
  }
}

export function toCollector(values: CollectorFormValues) {
  return {
    displayName: values.displayName,
    username: values.username,
    email: values.email,
    profileName: values.profileName,
    referralCode: values.referralCode,
    ensName: values.ensName,
    note: values.note ? values.note : null,
  }
}
