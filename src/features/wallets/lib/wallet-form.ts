import { z } from 'zod'

import { EmailSchema, NetworkSchema, WalletTypeSchema } from '@/shared/contracts/common'
import {
  EnsNameSchema,
  ReferralCodeSchema,
  WalletAddressSchema,
  type Wallet,
  type WalletKind,
} from '@/shared/contracts/wallet'

const required = (message: string) => z.string().trim().min(1, message)

export const walletFormSchema = z.object({
  displayName: required('Informe o nome de exibição'),
  alias: required('Informe o apelido da carteira'),
  network: NetworkSchema,
  profileName: required('Informe o nome do perfil'),
  address: WalletAddressSchema,
  secondaryAddress: z.string().trim().max(80),
  type: WalletTypeSchema,
  referralCode: ReferralCodeSchema,
  email: EmailSchema,
  ensName: EnsNameSchema,
})
export type WalletFormValues = z.infer<typeof walletFormSchema>

export function walletToForm(wallet: Wallet | undefined): Partial<WalletFormValues> {
  if (!wallet) return { secondaryAddress: '' }
  return {
    displayName: wallet.displayName,
    alias: wallet.alias,
    network: wallet.network,
    profileName: wallet.profileName,
    address: wallet.address,
    secondaryAddress: wallet.secondaryAddress ?? '',
    type: wallet.type,
    referralCode: wallet.referralCode,
    email: wallet.email,
    ensName: wallet.ensName,
  }
}

export function formToRequest(values: WalletFormValues, kind: WalletKind, sameAsPrimary: boolean) {
  return { ...values, kind, sameAsPrimary, secondaryAddress: values.secondaryAddress || null }
}
