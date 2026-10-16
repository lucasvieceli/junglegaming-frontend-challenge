import { z } from 'zod'

import { EthAmountSchema, IsoDateSchema, NetworkSchema, NftImageKeySchema } from './common'

export const CartItemStatusSchema = z.enum([
  'ok',
  'price_changed',
  'quantity_reduced',
  'unavailable',
])
export type CartItemStatus = z.infer<typeof CartItemStatusSchema>

export const CartItemSchema = z.object({
  id: z.string(),
  nftId: z.string(),
  editionId: z.string(),
  quantity: z.int().min(1),
  unitPrice: EthAmountSchema,
  lineTotal: EthAmountSchema,
  nft: z.object({
    name: z.string(),
    tokenId: z.string(),
    imageKey: NftImageKeySchema,
    editionLabel: z.string(),
  }),
  available: z.int().nullable(),
  maxQuantity: z.int(),
  status: CartItemStatusSchema,
})
export type CartItem = z.infer<typeof CartItemSchema>

export const CartPricingSchema = z.object({
  subtotal: EthAmountSchema,
  discount: EthAmountSchema,
  networkFee: EthAmountSchema,
  total: EthAmountSchema,
  feeNetwork: NetworkSchema,
})
export type CartPricing = z.infer<typeof CartPricingSchema>

export const CouponSchema = z.object({ code: z.string(), percentOff: z.number() })
export type Coupon = z.infer<typeof CouponSchema>

export const CartSchema = z.object({
  id: z.string(),
  ownerKey: z.string(),
  items: z.array(CartItemSchema),
  coupon: CouponSchema.nullable(),
  pricing: CartPricingSchema,
  version: z.int(),
  updatedAt: IsoDateSchema,
})
export type Cart = z.infer<typeof CartSchema>

export const QuoteChangeSchema = z.object({
  itemId: z.string(),
  kind: z.enum(['price_changed', 'quantity_reduced', 'unavailable', 'coupon_removed']),
  from: z.string().nullable(),
  to: z.string().nullable(),
  message: z.string(),
})
export type QuoteChange = z.infer<typeof QuoteChangeSchema>

export const QuoteSchema = z.object({
  quoteId: z.string(),
  cartVersion: z.int(),
  catalogVersion: z.int(),
  items: z.array(CartItemSchema),
  coupon: CouponSchema.nullable(),
  pricing: CartPricingSchema,
  changes: z.array(QuoteChangeSchema),
  expiresAt: IsoDateSchema,
})
export type Quote = z.infer<typeof QuoteSchema>

export const AddCartItemRequestSchema = z.object({
  nftId: z.string(),
  editionId: z.string(),
  quantity: z.int().min(1),
})
export type AddCartItemRequest = z.infer<typeof AddCartItemRequestSchema>

export const QuoteRequestSchema = z.object({
  couponCode: z.string().optional(),
  network: NetworkSchema.optional(),
})
export type QuoteRequest = z.infer<typeof QuoteRequestSchema>
