import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import { isApiError } from './api-error'

export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!isApiError(error) || !error.fieldErrors) return false
  const entries = Object.entries(error.fieldErrors)
  entries.forEach(([field, messages], index) => {
    setError(
      field as Path<T>,
      { type: 'server', message: messages[0] },
      { shouldFocus: index === 0 },
    )
  })
  return entries.length > 0
}
