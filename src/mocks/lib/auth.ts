import { newId } from '@/shared/lib/id'

import { getDb, transact } from '../db/db'
import type { DbSession, DbUser } from '../db/schema'
import { getScenario } from '../scenarios/store'
import { addMs, now } from './clock'
import { messages } from './messages'
import { MockHttpError } from './respond'

export interface Actor {
  user: DbUser | null
  session: DbSession | null
  guestId: string | null
}

const bearer = (request: Request) =>
  request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || null

export function resolveSession(token: string): { user: DbUser; session: DbSession } {
  const db = getDb()
  const session = db.sessions[token]
  if (!session) throw new MockHttpError(401, 'UNAUTHENTICATED', messages.unauthenticated)
  if (new Date(session.expiresAt).getTime() <= now().getTime()) {
    throw new MockHttpError(401, 'SESSION_EXPIRED', messages.sessionExpired)
  }
  const user = db.users[session.userId]
  if (!user) throw new MockHttpError(401, 'UNAUTHENTICATED', messages.unauthenticated)
  return { user, session }
}

export function resolveActor(request: Request, options: { publicRoute?: boolean } = {}): Actor {
  const guestId = request.headers.get('X-Guest-Id') || null
  const token = bearer(request)
  if (!token) return { user: null, session: null, guestId }
  try {
    const { user, session } = resolveSession(token)
    return { user, session, guestId }
  } catch (error) {
    if (options.publicRoute) return { user: null, session: null, guestId }
    throw error
  }
}

export function requireUser(request: Request): {
  user: DbUser
  session: DbSession
  guestId: string | null
} {
  const actor = resolveActor(request)
  if (!actor.user || !actor.session)
    throw new MockHttpError(401, 'UNAUTHENTICATED', messages.unauthenticated)
  return { user: actor.user, session: actor.session, guestId: actor.guestId }
}

export function ownerKeyOf(actor: Actor): string {
  if (actor.user) return `user:${actor.user.id}`
  if (actor.guestId) return `guest:${actor.guestId}`
  throw new MockHttpError(401, 'UNAUTHENTICATED', messages.unauthenticated)
}

export function createSession(userId: string): DbSession {
  const ttlMs = getScenario().session.ttlMs
  const session: DbSession = { token: newId(), userId, expiresAt: addMs(ttlMs), ttlMs }
  transact((db) => {
    db.sessions[session.token] = session
  })
  return session
}

export function maybeRenewSession(session: DbSession): DbSession {
  const remaining = new Date(session.expiresAt).getTime() - now().getTime()
  if (session.ttlMs < 3_600_000 || remaining > 10 * 60_000) return session
  return transact((db) => {
    const renewed = { ...session, expiresAt: addMs(session.ttlMs) }
    db.sessions[session.token] = renewed
    return renewed
  })
}

export function publicUser(user: DbUser) {
  const { passwordHash: _hash, salt: _salt, ...rest } = user
  return rest
}
