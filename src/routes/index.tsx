import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

import { CATALOG_SEARCH_DEFAULTS, catalogSearchSchema } from '@/features/catalog/lib/catalog-search'
import { HomeRoute } from '@/features/catalog/pages/HomeRoute'

export const Route = createFileRoute('/')({
  validateSearch: catalogSearchSchema,
  search: { middlewares: [stripSearchParams(CATALOG_SEARCH_DEFAULTS)] },
  component: HomeRoute,
})
