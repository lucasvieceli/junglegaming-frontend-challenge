import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/account/profile')({
  head: () => pageHead('Perfil do colecionador'),
  component: ProfilePage,
})
