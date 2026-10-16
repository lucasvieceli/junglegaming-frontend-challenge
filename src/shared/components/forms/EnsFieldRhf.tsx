import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { EnsInput } from './EnsInput'
import { fieldErrorOf } from './field-error-of'
import { FormField } from './FormField'
import type { FormFieldVariant } from './form-field-variant'

export function EnsFieldRhf<T extends FieldValues>({
  form,
  name,
  readOnly,
  variant = 'profile',
}: {
  form: UseFormReturn<T>
  name: Path<T>
  readOnly?: boolean
  variant?: FormFieldVariant
}) {
  return (
    <FormField label="Nome ENS" required variant={variant} error={fieldErrorOf(form, name)}>
      {(control) => (
        <EnsInput
          {...control}
          {...form.register(name)}
          readOnly={readOnly}
          variant={variant}
          className="max-lg:h-[50px]"
        />
      )}
    </FormField>
  )
}
