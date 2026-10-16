import type { AddCartItemRequest } from '@/shared/contracts/cart'

import { addCartItem } from './cart.api'
import { useCartMutation } from './useCartMutation'

export function useAddToCart() {
  return useCartMutation({
    mutationFn: (body: AddCartItemRequest) => addCartItem(body),
    errorMessage: 'Não foi possível adicionar ao carrinho.',
  })
}
