import { HttpResponse } from 'msw'
import type { z } from 'zod'

export class MockHttpError extends Error {
  readonly status: number
  readonly code: string
  readonly fieldErrors: Record<string, string[]> | undefined
  readonly details: Record<string, unknown> | undefined
  readonly retryable: boolean

  constructor(
    status: number,
    code: string,
    message: string,
    extra: {
      fieldErrors?: Record<string, string[]>
      details?: Record<string, unknown>
      retryable?: boolean
    } = {},
  ) {
    super(message)
    this.status = status
    this.code = code
    this.fieldErrors = extra.fieldErrors
    this.details = extra.details
    this.retryable = extra.retryable ?? status >= 500
  }
}

export function apiError(
  status: number,
  code: string,
  message: string,
  extra: {
    fieldErrors?: Record<string, string[]>
    details?: Record<string, unknown>
    retryable?: boolean
  } = {},
): Response {
  const headers = status === 503 ? { 'Retry-After': '2' } : undefined
  return HttpResponse.json(
    { error: { code, message, ...extra, retryable: extra.retryable ?? status >= 500 } },
    { status, headers },
  )
}

export function errorResponse(error: MockHttpError): Response {
  return apiError(error.status, error.code, error.message, {
    fieldErrors: error.fieldErrors,
    details: error.details,
    retryable: error.retryable,
  })
}

export function json<T>(schema: z.ZodType<T>, data: T, init?: ResponseInit): Response {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    console.error('[mock] response violates the contract', parsed.error.issues)
    throw new MockHttpError(500, 'CONTRACT_VIOLATION', 'Resposta fora do contrato.')
  }
  return HttpResponse.json(parsed.data as object, init)
}

export function noContent(): Response {
  return new HttpResponse(null, { status: 204 })
}

export async function parseBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    throw new MockHttpError(400, 'BAD_REQUEST', 'Corpo da requisição inválido.')
  }
  const parsed = schema.safeParse(raw)
  if (parsed.success) return parsed.data
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of parsed.error.issues) {
    const field = issue.path.join('.') || '_'
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message]
  }
  throw new MockHttpError(422, 'VALIDATION_ERROR', 'Revise os campos destacados.', { fieldErrors })
}
