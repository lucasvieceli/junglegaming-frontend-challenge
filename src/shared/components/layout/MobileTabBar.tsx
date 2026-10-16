import { Link, useRouterState } from '@tanstack/react-router'

import { ScanIcon } from '@/shared/components/icons/ScanIcon'
import { cn } from '@/shared/lib/cn'

import { TAB_BAR_ITEMS } from './tab-bar-items'
import { TabBarShape } from './TabBarShape'

export function MobileTabBar({ cartCount, onSearch }: { cartCount: number; onSearch: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed inset-x-0 bottom-0 z-40 h-[126px] pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <TabBarShape />
      <button
        type="button"
        onClick={onSearch}
        aria-label="Buscar NFTs"
        className="absolute top-0 left-1/2 flex size-[65px] -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(180deg,rgba(210,138,76,0.4)_-17%,#d28a4c_109%)] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ScanIcon />
      </button>
      <ul>
        {TAB_BAR_ITEMS.map(({ to, label, Icon, left, isActive }) => {
          const active = isActive(pathname)
          const name = to === '/cart' && cartCount > 0 ? `${label}, ${cartCount} itens` : label
          return (
            <li key={to} className="absolute top-[61px] -ml-2.5" style={{ left }}>
              <Link
                to={to}
                aria-label={name}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex size-10 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  active ? 'text-accent' : 'text-text-secondary',
                )}
              >
                <Icon className="size-5" />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
