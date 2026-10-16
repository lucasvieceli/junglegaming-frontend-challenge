import { getRouteApi } from '@tanstack/react-router'

import { useSession } from '@/shared/session/useSession'

import { CheckoutPage } from './CheckoutPage'

const routeApi = getRouteApi('/checkout')

export function CheckoutRoute() {
  const userId = useSession().user?.id
  const { step } = routeApi.useSearch()
  return userId ? <CheckoutPage key={userId} userId={userId} step={step} /> : null
}
