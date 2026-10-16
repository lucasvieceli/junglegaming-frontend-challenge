import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { isApiError } from '@/shared/api/api-error'
import { cn } from '@/shared/lib/cn'

import { useLogin } from '../hooks/useLogin'
import { loginFormSchema, type AuthLayout, type LoginFormValues } from '../lib/auth-forms'
import { AuthField } from './AuthField'
import { AuthSubmitButton } from './AuthSubmitButton'
import { FormAlert } from './FormAlert'
import { ForgotPasswordLink } from './ForgotPasswordLink'

export function LoginForm({ layout, redirect }: { layout: AuthLayout; redirect?: string }) {
  const login = useLogin(redirect)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  })
  const { errors } = form.formState

  const submitError = login.error
    ? isApiError(login.error) && login.error.status === 401
      ? 'E-mail ou senha incorretos.'
      : 'Não foi possível entrar agora. Tente novamente.'
    : null

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => login.mutate(values))}
      className="flex flex-col"
    >
      <div className={cn('flex flex-col gap-3', layout === 'dialog' && 'px-20 pt-6')}>
        {submitError && <FormAlert>{submitError}</FormAlert>}
        <AuthField
          layout={layout}
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="contato@email.com"
          error={errors.email?.message}
          {...form.register('email')}
        />
        <AuthField
          layout={layout}
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Senha"
          error={errors.password?.message}
          {...form.register('password')}
        />
        <ForgotPasswordLink />
      </div>
      <AuthSubmitButton layout={layout} pending={login.isPending}>
        {login.isPending ? 'Entrando…' : 'Entrar'}
      </AuthSubmitButton>
    </form>
  )
}
