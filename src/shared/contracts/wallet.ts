import { z } from 'zod'

import { IsoDateSchema, NetworkSchema, WalletTypeSchema } from './common'

export const WalletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Endereço 0x inválido (40 caracteres hexadecimais)')
export const EnsNameSchema = z
  .string()
  .regex(/^[a-z0-9-]{3,63}$/, 'Use letras minúsculas, números e hífen')
export const ReferralCodeSchema = z.string().regex(/^[A-Z0-9-]{4,12}$/, 'Código inválido')

export const WalletKindSchema = z.enum(['primary', 'secondary', 'custom'])
export type WalletKind = z.infer<typeof WalletKindSchema>

export const WalletSchema = z.object({
  id: z.string(),
  userId: z.string(),
  kind: WalletKindSchema,
  displayName: z.string(),
  alias: z.string(),
  profileName: z.string(),
  network: NetworkSchema,
  address: WalletAddressSchema,
  secondaryAddress: z.string().nullable(),
  type: WalletTypeSchema,
  referralCode: ReferralCodeSchema,
  email: z.email(),
  ensName: EnsNameSchema,
  sameAsPrimary: z.boolean(),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema,
})
export type Wallet = z.infer<typeof WalletSchema>

export const WalletsResponseSchema = z.object({ items: z.array(WalletSchema) })

export const SaveWalletRequestSchema = WalletSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})
export type SaveWalletRequest = z.infer<typeof SaveWalletRequestSchema>

export const WalletConnectionStatusSchema = z.enum(['connected', 'disconnected', 'never'])
export type WalletConnectionStatus = z.infer<typeof WalletConnectionStatusSchema>

export const WalletConnectionSchema = z.object({
  status: WalletConnectionStatusSchema,
  network: NetworkSchema.nullable(),
  connectedAt: IsoDateSchema.nullable(),
})
export type WalletConnection = z.infer<typeof WalletConnectionSchema>

export const ConnectWalletResponseSchema = z.object({
  walletId: z.string(),
  status: z.literal('connected'),
  address: WalletAddressSchema,
  connectedAt: IsoDateSchema,
})
export type ConnectWalletResponse = z.infer<typeof ConnectWalletResponseSchema>

export const ConnectCustomWalletRequestSchema = z.object({
  address: WalletAddressSchema,
  type: WalletTypeSchema,
  network: NetworkSchema,
})
export type ConnectCustomWalletRequest = z.infer<typeof ConnectCustomWalletRequestSchema>
