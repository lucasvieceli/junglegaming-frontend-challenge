import { z } from 'zod'

import { EmailSchema, NetworkSchema, WalletTypeSchema } from '@/shared/contracts/common'
import { EnsNameSchema, ReferralCodeSchema, WalletAddressSchema } from '@/shared/contracts/wallet'

const required = (message: string) => z.string().trim().min(1, message)

export const collectorFormSchema = z.object({
  displayName: required('Informe o nome de exibição'),
  username: required('Informe o nome de usuário'),
  email: EmailSchema,
  profileName: required('Informe o nome do perfil'),
  referralCode: ReferralCodeSchema,
  ensName: EnsNameSchema,
  network: NetworkSchema,
  walletType: WalletTypeSchema,
  walletAddress: WalletAddressSchema,
  secondaryWallet: z.string().trim().max(80).optional(),
  note: z.string().trim().max(500).optional(),
})
export type CollectorFormValues = z.infer<typeof collectorFormSchema>

export const COLLECTOR_FIELD_LABELS: Record<keyof CollectorFormValues, string> = {
  displayName: 'Nome de exibição',
  username: 'Nome de usuário',
  email: 'E-mail',
  profileName: 'Nome do perfil',
  referralCode: 'Código de indicação',
  ensName: 'Nome ENS',
  network: 'Rede',
  walletType: 'Tipo de carteira',
  walletAddress: 'Endereço da carteira',
  secondaryWallet: 'ENS ou carteira secundária (opcional)',
  note: 'Observação do colecionador (opcional)',
}
