import { redirect, type ParsedLocation } from '@tanstack/react-router'
import { toast } from '@/shared/lib/toast'

import { safeRedirect } from '@/features/auth/lib/safe-redirect'
import { checkoutStorage } from '@/features/checkout/lib/checkout-storage'
import { orderQuery } from '@/features/orders/api/order-query'
import { cartQuery } from '@/shared/api/cart-query'
import { sessionStore } from '@/shared/session/session-store'

import type { RouterContext } from './router-context'

type GuardArgs = { context: RouterContext; location: ParsedLocation }

export async function requireAuth({ context, location }: GuardArgs) {
  await context.auth.ready
  if (!sessionStore.get().user) {
    throw redirect({ to: '/login', search: { redirect: location.href }, replace: true })
  }
}

export async function redirectIfAuthenticated({
  context,
  search,
}: {
  context: RouterContext
  search: { redirect?: string }
}) {
  await context.auth.ready
  if (sessionStore.get().user)
    throw redirect({ href: safeRedirect(search.redirect), replace: true })
}

export async function requireCheckoutReady(
  args: GuardArgs & { cause: 'preload' | 'enter' | 'stay' },
) {
  await requireAuth(args)
  if (args.cause === 'stay') return
  const userId = sessionStore.get().user?.id as string
  const attempt = checkoutStorage.loadAttempt(userId)
  if (attempt?.orderId) {
    const order = await args.context.queryClient
      .fetchQuery(orderQuery(userId, attempt.orderId, false))
      .catch(() => null)
    if (order && order.status !== 'pending') checkoutStorage.clearAttempt(userId)
    else
      throw redirect({
        to: '/orders/$orderId',
        params: { orderId: attempt.orderId },
        replace: true,
      })
  } else if (attempt) return
  const cart = await args.context.queryClient
    .fetchQuery(cartQuery(`user:${userId}`))
    .catch(() => null)
  if (cart && !cart.items.some((item) => item.status !== 'unavailable')) {
    toast.info('Seu carrinho está vazio.')
    throw redirect({ to: '/cart', replace: true })
  }
}
