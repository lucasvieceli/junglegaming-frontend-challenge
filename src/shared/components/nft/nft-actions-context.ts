import { createContext, useContext } from 'react'

import type { NftSummary } from '@/shared/contracts/nft'

export type AddToCartRequest = {
  nft: NftSummary
  editionId?: string
  quantity?: number
}

export type NftActions = {
  addToCart: (request: AddToCartRequest) => Promise<boolean>
  toggleFavorite: (nft: NftSummary) => void
  isFavorite: (nftId: string) => boolean
  isAddingToCart: (nftId: string) => boolean
}

export const NftActionsContext = createContext<NftActions | null>(null)

export function useNftActions(): NftActions | null {
  return useContext(NftActionsContext)
}
