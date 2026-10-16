import type { Cart, CartItem } from '@/shared/contracts/cart'

export function itemNotice(item: CartItem): string | null {
  switch (item.status) {
    case 'price_changed':
      return 'Preço atualizado'
    case 'quantity_reduced':
      return `Disponibilidade reduzida: máximo ${item.maxQuantity}`
    case 'unavailable':
      return 'Indisponível — remova para continuar'
    default:
      return null
  }
}

export function hasUnavailableItems(cart: Cart): boolean {
  return cart.items.some((item) => item.status === 'unavailable')
}

export function itemCount(cart: Cart | undefined): number {
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
}
