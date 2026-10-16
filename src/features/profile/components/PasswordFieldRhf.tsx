import type { UseFormReturn } from 'react-hook-form'

import { FormField } from '@/shared/components/forms/FormField'
import { PasswordInput } from '@/shared/components/forms/PasswordInput'

import type { ProfileFormValues } from '../lib/profile-form'

type PasswordName = 'currentPassword' | 'newPassword' | 'confirmPassword'

export function PasswordFieldRhf({
  form,
  name,
  label,
  autoComplete,
}: {
  form: UseFormReturn<ProfileFormValues>
  name: PasswordName
  label: string
  autoComplete: string
}) {
  return (
    <FormField
      label={label}
      error={form.formState.errors[name]?.message}
      className="w-full lg:w-[417px]"
    >
      {(control) => (
        <PasswordInput
          {...control}
          {...form.register(name)}
          autoComplete={autoComplete}
          className="max-lg:h-[50px] max-lg:rounded-[10px]"
        />
      )}
    </FormField>
  )
}
