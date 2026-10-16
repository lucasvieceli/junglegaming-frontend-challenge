import { z } from 'zod'

import { LoginRequestSchema, RegisterRequestSchema } from '@/shared/contracts/auth'

export const loginFormSchema = LoginRequestSchema
export type LoginFormValues = z.infer<typeof loginFormSchema>

export const registerFormSchema = RegisterRequestSchema.extend({
  confirmPassword: z.string().min(1, 'Confirme a senha'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
})
export type RegisterFormValues = z.infer<typeof registerFormSchema>

export const authSearchSchema = z.object({ redirect: z.string().optional().catch(undefined) })

export type AuthLayout = 'dialog' | 'page'
