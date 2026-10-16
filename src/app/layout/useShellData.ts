import { useCart } from '@/features/cart/api/useCart'
import { itemCount } from '@/features/cart/lib/cart-status'
import { useSession } from '@/shared/session/useSession'

export function useShellData(): { cartCount: number; userName: string | null } {
  const session = useSession()
  const cart = useCart()
  return { cartCount: itemCount(cart.data), userName: session.user?.displayName ?? null }
}
