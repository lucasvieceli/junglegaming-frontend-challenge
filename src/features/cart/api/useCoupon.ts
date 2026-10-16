import { isApiError } from '@/shared/api/api-error'

import { applyCoupon, removeCoupon } from './cart.api'
import { useCartMutation } from './useCartMutation'

export function useApplyCoupon() {
  return useCartMutation({
    mutationFn: (code: string) => applyCoupon(code),
    errorMessage: 'Não foi possível aplicar o cupom.',
    silentError: (error) => isApiError(error) && error.status === 422,
  })
}

export function useRemoveCoupon() {
  return useCartMutation({
    mutationFn: () => removeCoupon(),
    errorMessage: 'Não foi possível remover o cupom.',
  })
}
