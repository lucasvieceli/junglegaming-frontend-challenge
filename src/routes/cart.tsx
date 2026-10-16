import { createFileRoute } from '@tanstack/react-router'

import { CartPage } from '@/features/cart/pages/CartPage'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/cart')({
  head: () => pageHead('Carrinho de NFTs'),
  component: CartPage,
})
