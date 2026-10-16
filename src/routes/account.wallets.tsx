import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { WalletsRoute } from '@/features/wallets/pages/WalletsRoute'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/account/wallets')({
  validateSearch: z.object({ redirect: z.string().optional().catch(undefined) }),
  head: () => pageHead('Carteiras'),
  component: WalletsRoute,
})
