import { isApiError } from '@/shared/api/api-error'

let apiUnreachable = false
const listeners = new Set<() => void>()

function setUnreachable(value: boolean) {
  if (apiUnreachable === value) return
  apiUnreachable = value
  listeners.forEach((listener) => listener())
}

export function reportRequestError(error: unknown): void {
  if (isApiError(error) && error.isNetwork) setUnreachable(true)
}

export function reportRequestSuccess(): void {
  setUnreachable(false)
}

export function isApiUnreachable(): boolean {
  return apiUnreachable
}

export function subscribeNetworkStatus(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
