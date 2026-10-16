import { AuthDialog } from '@/features/auth/components/AuthDialog'
import { AuthPageMobile } from '@/features/auth/components/AuthPageMobile'
import type { AuthMode } from '@/features/auth/lib/auth-copy'
import { DEFAULT_CATALOG_SEARCH } from '@/features/catalog/lib/catalog-search'
import { HomePage } from '@/features/catalog/pages/HomePage'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { DESKTOP_QUERY } from '@/shared/lib/breakpoints'

export function AuthScreen({ mode, redirect }: { mode: AuthMode; redirect?: string }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  if (!isDesktop) return <AuthPageMobile mode={mode} redirect={redirect} />
  return (
    <>
      <div inert>
        <HomePage search={DEFAULT_CATALOG_SEARCH} />
      </div>
      <AuthDialog mode={mode} redirect={redirect} />
    </>
  )
}
