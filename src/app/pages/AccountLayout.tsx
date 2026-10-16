import { Outlet, useRouterState } from '@tanstack/react-router'

import { useLogout } from '@/features/auth/hooks/useLogout'
import { AccountSidebar } from '@/shared/components/layout/AccountSidebar'
import { AccountTabsMobile } from '@/shared/components/layout/AccountTabsMobile'
import { MobileScreenHeader } from '@/shared/components/layout/MobileScreenHeader'

import { RouteTransition } from '../layout/RouteTransition'

const MOBILE_TITLES: Record<string, string> = {
  '/account/profile': 'Meu perfil',
  '/account/wallets': 'Carteiras',
}

export function AccountLayout() {
  const logout = useLogout()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-7 lg:pt-8">
      <MobileScreenHeader title={MOBILE_TITLES[pathname] ?? 'Minha conta'} />
      <AccountTabsMobile onLogout={() => void logout()} />
      <AccountSidebar onLogout={() => void logout()} />
      <div className="min-w-0 flex-1">
        <RouteTransition depth={2}>
          <Outlet />
        </RouteTransition>
      </div>
    </div>
  )
}
