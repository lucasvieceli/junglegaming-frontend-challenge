import { getRouteApi } from '@tanstack/react-router'

import { WalletsPage } from './WalletsPage'

const routeApi = getRouteApi('/account/wallets')

export function WalletsRoute() {
  return <WalletsPage redirect={routeApi.useSearch().redirect} />
}
