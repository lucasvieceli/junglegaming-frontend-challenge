import { Link } from '@tanstack/react-router'

import { CartIcon } from '@/shared/components/icons/CartIcon'
import { Badge } from '@/shared/ui/badge'

export function CartLink({ count }: { count: number }) {
  const label = count === 1 ? 'Carrinho, 1 item' : `Carrinho, ${count} itens`
  return (
    <Link
      to="/cart"
      aria-label={label}
      className="relative flex size-6 items-center justify-center text-foreground outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
    >
      <CartIcon />
      {count > 0 && (
        <Badge
          variant="count"
          aria-hidden="true"
          className="absolute top-[-2px] left-[13px] size-5"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Link>
  )
}
