import { isApiError } from '@/shared/api/api-error'
import { CartSchema, type Cart } from '@/shared/contracts/cart'

export function cartFromError(error: unknown): Cart | null {
  if (!isApiError(error)) return null
  const parsed = CartSchema.safeParse(error.details?.cart)
  return parsed.success ? parsed.data : null
}
