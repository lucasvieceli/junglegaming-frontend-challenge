import { Link } from '@tanstack/react-router'

import { cn } from '@/shared/lib/cn'
import { useSession } from '@/shared/session/useSession'

const STYLES = {
  desktop: 'type-b-15-bold h-10 rounded-xs bg-primary',
  mobile: 'type-b-16-bold h-[60px] rounded-pill bg-gradient-cta',
}

export function CheckoutCta({
  variant,
  blocked,
}: {
  variant: keyof typeof STYLES
  blocked: boolean
}) {
  const authenticated = Boolean(useSession().user)
  const className = cn(
    'flex w-full items-center justify-center text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent',
    STYLES[variant],
  )

  if (blocked) {
    return (
      <button type="button" disabled className={cn(className, 'cursor-not-allowed opacity-50')}>
        Conectar e finalizar
      </button>
    )
  }
  return authenticated ? (
    <Link to="/checkout" className={className}>
      Conectar e finalizar
    </Link>
  ) : (
    <Link to="/login" search={{ redirect: '/checkout' }} className={className}>
      Conectar e finalizar
    </Link>
  )
}
