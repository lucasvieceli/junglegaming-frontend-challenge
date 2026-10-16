import { useSession } from '@/shared/session/useSession'

import { FavoritesPage } from './FavoritesPage'

export function FavoritesRoute() {
  const userId = useSession().user?.id
  return userId ? <FavoritesPage key={userId} userId={userId} /> : null
}
