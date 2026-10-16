import { useNavigate } from '@tanstack/react-router'

import { useNftActions } from '@/shared/components/nft/nft-actions-context'
import type { NftDetail } from '@/shared/contracts/nft'

export function usePurchaseActions(
  nft: NftDetail,
  editionId: string | undefined,
  quantity: number,
) {
  const actions = useNftActions()
  const navigate = useNavigate()
  const canBuy = Boolean(actions && editionId)
  const isAdding = actions?.isAddingToCart(nft.id) ?? false

  const addToCart = async () => {
    if (!actions || !editionId) return false
    return actions.addToCart({ nft, editionId, quantity })
  }

  const buyNow = async () => {
    if (await addToCart()) void navigate({ to: '/cart' })
  }

  const favorite = actions?.isFavorite(nft.id) ?? false
  const toggleFavorite = () => actions?.toggleFavorite(nft)

  return {
    canBuy,
    isAdding,
    addToCart,
    buyNow,
    favorite,
    toggleFavorite,
    hasActions: Boolean(actions),
  }
}
