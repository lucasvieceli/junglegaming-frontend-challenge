import { createFileRoute } from '@tanstack/react-router'

import { redirectIfAuthenticated } from '@/app/guards'
import { RegisterRoute } from '@/app/pages/RegisterRoute'
import { authSearchSchema } from '@/features/auth/lib/auth-forms'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/register')({
  validateSearch: authSearchSchema,
  beforeLoad: ({ context, search }) => redirectIfAuthenticated({ context, search }),
  head: () => pageHead('Criar conta'),
  component: RegisterRoute,
})
