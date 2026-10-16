import { http } from 'msw'

import {
  AuthResponseSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
} from '@/shared/contracts/auth'

import { getDb, nextId, transact } from '../db/db'
import { api } from '../lib/api-path'
import { createSession, maybeRenewSession, publicUser, resolveSession } from '../lib/auth'
import { nowIso } from '../lib/clock'
import { messages } from '../lib/messages'
import { hashPassword, verifyPassword } from '../lib/password'
import { MockHttpError, json, noContent, parseBody } from '../lib/respond'
import { withScenario } from '../scenarios/apply'

const bearer = (request: Request) =>
  request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? ''

export const authHandlers = [
  http.post(
    api('/auth/register'),
    withScenario(async ({ request }) => {
      const body = await parseBody(request, RegisterRequestSchema)
      const users = Object.values(getDb().users)
      if (users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
        throw new MockHttpError(409, 'EMAIL_TAKEN', messages.emailTaken, {
          fieldErrors: { email: [messages.emailTaken] },
        })
      }
      if (users.some((u) => u.username === body.username)) {
        throw new MockHttpError(409, 'USERNAME_TAKEN', messages.usernameTaken, {
          fieldErrors: { username: [messages.usernameTaken] },
        })
      }
      const { salt, hash } = await hashPassword(body.password)
      const id = nextId('usr')
      const user = transact((db) => {
        db.users[id] = {
          id,
          displayName: body.username,
          username: body.username,
          email: body.email,
          avatarUrl: null,
          ensName: null,
          walletAlias: null,
          createdAt: nowIso(),
          passwordHash: hash,
          salt,
        }
        db.favorites[id] = []
        return db.users[id]
      })
      const session = createSession(id)
      return json(
        AuthResponseSchema,
        { user: publicUser(user), session: { token: session.token, expiresAt: session.expiresAt } },
        { status: 201 },
      )
    }),
  ),

  http.post(
    api('/auth/login'),
    withScenario(async ({ request }) => {
      const body = await parseBody(request, LoginRequestSchema)
      const user = Object.values(getDb().users).find(
        (u) => u.email.toLowerCase() === body.email.toLowerCase(),
      )
      if (!user || !(await verifyPassword(body.password, user.salt, user.passwordHash))) {
        throw new MockHttpError(401, 'INVALID_CREDENTIALS', messages.invalidCredentials)
      }
      const session = createSession(user.id)
      return json(AuthResponseSchema, {
        user: publicUser(user),
        session: { token: session.token, expiresAt: session.expiresAt },
      })
    }),
  ),

  http.get(
    api('/auth/session'),
    withScenario(({ request }) => {
      const { user, session } = resolveSession(bearer(request))
      const current = maybeRenewSession(session)
      return json(AuthResponseSchema, {
        user: publicUser(user),
        session: { token: current.token, expiresAt: current.expiresAt },
      })
    }),
  ),

  http.post(
    api('/auth/logout'),
    withScenario(({ request }) => {
      const token = bearer(request)
      transact((db) => {
        delete db.sessions[token]
      })
      return noContent()
    }),
  ),
]
