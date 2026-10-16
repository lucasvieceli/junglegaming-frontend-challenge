import type { Socket } from 'socket.io-client'

import { env } from '@/app/env'

export async function createSocket(token: string | null, guestId: string): Promise<Socket> {
  // Lazy import: engine.io captures WebSocket on import, so the mock must patch it first.
  const { io } = await import('socket.io-client')
  return io(env.VITE_SOCKET_URL, {
    transports: ['websocket'],
    query: token ? { token, guestId } : { guestId },
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  })
}
