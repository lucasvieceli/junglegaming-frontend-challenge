import { getRouteApi } from '@tanstack/react-router'

import { AuthScreen } from './AuthScreen'

const routeApi = getRouteApi('/register')

export function RegisterRoute() {
  return <AuthScreen mode="register" redirect={routeApi.useSearch().redirect} />
}
