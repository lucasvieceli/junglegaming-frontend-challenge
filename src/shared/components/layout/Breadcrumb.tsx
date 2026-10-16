import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'

export type BreadcrumbItem = { label: string; to?: string; hash?: string }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="hidden lg:block">
      <ol className="type-b-15-bold flex flex-wrap items-center text-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={item.label}>
              <li>
                {isLast || !item.to ? (
                  <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
                ) : (
                  <Link
                    to={item.to}
                    hash={item.hash}
                    className="hover:text-accent focus-visible:text-accent"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="whitespace-pre">
                  {' / '}
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
