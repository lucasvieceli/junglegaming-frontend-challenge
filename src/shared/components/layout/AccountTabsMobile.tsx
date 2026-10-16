import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '@/shared/lib/cn'

import { ACCOUNT_NAV_ITEMS } from './account-nav-items'

export function AccountTabsMobile({ onLogout }: { onLogout: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const tabs = ACCOUNT_NAV_ITEMS.flatMap(({ label, to }) => (to ? [{ label, to }] : []))
  return (
    <nav
      aria-label="Minha conta"
      className="-mx-6 flex items-center gap-4 overflow-x-auto px-6 lg:hidden"
    >
      {tabs.map(({ label, to }) => {
        const active = pathname.startsWith(to)
        return (
          <Link
            key={label}
            to={to}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'type-b-14 shrink-0 border-b-2 pb-1 whitespace-nowrap',
              active
                ? 'border-primary font-bold text-accent'
                : 'border-transparent text-foreground',
            )}
          >
            {label}
          </Link>
        )
      })}
      <button
        type="button"
        onClick={onLogout}
        className="type-b-14-bold ml-auto shrink-0 cursor-pointer pb-1 text-accent"
      >
        Sair
      </button>
    </nav>
  )
}
