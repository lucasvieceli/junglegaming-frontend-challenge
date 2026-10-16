import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '@/app/guards'
import { AccountLayout } from '@/app/pages/AccountLayout'

export const Route = createFileRoute('/account')({
  beforeLoad: requireAuth,
  component: AccountLayout,
})
