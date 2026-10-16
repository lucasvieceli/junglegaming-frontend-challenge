import { http } from '@/shared/api/http-client'
import { UserSchema, type User } from '@/shared/contracts/auth'
import { OrdersResponseSchema, type Order } from '@/shared/contracts/order'
import { AvatarResponseSchema, type UpdateProfileRequest } from '@/shared/contracts/profile'

export async function updateProfile(body: UpdateProfileRequest): Promise<User> {
  return UserSchema.parse((await http.patch('/me', body)).data)
}

export async function uploadAvatar(dataUrl: string): Promise<string> {
  return AvatarResponseSchema.parse((await http.put('/me/avatar', { dataUrl })).data).avatarUrl
}

export async function removeAvatar(): Promise<void> {
  await http.delete('/me/avatar')
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await http.post('/me/password', { currentPassword, newPassword })
}

export async function getOrders(signal?: AbortSignal): Promise<Order[]> {
  return OrdersResponseSchema.parse((await http.get('/orders', { signal })).data).items
}
