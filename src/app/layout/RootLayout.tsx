import { HeadContent, Outlet } from '@tanstack/react-router'

import { OfflineBanner } from '@/shared/components/feedback/OfflineBanner'

import { RealtimeProvider } from '@/features/realtime/components/RealtimeProvider'

import { NftActionsProvider } from '../providers/NftActionsProvider'

import { AppShell } from './AppShell'
import { SessionExpiryHandler } from './SessionExpiryHandler'

export function RootLayout() {
  return (
    <>
      <HeadContent />
      <OfflineBanner />
      <SessionExpiryHandler />
      <RealtimeProvider>
        <NftActionsProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </NftActionsProvider>
      </RealtimeProvider>
    </>
  )
}
