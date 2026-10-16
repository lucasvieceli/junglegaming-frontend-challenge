import { useQuery } from '@tanstack/react-query'

import { cartQuery } from '@/shared/api/cart-query'
import { useOwnerKey } from '@/shared/session/useOwnerKey'
import { useSession } from '@/shared/session/useSession'

export function useCart() {
  const ownerKey = useOwnerKey()
  const booting = useSession().status === 'loading'
  return { ...useQuery({ ...cartQuery(ownerKey), enabled: !booting }), ownerKey }
}
