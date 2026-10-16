import type { ComponentProps } from 'react'

import { FormField } from '@/shared/components/forms/FormField'
import { PasswordInput } from '@/shared/components/forms/PasswordInput'
import { cn } from '@/shared/lib/cn'
import { Input } from '@/shared/ui/input'

import type { AuthLayout } from '../lib/auth-forms'

const INPUT_CLASS: Record<AuthLayout, string> = {
  dialog: 'h-10 rounded-[5px] px-4 focus-visible:border-primary',
  page: 'h-[50px] rounded-[10px] px-4 focus-visible:border-primary',
}

type AuthFieldProps = Omit<ComponentProps<'input'>, 'id'> & {
  label: string
  error?: string
  layout: AuthLayout
  revealable?: boolean
}

export function AuthField({
  label,
  error,
  layout,
  type,
  revealable = true,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <FormField label={label} error={error} hideLabel className="gap-1">
      {(control) =>
        type === 'password' && revealable ? (
          <PasswordInput
            {...props}
            {...control}
            className={cn(
              'type-b-16 placeholder:type-b-14',
              INPUT_CLASS[layout],
              'pr-12',
              className,
            )}
          />
        ) : (
          <Input
            {...props}
            {...control}
            type={type}
            className={cn('type-b-16 placeholder:type-b-14', INPUT_CLASS[layout], className)}
          />
        )
      }
    </FormField>
  )
}
