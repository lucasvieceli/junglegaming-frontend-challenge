import { Link } from '@tanstack/react-router'

import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { CartIcon } from '@/shared/components/icons/CartIcon'
import { Button } from '@/shared/ui/button'

export function EmptyCart() {
  return (
    <EmptyState
      icon={<CartIcon />}
      title="Seu carrinho está vazio"
      description="Explore o mercado e adicione NFTs para continuar."
      className="min-h-[40vh]"
      action={
        <Button asChild className="type-b-16-bold-20">
          <Link to="/">Explorar NFTs</Link>
        </Button>
      }
    />
  )
}
