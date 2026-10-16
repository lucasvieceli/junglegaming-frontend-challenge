import { useRouterState } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'

import { LazySearchDialog } from '@/features/catalog/components/LazySearchDialog'
import { RealtimeIndicator } from '@/features/realtime/components/RealtimeIndicator'

import { MobileTabBar } from '@/shared/components/layout/MobileTabBar'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { SiteFooter } from '@/shared/components/layout/footer/SiteFooter'
import { SiteHeader } from '@/shared/components/layout/SiteHeader'
import { showsTabBar } from '@/shared/components/layout/tab-bar-items'
import { cn } from '@/shared/lib/cn'

import { AppToaster } from './AppToaster'
import { RouteProgressBar } from './RouteProgressBar'
import { RouteTransition } from './RouteTransition'
import {
  headerHasDivider,
  hidesFooter,
  hidesFooterOnMobile,
  mobileBottomInset,
} from './shell-rules'
import { SkipLink } from './SkipLink'
import { useFirstScreenSignal } from './useFirstScreenSignal'
import { useShellData } from './useShellData'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { cartCount, userName } = useShellData()
  const [search, setSearch] = useState<'closed' | 'search' | 'filters'>('closed')
  const withTabBar = showsTabBar(pathname)
  useFirstScreenSignal()

  return (
    <>
      <SkipLink />
      <RouteProgressBar />
      <PageContainer
        className={cn('flex min-h-dvh flex-col pt-6', mobileBottomInset(pathname, withTabBar))}
      >
        <SiteHeader
          cartCount={cartCount}
          userName={userName}
          onSearch={() => setSearch('search')}
          withDivider={headerHasDivider(pathname)}
        />
        <RealtimeIndicator />
        <main
          id="content"
          tabIndex={-1}
          className="flex min-h-[calc(100dvh-3rem)] flex-1 flex-col outline-none lg:min-h-[calc(100dvh-7.5rem)]"
        >
          <RouteTransition depth={1}>{children}</RouteTransition>
        </main>
        {!hidesFooter(pathname) && (
          <div className={cn('mt-10 lg:mt-24', hidesFooterOnMobile(pathname) && 'max-lg:hidden')}>
            <SiteFooter />
          </div>
        )}
      </PageContainer>
      {withTabBar && <MobileTabBar cartCount={cartCount} onSearch={() => setSearch('filters')} />}
      <LazySearchDialog
        open={search !== 'closed'}
        withFilters={search === 'filters'}
        onOpenChange={(open) => setSearch(open ? search : 'closed')}
      />
      <AppToaster />
    </>
  )
}
