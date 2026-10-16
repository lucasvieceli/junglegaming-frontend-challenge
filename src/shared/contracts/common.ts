import { z } from 'zod'

import { NFT_IMAGE_KEYS } from '@/shared/lib/nft-image'

export const EthAmountSchema = z.string().regex(/^\d+(\.\d{1,6})?$/, 'Valor ETH inválido')
export type EthAmount = z.infer<typeof EthAmountSchema>

export const NetworkSchema = z.enum(['ethereum', 'polygon', 'solana'])
export type Network = z.infer<typeof NetworkSchema>

export const WalletTypeSchema = z.enum(['metamask', 'walletconnect', 'coinbase'])
export type WalletType = z.infer<typeof WalletTypeSchema>

export const NftImageKeySchema = z.enum(NFT_IMAGE_KEYS)

export const IsoDateSchema = z.iso.datetime()

export const ApiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
    details: z.record(z.string(), z.unknown()).optional(),
    retryable: z.boolean().optional(),
  }),
})
export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>

export const EmailSchema = z.email('Informe um e-mail válido')
