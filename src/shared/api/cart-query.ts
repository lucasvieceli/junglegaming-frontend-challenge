import { queryOptions } from '@tanstack/react-query'

import { CartSchema } from '@/shared/contracts/cart'

import { http } from './http-client'
import { queryKeys } from './query-keys'

export function cartQuery(ownerKey: string) {
  return queryOptions({
    queryKey: queryKeys.cart(ownerKey),
    queryFn: async ({ signal }) => CartSchema.parse((await http.get('/cart', { signal })).data),
    staleTime: 0,
  })
}
