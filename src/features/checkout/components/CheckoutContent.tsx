import type { User } from '@/shared/contracts/auth'
import type { Cart } from '@/shared/contracts/cart'
import type { Wallet } from '@/shared/contracts/wallet'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { DESKTOP_QUERY } from '@/shared/lib/breakpoints'

import { useCheckoutController } from '../hooks/useCheckoutController'
import { CheckoutDesktop } from './CheckoutDesktop'
import { CheckoutMobile } from './CheckoutMobile'

type CheckoutContentProps = {
  userId: string
  me: User
  wallets: Wallet[]
  cart: Cart
  step: number
}

export function CheckoutContent({ userId, me, wallets, cart, step }: CheckoutContentProps) {
  const checkout = useCheckoutController(userId, me, wallets, cart)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  return isDesktop ? (
    <CheckoutDesktop checkout={checkout} />
  ) : (
    <CheckoutMobile checkout={checkout} step={step} />
  )
}
