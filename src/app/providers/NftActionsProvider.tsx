import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useMemo, useState, type ReactNode } from 'react'
import { toast } from '@/shared/lib/toast'

import { useAddToCart } from '@/features/cart/api/useAddToCart'
import { useFavorites } from '@/features/favorites/api/useFavorites'
import { useToggleFavorite } from '@/features/favorites/api/useToggleFavorite'
import { nftDetailQuery } from '@/features/nft/api/nft-detail-query'
import { defaultEdition } from '@/features/nft/lib/editions'
import {
  NftActionsContext,
  type AddToCartRequest,
  type NftActions,
} from '@/shared/components/nft/nft-actions-context'
import { useSession } from '@/shared/session/useSession'

export function NftActionsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const userId = useSession().user?.id ?? null
  const favorites = useFavorites(userId)
  const toggle = useToggleFavorite(userId ?? 'guest')
  const addToCart = useAddToCart()
  const [adding, setAdding] = useState<string | null>(null)

  const value = useMemo<NftActions>(() => {
    const favoriteIds = new Set(favorites.data?.items.map((item) => item.id))

    const add = async ({ nft, editionId, quantity = 1 }: AddToCartRequest) => {
      setAdding(nft.id)
      try {
        const edition =
          editionId ??
          defaultEdition((await queryClient.fetchQuery(nftDetailQuery(nft.id))).editions)?.id
        if (!edition) {
          toast.error(`${nft.name} está esgotado.`)
          return false
        }
        await addToCart.mutateAsync({ nftId: nft.id, editionId: edition, quantity })
        toast.success(`${nft.name} adicionado ao carrinho.`, {
          action: { label: 'Ver carrinho', onClick: () => void router.navigate({ to: '/cart' }) },
        })
        return true
      } catch {
        return false
      } finally {
        setAdding(null)
      }
    }

    return {
      addToCart: add,
      toggleFavorite: (nft) => {
        if (!userId) {
          void router.navigate({ to: '/login', search: { redirect: router.state.location.href } })
          return
        }
        toggle.mutate({ nft, next: !favoriteIds.has(nft.id) })
      },
      isFavorite: (nftId) => favoriteIds.has(nftId),
      isAddingToCart: (nftId) => adding === nftId,
    }
  }, [favorites.data, userId, toggle, addToCart, adding, queryClient, router])

  return <NftActionsContext.Provider value={value}>{children}</NftActionsContext.Provider>
}
