import type { QueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import {
  NftUpdatedPayloadSchema,
  OrderUpdatedPayloadSchema,
  RealtimeEnvelopeSchema,
  type RealtimeEnvelope,
} from '@/shared/contracts/events'
import type { NftDetail } from '@/shared/contracts/nft'
import type { Order } from '@/shared/contracts/order'

import { applyNftEvent } from './apply-nft-event'
import { applyOrderEvent } from './apply-order-event'
import type { SeenIds } from './seen-ids'
import type { VersionStore } from './version-store'

export type ApplyContext = {
  queryClient: QueryClient
  userId: string | null
  ownerKey: string
  seen: SeenIds
  versions: VersionStore
}

export function applyRealtimeEvent(raw: unknown, context: ApplyContext): RealtimeEnvelope | null {
  const parsed = RealtimeEnvelopeSchema.safeParse(raw)
  if (!parsed.success) return null
  const envelope = parsed.data
  // Dedupe must run before any side effect.
  if (!context.seen.add(envelope.id)) return null

  if (envelope.type === 'nft.updated') {
    const payload = NftUpdatedPayloadSchema.safeParse(envelope.payload)
    if (!payload.success) return null
    const cached = context.queryClient.getQueryData<NftDetail>(
      queryKeys.nfts.detail(payload.data.nftId),
    )
    if (!context.versions.accept(`nft:${payload.data.nftId}`, envelope.version, cached?.version))
      return null
    applyNftEvent(context.queryClient, context.ownerKey, payload.data, envelope.version)
    return envelope
  }

  if (!context.userId || envelope.userId !== context.userId) return null
  const payload = OrderUpdatedPayloadSchema.safeParse(envelope.payload)
  if (!payload.success) return null
  const cached = context.queryClient.getQueryData<Order>(
    queryKeys.orders.detail(context.userId, payload.data.orderId),
  )
  if (!context.versions.accept(`order:${payload.data.orderId}`, envelope.version, cached?.version))
    return null
  applyOrderEvent(context.queryClient, context.userId, payload.data, envelope.version)
  return envelope
}
