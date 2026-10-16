import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'

import type { RealtimeState } from '@/shared/components/feedback/RealtimeStatusDot'
import { getGuestId } from '@/shared/session/guest-id'
import { useSession } from '@/shared/session/useSession'

import { applyRealtimeEvent } from '../lib/apply-event'
import { reconcile } from '../lib/reconcile'
import { SeenIds } from '../lib/seen-ids'
import { createSocket } from '../lib/socket'
import { VersionStore } from '../lib/version-store'

const EVENTS = ['nft.updated', 'order.updated'] as const

export function useRealtimeSocket() {
  const queryClient = useQueryClient()
  const session = useSession()
  const [state, setState] = useState<RealtimeState>('reconnecting')
  const [lastEventId, setLastEventId] = useState<string | null>(null)
  const seen = useRef(new SeenIds())
  const versions = useRef(new VersionStore())
  const ready = session.status !== 'loading'
  const token = session.token
  const userId = session.user?.id ?? null

  useEffect(() => {
    if (!ready) return
    const ownerKey = userId ? `user:${userId}` : `guest:${getGuestId()}`
    let socket: Socket | null = null
    let cancelled = false
    let connectedOnce = false

    const onEvent = (raw: unknown) => {
      const applied = applyRealtimeEvent(raw, {
        queryClient,
        userId,
        ownerKey,
        seen: seen.current,
        versions: versions.current,
      })
      if (applied) setLastEventId(applied.id)
    }
    const onResync = () => {
      // The first connection was just fetched via REST; only reconnects need to reconcile.
      if (connectedOnce) reconcile(queryClient, ownerKey)
      connectedOnce = true
    }

    void createSocket(token, getGuestId()).then((created) => {
      if (cancelled) return
      socket = created
      created.on('connect', () => {
        setState('connected')
        created.emit('session.identify', { token, guestId: getGuestId() })
      })
      created.on('disconnect', () => setState('reconnecting'))
      created.on('connect_error', () => setState('reconnecting'))
      created.on('realtime.resync', onResync)
      EVENTS.forEach((event) => created.on(event, onEvent))
      created.connect()
    })

    return () => {
      cancelled = true
      socket?.removeAllListeners()
      socket?.disconnect()
    }
  }, [ready, token, userId, queryClient])

  return { state, isConnected: state === 'connected', lastEventId }
}
