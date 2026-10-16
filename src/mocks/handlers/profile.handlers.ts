import { http } from 'msw'

import { UserSchema } from '@/shared/contracts/auth'
import {
  AvatarRequestSchema,
  AvatarResponseSchema,
  ChangePasswordRequestSchema,
  UpdateProfileRequestSchema,
} from '@/shared/contracts/profile'

import { getDb, transact } from '../db/db'
import { api } from '../lib/api-path'
import { publicUser, requireUser } from '../lib/auth'
import { messages } from '../lib/messages'
import { hashPassword, verifyPassword } from '../lib/password'
import { MockHttpError, json, noContent, parseBody } from '../lib/respond'
import { withScenario } from '../scenarios/apply'

const MAX_AVATAR_BYTES = 200 * 1024

export const profileHandlers = [
  http.get(
    api('/me'),
    withScenario(({ request }) => json(UserSchema, publicUser(requireUser(request).user))),
  ),

  http.patch(
    api('/me'),
    withScenario(async ({ request }) => {
      const { user } = requireUser(request)
      const body = await parseBody(request, UpdateProfileRequestSchema)
      const others = Object.values(getDb().users).filter((u) => u.id !== user.id)
      if (body.username && others.some((u) => u.username === body.username)) {
        throw new MockHttpError(409, 'USERNAME_TAKEN', messages.usernameTaken, {
          fieldErrors: { username: [messages.usernameTaken] },
        })
      }
      if (body.email && others.some((u) => u.email.toLowerCase() === body.email?.toLowerCase())) {
        throw new MockHttpError(409, 'EMAIL_TAKEN', messages.emailTaken, {
          fieldErrors: { email: [messages.emailTaken] },
        })
      }
      const updated = transact((db) => {
        const draft = db.users[user.id] as NonNullable<(typeof db.users)[string]>
        Object.assign(draft, body)
        return { ...draft }
      })
      return json(UserSchema, publicUser(updated))
    }),
  ),

  http.put(
    api('/me/avatar'),
    withScenario(async ({ request }) => {
      const { user } = requireUser(request)
      const { dataUrl } = await parseBody(request, AvatarRequestSchema)
      const bytes = Math.ceil(((dataUrl.split(',')[1] ?? '').length * 3) / 4)
      if (bytes > MAX_AVATAR_BYTES) {
        throw new MockHttpError(422, 'AVATAR_TOO_LARGE', messages.avatarTooLarge, {
          fieldErrors: { avatar: [messages.avatarTooLarge] },
        })
      }
      transact((db) => {
        const draft = db.users[user.id]
        if (draft) draft.avatarUrl = dataUrl
      })
      return json(AvatarResponseSchema, { avatarUrl: dataUrl })
    }),
  ),

  http.delete(
    api('/me/avatar'),
    withScenario(({ request }) => {
      const { user } = requireUser(request)
      transact((db) => {
        const draft = db.users[user.id]
        if (draft) draft.avatarUrl = null
      })
      return noContent()
    }),
  ),

  http.post(
    api('/me/password'),
    withScenario(async ({ request }) => {
      const { user, session } = requireUser(request)
      const body = await parseBody(request, ChangePasswordRequestSchema)
      if (!(await verifyPassword(body.currentPassword, user.salt, user.passwordHash))) {
        throw new MockHttpError(422, 'CURRENT_PASSWORD_INVALID', messages.currentPasswordInvalid, {
          fieldErrors: { currentPassword: [messages.currentPasswordInvalid] },
        })
      }
      const { salt, hash } = await hashPassword(body.newPassword)
      transact((db) => {
        const draft = db.users[user.id]
        if (draft) Object.assign(draft, { salt, passwordHash: hash })
        Object.values(db.sessions)
          .filter((s) => s.userId === user.id && s.token !== session.token)
          .forEach((s) => delete db.sessions[s.token])
      })
      return noContent()
    }),
  ),
]
