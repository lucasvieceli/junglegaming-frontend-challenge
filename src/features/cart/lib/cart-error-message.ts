import { isApiError } from '@/shared/api/api-error'

export function cartErrorMessage(error: unknown, fallback: string): string {
  return isApiError(error) && error.status < 500 && !error.isNetwork ? error.message : fallback
}
