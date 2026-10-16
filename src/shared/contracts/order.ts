import { z } from 'zod'

import { CartPricingSchema } from './cart'
import {
  EthAmountSchema,
  IsoDateSchema,
  NetworkSchema,
  NftImageKeySchema,
  WalletTypeSchema,
} from './common'
import { WalletKindSchema } from './wallet'

export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'declined'])
export type OrderStatus = z.infer<typeof OrderStatusSchema>

export const CollectorSchema = z.object({
  displayName: z.string(),
  username: z.string(),
  email: z.email(),
  profileName: z.string(),
  referralCode: z.string(),
  ensName: z.string(),
  note: z.string().nullable(),
})
export type Collector = z.infer<typeof CollectorSchema>

export const OrderItemSchema = z.object({
  nftId: z.string(),
  name: z.string(),
  tokenId: z.string(),
  imageKey: NftImageKeySchema,
  editionId: z.string(),
  editionLabel: z.string(),
  unitPrice: EthAmountSchema,
  quantity: z.int(),
  lineTotal: EthAmountSchema,
})
export type OrderItem = z.infer<typeof OrderItemSchema>

export const OrderTransactionSchema = z.object({ ref: z.string(), explorerUrl: z.string() })

export const OrderSchema = z.object({
  id: z.string(),
  number: z.string(),
  userId: z.string(),
  status: OrderStatusSchema,
  version: z.int(),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema,
  confirmedAt: IsoDateSchema.nullable(),
  wallet: z.object({
    id: z.string(),
    kind: WalletKindSchema,
    label: z.string(),
    type: WalletTypeSchema,
    network: NetworkSchema,
    address: z.string(),
  }),
  collector: CollectorSchema,
  items: z.array(OrderItemSchema),
  pricing: CartPricingSchema.extend({ couponCode: z.string().nullable() }),
  transaction: OrderTransactionSchema.nullable(),
  declineReason: z.string().nullable(),
  idempotencyKey: z.string(),
})
export type Order = z.infer<typeof OrderSchema>

export const OrdersResponseSchema = z.object({ items: z.array(OrderSchema) })

export const CreateOrderRequestSchema = z.object({
  quoteId: z.string(),
  walletId: z.string(),
  network: NetworkSchema,
  collector: CollectorSchema,
})
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>
