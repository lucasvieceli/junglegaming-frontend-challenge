import { createFileRoute } from '@tanstack/react-router'

import { redirectIfAuthenticated } from '@/app/guards'
import { LoginRoute } from '@/app/pages/LoginRoute'
import { authSearchSchema } from '@/features/auth/lib/auth-forms'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/login')({
  validateSearch: authSearchSchema,
  beforeLoad: ({ context, search }) => redirectIfAuthenticated({ context, search }),
  head: () => pageHead('Entrar'),
  component: LoginRoute,
})
