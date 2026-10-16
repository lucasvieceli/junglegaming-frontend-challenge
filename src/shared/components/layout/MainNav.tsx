import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '@/shared/lib/cn'
import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

import { NAV_ITEMS, activeNavKey } from './nav-items'

const itemBase =
  'flex flex-col gap-[21px] outline-none focus-visible:ring-2 focus-visible:ring-accent'

export function MainNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const active = activeNavKey(pathname)

  return (
    <nav aria-label="Principal">
      <ul className="flex items-start gap-10">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active
          const label = (
            <>
              <span
                className={cn(
                  'type-b-16-normal',
                  isActive ? 'font-bold text-accent' : 'text-foreground hover:text-accent',
                )}
              >
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className={cn('h-[3px] w-full', isActive ? 'bg-primary' : 'bg-transparent')}
              />
            </>
          )
          return (
            <li key={item.key}>
              {item.to ? (
                <Link
                  to={item.to}
                  hash={item.hash}
                  aria-current={isActive ? 'page' : undefined}
                  className={itemBase}
                >
                  {label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => notifyOutOfScope(item.label)}
                  className={cn(itemBase, 'cursor-pointer')}
                >
                  {label}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
