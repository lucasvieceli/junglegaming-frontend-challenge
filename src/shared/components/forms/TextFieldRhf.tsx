import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { Input } from '@/shared/ui/input'

import { fieldErrorOf } from './field-error-of'
import { FormField } from './FormField'
import type { FormFieldVariant } from './form-field-variant'

type TextFieldRhfProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  required?: boolean
  variant?: FormFieldVariant
  hideLabel?: boolean
  keepLabelSpace?: boolean
  readOnly?: boolean
  placeholder?: string
  autoComplete?: string
  type?: 'text' | 'email'
}

export function TextFieldRhf<T extends FieldValues>({
  form,
  name,
  label,
  required = true,
  variant,
  hideLabel,
  keepLabelSpace,
  readOnly,
  placeholder,
  autoComplete,
  type = 'text',
}: TextFieldRhfProps<T>) {
  return (
    <FormField
      label={label}
      required={required}
      variant={variant}
      hideLabel={hideLabel}
      keepLabelSpace={keepLabelSpace}
      error={fieldErrorOf(form, name)}
    >
      {(control) => (
        <Input
          {...control}
          {...form.register(name)}
          type={type}
          readOnly={readOnly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="max-lg:h-[50px] max-lg:rounded-[10px]"
        />
      )}
    </FormField>
  )
}
