import { CartIcon } from '@/shared/components/icons/CartIcon'
import { SearchIcon } from '@/shared/components/icons/SearchIcon'
import type { NftSummary } from '@/shared/contracts/nft'

import { CardIconButton } from './CardIconButton'
import { FavoriteIcon } from './FavoriteIcon'
import { useNftActions } from './nft-actions-context'

export function NftCardActionBar({ nft, onZoom }: { nft: NftSummary; onZoom: () => void }) {
  const actions = useNftActions()
  const favorite = actions?.isFavorite(nft.id) ?? false
  const soldOut = nft.availability === 'sold_out'

  return (
    <div className="absolute inset-x-0 bottom-9 z-10 hidden justify-center gap-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 lg:flex">
      <CardIconButton
        className="size-8 rounded-sm"
        aria-label={soldOut ? `${nft.name} esgotado` : `Adicionar ${nft.name} ao carrinho`}
        disabled={!actions || soldOut || actions.isAddingToCart(nft.id)}
        onClick={() => void actions?.addToCart({ nft })}
      >
        <CartIcon className="size-[18px]" />
      </CardIconButton>
      <CardIconButton
        className="size-8 rounded-sm"
        aria-label={favorite ? `Remover ${nft.name} dos favoritos` : `Favoritar ${nft.name}`}
        aria-pressed={favorite}
        disabled={!actions}
        onClick={() => actions?.toggleFavorite(nft)}
      >
        <FavoriteIcon active={favorite} className="size-[18px]" />
      </CardIconButton>
      <CardIconButton
        className="size-8 rounded-sm"
        aria-label={`Ampliar ${nft.name}`}
        onClick={onZoom}
      >
        <SearchIcon className="size-[18px]" />
      </CardIconButton>
    </div>
  )
}
