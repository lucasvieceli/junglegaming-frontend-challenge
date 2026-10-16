import { isAxiosError } from 'axios'

import { ApiErrorBodySchema } from '@/shared/contracts/common'

import { ApiError } from './api-error'

const NETWORK_MESSAGE = 'Não foi possível conectar. Verifique sua conexão e tente novamente.'
const TIMEOUT_MESSAGE = 'O servidor demorou para responder. Tente novamente.'
const UNKNOWN_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.'

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (!isAxiosError(error))
    return new ApiError({ status: 0, code: 'UNKNOWN', message: UNKNOWN_MESSAGE })

  if (error.code === 'ERR_CANCELED') {
    return new ApiError({ status: 0, code: 'CANCELED', message: 'Requisição cancelada' })
  }
  if (!error.response) {
    const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
    return new ApiError({
      status: 0,
      code: isTimeout ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR',
      message: isTimeout ? TIMEOUT_MESSAGE : NETWORK_MESSAGE,
      retryable: true,
      isNetwork: true,
    })
  }

  const parsed = ApiErrorBodySchema.safeParse(error.response.data)
  const status = error.response.status
  if (!parsed.success) {
    return new ApiError({
      status,
      code: 'HTTP_ERROR',
      message: UNKNOWN_MESSAGE,
      retryable: status >= 500,
    })
  }
  const body = parsed.data.error
  return new ApiError({
    status,
    code: body.code,
    message: body.message,
    fieldErrors: body.fieldErrors,
    details: body.details,
    retryable: body.retryable ?? status >= 500,
  })
}
