import { Link } from '@tanstack/react-router'

import { cn } from '@/shared/lib/cn'

type AuthMode = 'login' | 'register'

const tabClass = (active: boolean) =>
  cn(
    'type-t-20-medium flex items-center outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent',
    active ? 'text-accent' : 'text-foreground',
  )

export function AuthTabs({ mode, redirect }: { mode: AuthMode; redirect?: string }) {
  return (
    <nav aria-label="Acesso à conta" className="flex h-5 items-stretch gap-2">
      <Link
        to="/login"
        search={{ redirect }}
        replace
        aria-current={mode === 'login' ? 'page' : undefined}
        className={tabClass(mode === 'login')}
      >
        Entrar
      </Link>
      <span aria-hidden="true" className="w-px bg-coral" />
      <Link
        to="/register"
        search={{ redirect }}
        replace
        aria-current={mode === 'register' ? 'page' : undefined}
        className={tabClass(mode === 'register')}
      >
        Criar conta
      </Link>
    </nav>
  )
}
