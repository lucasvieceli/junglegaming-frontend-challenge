export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fieldErrors: Record<string, string[]> | undefined
  readonly details: Record<string, unknown> | undefined
  readonly retryable: boolean
  readonly isNetwork: boolean

  constructor(init: {
    status: number
    code: string
    message: string
    fieldErrors?: Record<string, string[]>
    details?: Record<string, unknown>
    retryable?: boolean
    isNetwork?: boolean
  }) {
    super(init.message)
    this.name = 'ApiError'
    this.status = init.status
    this.code = init.code
    this.fieldErrors = init.fieldErrors
    this.details = init.details
    this.retryable = init.retryable ?? false
    this.isNetwork = init.isNetwork ?? false
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isClientError(error: unknown): boolean {
  return isApiError(error) && error.status >= 400 && error.status < 500
}

export function isForbidden(error: unknown): boolean {
  return isApiError(error) && error.status === 403
}
