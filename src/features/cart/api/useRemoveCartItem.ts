import { removeCartItem } from './cart.api'
import { useCartMutation } from './useCartMutation'

export function useRemoveCartItem() {
  return useCartMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    errorMessage: 'Não foi possível remover o item.',
  })
}
