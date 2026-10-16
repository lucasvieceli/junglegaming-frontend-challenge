import { z } from 'zod'

import { EmailSchema, IsoDateSchema } from './common'

export const UsernameSchema = z
  .string()
  .regex(/^[a-z0-9_.]{3,20}$/, 'Use de 3 a 20 letras minúsculas, números, ponto ou _')
export const PasswordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres com letras e números')
  .regex(/[a-zA-Z]/, 'Mínimo 8 caracteres com letras e números')
  .regex(/\d/, 'Mínimo 8 caracteres com letras e números')

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  username: z.string(),
  email: z.email(),
  avatarUrl: z.string().nullable(),
  ensName: z.string().nullable(),
  walletAlias: z.string().nullable(),
  createdAt: IsoDateSchema,
})
export type User = z.infer<typeof UserSchema>

export const SessionSchema = z.object({ token: z.string(), expiresAt: IsoDateSchema })
export type Session = z.infer<typeof SessionSchema>

export const AuthResponseSchema = z.object({ user: UserSchema, session: SessionSchema })
export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const StoredSessionSchema = z.object({
  token: z.string(),
  expiresAt: IsoDateSchema,
  user: UserSchema,
})
export type StoredSession = z.infer<typeof StoredSessionSchema>

export const LoginRequestSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Informe a senha'),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const RegisterRequestSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
