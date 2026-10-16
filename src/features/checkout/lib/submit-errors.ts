import { isApiError, type ApiError } from '@/shared/api/api-error'

export function isUnconfirmed(error: unknown): boolean {
  return isApiError(error) && (error.isNetwork || error.code === 'REQUEST_TIMEOUT')
}

export function isDefinitiveRejection(error: unknown): error is ApiError {
  return isApiError(error) && error.status >= 400 && error.status < 500 && error.status !== 401
}
