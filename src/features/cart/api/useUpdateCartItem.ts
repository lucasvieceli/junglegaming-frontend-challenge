import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/shared/lib/toast'

import { queryKeys } from '@/shared/api/query-keys'
import type { Cart } from '@/shared/contracts/cart'
import { useOwnerKey } from '@/shared/session/useOwnerKey'

import { cartFromError } from '../lib/cart-from-error'
import { cartErrorMessage } from '../lib/cart-error-message'
import { withQuantity } from '../lib/optimistic-quantity'
import { updateCartItem } from './cart.api'

type Variables = { itemId: string; quantity: number }

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  const key = queryKeys.cart(useOwnerKey())

  return useMutation({
    mutationFn: ({ itemId, quantity }: Variables) => updateCartItem(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Cart>(key)
      if (previous) queryClient.setQueryData(key, withQuantity(previous, itemId, quantity))
      return { previous }
    },
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
    onError: (error, _variables, context) => {
      queryClient.setQueryData(key, cartFromError(error) ?? context?.previous)
      toast.error(cartErrorMessage(error, 'Não foi possível alterar a quantidade.'))
    },
  })
}
