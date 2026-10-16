import { z } from 'zod'

import { EditionSchema, AvailabilitySchema } from './nft'
import { EthAmountSchema, IsoDateSchema } from './common'
import { OrderStatusSchema, OrderTransactionSchema } from './order'

export const RealtimeEventTypeSchema = z.enum(['nft.updated', 'order.updated'])
export type RealtimeEventType = z.infer<typeof RealtimeEventTypeSchema>

export const RealtimeEnvelopeSchema = z.object({
  id: z.string(),
  type: RealtimeEventTypeSchema,
  resource: z.object({ type: z.enum(['nft', 'order']), id: z.string() }),
  version: z.int(),
  occurredAt: IsoDateSchema,
  userId: z.string().nullable(),
  payload: z.unknown(),
})
export type RealtimeEnvelope = z.infer<typeof RealtimeEnvelopeSchema>

export const NftUpdatedPayloadSchema = z.object({
  nftId: z.string(),
  price: EthAmountSchema,
  previousPrice: EthAmountSchema.nullable(),
  availability: AvailabilitySchema,
  editions: z.array(EditionSchema.pick({ id: true, available: true })),
  reason: z.enum(['price_changed', 'availability_changed']),
})
export type NftUpdatedPayload = z.infer<typeof NftUpdatedPayloadSchema>

export const OrderUpdatedPayloadSchema = z.object({
  orderId: z.string(),
  status: OrderStatusSchema,
  transaction: OrderTransactionSchema.nullable(),
  declineReason: z.string().nullable(),
})
export type OrderUpdatedPayload = z.infer<typeof OrderUpdatedPayloadSchema>

export const SessionIdentifyPayloadSchema = z.object({
  token: z.string().nullable(),
  guestId: z.string().nullable(),
})
export type SessionIdentifyPayload = z.infer<typeof SessionIdentifyPayloadSchema>
