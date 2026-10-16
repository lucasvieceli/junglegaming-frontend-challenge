import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export function fieldErrorOf<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: Path<T>,
): string | undefined {
  const error = form.formState.errors[name]
  return typeof error?.message === 'string' ? error.message : undefined
}
