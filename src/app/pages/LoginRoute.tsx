import { getRouteApi } from '@tanstack/react-router'

import { AuthScreen } from './AuthScreen'

const routeApi = getRouteApi('/login')

export function LoginRoute() {
  return <AuthScreen mode="login" redirect={routeApi.useSearch().redirect} />
}
