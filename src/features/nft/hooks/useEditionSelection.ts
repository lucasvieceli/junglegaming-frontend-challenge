import { useState } from 'react'

import type { NftDetail } from '@/shared/contracts/nft'

import { defaultEdition, isSoldOut, maxQuantityOf } from '../lib/editions'

export function useEditionSelection(nft: NftDetail) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => defaultEdition(nft.editions)?.id,
  )
  const [quantity, setQuantity] = useState(1)

  const chosen = nft.editions.find((edition) => edition.id === selectedId)
  const edition = chosen && !isSoldOut(chosen) ? chosen : defaultEdition(nft.editions)
  const maxQuantity = edition ? maxQuantityOf(edition) : 0
  const safeQuantity = Math.min(Math.max(quantity, 1), Math.max(maxQuantity, 1))

  const selectEdition = (id: string) => {
    setSelectedId(id)
    setQuantity(1)
  }

  return {
    edition,
    allSoldOut: edition === undefined,
    maxQuantity,
    quantity: safeQuantity,
    setQuantity,
    selectEdition,
  }
}
