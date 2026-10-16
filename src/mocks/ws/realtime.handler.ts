import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'

import { env } from '@/app/env'
import { SessionIdentifyPayloadSchema } from '@/shared/contracts/events'

import { resolveActor } from '../lib/auth'
import { getScenario } from '../scenarios/store'
import { runScenarioTrigger } from '../scenarios/triggers'
import { registerConnection, unregisterConnection } from './connections'

// msw strips "/socket.io/" and the query before matching, so link the bare origin.
export const realtime = ws.link(env.VITE_SOCKET_URL)

// The binding advertises pings but never sends them; without this the client drops every 30 s.
const PING_INTERVAL_MS = 20_000
const ENGINE_IO_PING = '2'

function userIdFrom(token: string | null, guestId: string | null): string | null {
  if (!token) return null
  const headers = new Headers({ Authorization: `Bearer ${token}` })
  if (guestId) headers.set('X-Guest-Id', guestId)
  try {
    return resolveActor(new Request('http://mock/', { headers })).user?.id ?? null
  } catch {
    return null
  }
}

export const realtimeHandler = realtime.addEventListener('connection', (connection) => {
  if (getScenario().network === 'offline') {
    connection.client.close(1013, 'offline')
    return
  }
  const io = toSocketIo(connection)
  const url = new URL(connection.client.url)
  const entry = registerConnection({
    io,
    connection,
    userId: userIdFrom(url.searchParams.get('token'), url.searchParams.get('guestId')),
  })

  const ping = setInterval(() => connection.client.send(ENGINE_IO_PING), PING_INTERVAL_MS)
  connection.client.addEventListener('close', () => {
    clearInterval(ping)
    unregisterConnection(entry)
  })

  io.client.on('session.identify', (_event, payload) => {
    const parsed = SessionIdentifyPayloadSchema.safeParse(payload)
    if (parsed.success) entry.userId = userIdFrom(parsed.data.token, parsed.data.guestId)
  })

  // The binding sends the handshake in a microtask; emit after it.
  queueMicrotask(() => {
    io.client.emit('realtime.resync', { reason: 'reconnected' })
    runScenarioTrigger('connect', { userId: entry.userId })
  })
})
