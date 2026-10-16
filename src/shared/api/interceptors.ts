import type { AxiosInstance } from 'axios'

import { apiReady } from './api-gate'
import { getHttpAuth } from './http-auth'
import { normalizeApiError } from './normalize-api-error'

const AUTH_ENDPOINTS_WITHOUT_EXPIRY = ['/auth/login', '/auth/register', '/auth/logout']

export function installInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(async (config) => {
    await apiReady
    const { getToken, getGuestId } = getHttpAuth()
    const token = getToken()
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    const guestId = getGuestId()
    if (guestId) config.headers.set('X-Guest-Id', guestId)
    return config
  })

  client.interceptors.response.use(undefined, (error: unknown) => {
    const apiError = normalizeApiError(error)
    const url = (error as { config?: { url?: string } }).config?.url ?? ''
    const hadToken = Boolean(getHttpAuth().getToken())
    const isAuthEndpoint = AUTH_ENDPOINTS_WITHOUT_EXPIRY.some((path) => url.startsWith(path))
    if (apiError.status === 401 && hadToken && !isAuthEndpoint) getHttpAuth().onUnauthorized()
    return Promise.reject(apiError)
  })
}
