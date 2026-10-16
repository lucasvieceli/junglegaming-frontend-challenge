import { http } from '@/shared/api/http-client'
import {
  AuthResponseSchema,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from '@/shared/contracts/auth'
import { getGuestId } from '@/shared/session/guest-id'

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await http.post('/auth/login', body)
  return AuthResponseSchema.parse(data)
}

export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const { data } = await http.post('/auth/register', body)
  return AuthResponseSchema.parse(data)
}

export async function getSession(): Promise<AuthResponse> {
  const { data } = await http.get('/auth/session')
  return AuthResponseSchema.parse(data)
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout')
}

export async function mergeGuestCart(): Promise<void> {
  await http.post('/cart/merge', { guestId: getGuestId() })
}
