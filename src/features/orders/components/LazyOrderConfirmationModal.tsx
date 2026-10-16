import { lazy, Suspense, type ComponentProps } from 'react'

const OrderConfirmationModal = lazy(() =>
  import('./OrderConfirmationModal').then((module) => ({ default: module.OrderConfirmationModal })),
)

export function LazyOrderConfirmationModal(props: ComponentProps<typeof OrderConfirmationModal>) {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationModal {...props} />
    </Suspense>
  )
}
