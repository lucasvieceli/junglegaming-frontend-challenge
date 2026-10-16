import { Link } from '@tanstack/react-router'

import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

import type { FooterLink } from './footer-content'

const linkClass =
  'type-b-14-30 cursor-pointer text-left text-foreground hover:text-accent focus-visible:text-accent outline-none'

export function FooterLinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <h2 className="type-b-18-bold text-foreground">{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? (
              <Link
                to={link.to}
                search={link.category ? { categories: [link.category] } : undefined}
                hash={link.category ? 'catalog' : undefined}
                className={linkClass}
              >
                {link.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => notifyOutOfScope(link.label)}
                className={linkClass}
              >
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
