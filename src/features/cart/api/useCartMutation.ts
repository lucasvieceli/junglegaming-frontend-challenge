import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/shared/lib/toast'

import { queryKeys } from '@/shared/api/query-keys'
import type { Cart } from '@/shared/contracts/cart'
import { useOwnerKey } from '@/shared/session/useOwnerKey'

import { cartFromError } from '../lib/cart-from-error'
import { cartErrorMessage } from '../lib/cart-error-message'

type CartMutationOptions<TVariables> = {
  mutationFn: (variables: TVariables) => Promise<Cart>
  errorMessage: string
  silentError?: (error: unknown) => boolean
}

export function useCartMutation<TVariables>({
  mutationFn,
  errorMessage,
  silentError,
}: CartMutationOptions<TVariables>) {
  const queryClient = useQueryClient()
  const ownerKey = useOwnerKey()
  const key = queryKeys.cart(ownerKey)

  return useMutation({
    mutationFn,
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
    onError: (error) => {
      const serverCart = cartFromError(error)
      if (serverCart) queryClient.setQueryData(key, serverCart)
      if (!silentError?.(error)) toast.error(cartErrorMessage(error, errorMessage))
    },
  })
}
