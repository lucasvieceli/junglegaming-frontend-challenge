import { useQuery } from '@tanstack/react-query'

import { meQuery, walletsQuery } from '@/shared/api/account-queries'
import { cartQuery } from '@/shared/api/cart-query'
import { ErrorState } from '@/shared/components/feedback/ErrorState'

import { CheckoutContent } from '../components/CheckoutContent'
import { CheckoutSkeleton } from '../components/CheckoutSkeleton'

export function CheckoutPage({ userId, step }: { userId: string; step: number }) {
  const me = useQuery(meQuery(userId))
  const wallets = useQuery(walletsQuery(userId))
  const cart = useQuery(cartQuery(`user:${userId}`))

  if (me.isError || wallets.isError || (cart.isError && !cart.data)) {
    return (
      <ErrorState
        title="Não foi possível carregar o pagamento"
        onRetry={() => void Promise.all([me.refetch(), wallets.refetch(), cart.refetch()])}
      />
    )
  }
  if (!me.data || !wallets.data || !cart.data) return <CheckoutSkeleton />
  return (
    <CheckoutContent
      userId={userId}
      me={me.data}
      wallets={wallets.data}
      cart={cart.data}
      step={step}
    />
  )
}
