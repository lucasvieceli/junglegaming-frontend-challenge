import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '@/app/guards'
import { FavoritesRoute } from '@/features/favorites/pages/FavoritesRoute'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/favorites')({
  beforeLoad: requireAuth,
  head: () => pageHead('Lista de interesse'),
  component: FavoritesRoute,
})
