import { createRootRouteWithContext } from '@tanstack/react-router'

import { RootLayout } from '@/app/layout/RootLayout'
import type { RouterContext } from '@/app/router-context'
import { NotFoundPage } from '@/shared/components/feedback/NotFoundPage'
import { RouteErrorPage } from '@/shared/components/feedback/RouteErrorPage'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { title: 'Kurio — Marketplace de NFTs' },
      {
        name: 'description',
        content: 'Descubra, colecione e compre NFTs de criadores independentes na Kurio.',
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: RouteErrorPage,
})
