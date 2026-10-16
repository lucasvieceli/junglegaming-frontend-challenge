import { Controller, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'

import { fieldErrorOf } from './field-error-of'
import { FormField } from './FormField'
import type { FormFieldVariant } from './form-field-variant'
import { SelectField, type SelectOption } from './SelectField'

type SelectFieldRhfProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  options: SelectOption[]
  placeholder: string
  disabled?: boolean
  variant?: FormFieldVariant
}

export function SelectFieldRhf<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder,
  disabled,
  variant = 'profile',
}: SelectFieldRhfProps<T>) {
  return (
    <FormField label={label} required variant={variant} error={fieldErrorOf(form, name)}>
      {(control) => (
        <Controller
          control={form.control}
          name={name}
          render={({ field }) => (
            <SelectField
              {...control}
              options={options}
              value={field.value as string | undefined}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              disabled={disabled}
              variant={variant}
              className="max-lg:h-[50px] max-lg:rounded-[10px]"
            />
          )}
        />
      )}
    </FormField>
  )
}
