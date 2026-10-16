import { getRouteApi } from '@tanstack/react-router'

import { HomePage } from './HomePage'

const routeApi = getRouteApi('/')

export function HomeRoute() {
  return <HomePage search={routeApi.useSearch()} />
}
