import { z } from 'zod'

import { PasswordSchema, UsernameSchema } from './auth'
import { EmailSchema } from './common'
import { EnsNameSchema } from './wallet'

const LENGTH_MESSAGE = 'Informe entre 2 e 40 caracteres'
const NameSchema = z.string().min(2, LENGTH_MESSAGE).max(40, LENGTH_MESSAGE)

export const UpdateProfileRequestSchema = z
  .object({
    displayName: NameSchema,
    username: UsernameSchema,
    email: EmailSchema,
    ensName: EnsNameSchema,
    walletAlias: NameSchema,
  })
  .partial()
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>

export const AvatarRequestSchema = z.object({
  dataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp);base64,/, 'Formato de imagem não suportado'),
})
export const AvatarResponseSchema = z.object({ avatarUrl: z.string() })

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Informe a senha atual'),
  newPassword: PasswordSchema,
})
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>
