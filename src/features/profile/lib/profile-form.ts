import { z } from 'zod'

import { PasswordSchema } from '@/shared/contracts/auth'
import { UpdateProfileRequestSchema } from '@/shared/contracts/profile'

export const profileFormSchema = UpdateProfileRequestSchema.required()
  .extend({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((values, context) => {
    const changing = Boolean(values.currentPassword || values.newPassword || values.confirmPassword)
    if (!changing) return
    if (!values.currentPassword)
      context.addIssue({
        code: 'custom',
        path: ['currentPassword'],
        message: 'Informe a senha atual',
      })
    const strong = PasswordSchema.safeParse(values.newPassword)
    if (!strong.success)
      context.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: strong.error.issues[0]?.message ?? 'Senha inválida',
      })
    if (values.newPassword !== values.confirmPassword)
      context.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'As senhas não conferem',
      })
  })
export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' }
