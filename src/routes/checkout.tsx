import { createFileRoute } from '@tanstack/react-router'

import { requireCheckoutReady } from '@/app/guards'
import { checkoutSearchSchema } from '@/features/checkout/lib/checkout-steps'
import { CheckoutRoute } from '@/features/checkout/pages/CheckoutRoute'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/checkout')({
  validateSearch: checkoutSearchSchema,
  beforeLoad: requireCheckoutReady,
  head: () => pageHead('Pagamento'),
  component: CheckoutRoute,
})
