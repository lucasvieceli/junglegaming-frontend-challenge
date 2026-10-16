import { Link, useRouterState } from '@tanstack/react-router'

import { LogoutIcon } from '@/shared/components/icons/LogoutIcon'
import { cn } from '@/shared/lib/cn'
import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

import { ACCOUNT_NAV_ITEMS } from './account-nav-items'

const itemClass =
  'type-b-15-45 flex w-full items-center px-4 text-left text-accent outline-none hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent'

export function AccountSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const activeIndex = ACCOUNT_NAV_ITEMS.findIndex(
    ({ to }) => to !== undefined && pathname.startsWith(to),
  )
  return (
    <nav
      aria-label="Minha conta"
      className="hidden w-[310px] shrink-0 flex-col bg-surface-card py-2 lg:flex"
    >
      <h2 className="type-b-18-bold p-2.5 text-foreground">Meu perfil</h2>
      <ul className="relative">
        {activeIndex >= 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 h-[45px] w-1.5 bg-primary transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${activeIndex * 100}%)` }}
          />
        )}
        {ACCOUNT_NAV_ITEMS.map(({ label, Icon, iconSize, to }, index) => {
          const active = index === activeIndex
          const content = (
            <>
              <Icon
                aria-hidden="true"
                className={cn(
                  'shrink-0 transition-colors duration-300',
                  iconSize,
                  active ? 'text-primary' : 'text-secondary',
                )}
              />
              {label}
            </>
          )
          return (
            <li key={label}>
              {to ? (
                <Link
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    itemClass,
                    'transition-[gap] duration-300 ease-out',
                    active ? 'gap-4' : 'gap-3',
                  )}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => notifyOutOfScope(label)}
                  className={cn(itemClass, 'cursor-pointer gap-3')}
                >
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <div aria-hidden="true" className="hairline" />
      <button
        type="button"
        onClick={onLogout}
        className="type-b-15-bold-15 flex h-10 cursor-pointer items-center gap-2 px-4 text-accent outline-none hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent"
      >
        <LogoutIcon aria-hidden="true" className="size-5 text-primary" />
        Sair
      </button>
    </nav>
  )
}
