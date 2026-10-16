import { z } from 'zod'

export const CHECKOUT_STEPS = ['Dados do colecionador', 'Carteira e rede', 'Revisão'] as const

export const checkoutSearchSchema = z.object({
  step: z.coerce.number().int().min(1).max(3).default(1).catch(1),
})
export type CheckoutSearch = z.infer<typeof checkoutSearchSchema>

export const STEP_ONE_FIELDS = [
  'displayName',
  'username',
  'email',
  'profileName',
  'referralCode',
  'ensName',
] as const

export const CUSTOM_WALLET_FIELDS = ['network', 'walletAddress', 'walletType'] as const
