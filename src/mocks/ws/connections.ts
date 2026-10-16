import type { toSocketIo } from '@mswjs/socket.io-binding'
import type { WebSocketHandlerConnection } from 'msw'

import type {
  NftUpdatedPayload,
  OrderUpdatedPayload,
  RealtimeEnvelope,
} from '@/shared/contracts/events'
import { newId } from '@/shared/lib/id'

import { nowIso } from '../lib/clock'

type SocketIo = ReturnType<typeof toSocketIo>

export interface RealtimeConnection {
  io: SocketIo
  connection: WebSocketHandlerConnection
  userId: string | null
}

const connections = new Set<RealtimeConnection>()
const emitted = new Map<string, RealtimeEnvelope>()
let lastEmittedId: string | null = null

export function getLastEmittedId(): string | null {
  return lastEmittedId
}

export function registerConnection(entry: RealtimeConnection): RealtimeConnection {
  connections.add(entry)
  return entry
}

export function unregisterConnection(entry: RealtimeConnection): void {
  connections.delete(entry)
}

export function connectionCount(): number {
  return connections.size
}

export function envelope(
  type: RealtimeEnvelope['type'],
  resource: RealtimeEnvelope['resource'],
  version: number,
  userId: string | null,
  payload: unknown,
): RealtimeEnvelope {
  const event: RealtimeEnvelope = {
    id: newId(),
    type,
    resource,
    version,
    occurredAt: nowIso(),
    userId,
    payload,
  }
  emitted.set(event.id, event)
  lastEmittedId = event.id
  return event
}

function deliver(event: RealtimeEnvelope, target: (entry: RealtimeConnection) => boolean): void {
  for (const entry of connections) if (target(entry)) entry.io.client.emit(event.type, event)
}

export function broadcastNftUpdated(payload: NftUpdatedPayload, version: number): RealtimeEnvelope {
  const event = envelope('nft.updated', { type: 'nft', id: payload.nftId }, version, null, payload)
  deliver(event, () => true)
  return event
}

export function emitOrderUpdated(
  userId: string,
  payload: OrderUpdatedPayload,
  version: number,
  deliverTo: 'owner' | 'all' = 'owner',
): RealtimeEnvelope {
  const event = envelope(
    'order.updated',
    { type: 'order', id: payload.orderId },
    version,
    userId,
    payload,
  )
  deliver(event, (entry) => deliverTo === 'all' || entry.userId === userId)
  return event
}

export function redeliver(
  eventId: string,
  overrides: Partial<RealtimeEnvelope> = {},
): RealtimeEnvelope | null {
  const original = emitted.get(eventId)
  if (!original) return null
  const event = { ...original, ...overrides }
  deliver(event, (entry) => event.userId === null || entry.userId === event.userId)
  return event
}

export function dropConnections(userId?: string): void {
  for (const entry of [...connections]) {
    if (!userId || entry.userId === userId) entry.connection.client.close(1012, 'server restart')
  }
}
