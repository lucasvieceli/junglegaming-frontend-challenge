import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { isApiError } from '@/shared/api/api-error'
import { applyApiFieldErrors } from '@/shared/api/field-errors'
import { cn } from '@/shared/lib/cn'

import { useRegister } from '../hooks/useRegister'
import { registerFormSchema, type AuthLayout, type RegisterFormValues } from '../lib/auth-forms'
import { AuthField } from './AuthField'
import { AuthSubmitButton } from './AuthSubmitButton'
import { FormAlert } from './FormAlert'

const DEFAULTS: RegisterFormValues = { username: '', email: '', password: '', confirmPassword: '' }

export function RegisterForm({ layout, redirect }: { layout: AuthLayout; redirect?: string }) {
  const registration = useRegister(redirect)
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: DEFAULTS,
  })
  const { errors } = form.formState

  const onSubmit = form.handleSubmit(({ confirmPassword: _confirm, ...body }) =>
    registration.mutate(body, {
      onError: (error) => {
        applyApiFieldErrors(error, form.setError)
      },
    }),
  )
  const generalError =
    registration.error && !(isApiError(registration.error) && registration.error.fieldErrors)
      ? 'Não foi possível criar a conta agora. Tente novamente.'
      : null

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col">
      <div className={cn('flex flex-col gap-3', layout === 'dialog' && 'px-20 pt-6')}>
        {generalError && <FormAlert>{generalError}</FormAlert>}
        <AuthField
          layout={layout}
          label="Nome de usuário"
          autoComplete="username"
          placeholder="Nome de usuário"
          error={errors.username?.message}
          {...form.register('username')}
        />
        <AuthField
          layout={layout}
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="Digite seu e-mail"
          error={errors.email?.message}
          {...form.register('email')}
        />
        <AuthField
          layout={layout}
          label="Senha"
          type="password"
          autoComplete="new-password"
          placeholder="Senha"
          error={errors.password?.message}
          {...form.register('password')}
        />
        <AuthField
          layout={layout}
          label="Confirmar senha"
          type="password"
          revealable={layout === 'page'}
          autoComplete="new-password"
          placeholder="Confirmar senha"
          error={errors.confirmPassword?.message}
          {...form.register('confirmPassword')}
        />
      </div>
      <AuthSubmitButton layout={layout} pending={registration.isPending}>
        {registration.isPending ? 'Criando…' : layout === 'dialog' ? 'Criar conta' : 'Criar perfil'}
      </AuthSubmitButton>
    </form>
  )
}
