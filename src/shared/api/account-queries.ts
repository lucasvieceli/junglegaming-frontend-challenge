import { queryOptions } from '@tanstack/react-query'

import { UserSchema } from '@/shared/contracts/auth'
import { WalletsResponseSchema } from '@/shared/contracts/wallet'

import { http } from './http-client'
import { queryKeys } from './query-keys'

export function meQuery(userId: string) {
  return queryOptions({
    queryKey: queryKeys.me(userId),
    queryFn: async ({ signal }) => UserSchema.parse((await http.get('/me', { signal })).data),
  })
}

export function walletsQuery(userId: string) {
  return queryOptions({
    queryKey: queryKeys.wallets(userId),
    queryFn: async ({ signal }) =>
      WalletsResponseSchema.parse((await http.get('/wallets', { signal })).data).items,
  })
}
