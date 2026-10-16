import { isApiError } from '@/shared/api/api-error'

export function couponErrorOf(error: unknown): string | null {
  return isApiError(error) && error.status === 422 && error.code.startsWith('COUPON')
    ? error.message
    : null
}
