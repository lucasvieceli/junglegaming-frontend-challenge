import type { NftSummary } from '@/shared/contracts/nft'

import { CardIconButton } from './CardIconButton'
import { FavoriteIcon } from './FavoriteIcon'
import { useNftActions } from './nft-actions-context'

export function MobileFavoriteButton({ nft }: { nft: NftSummary }) {
  const actions = useNftActions()
  const favorite = actions?.isFavorite(nft.id) ?? false
  return (
    <CardIconButton
      className="absolute top-3 right-[11px] z-10 size-7 rounded-full lg:hidden"
      aria-label={favorite ? `Remover ${nft.name} dos favoritos` : `Favoritar ${nft.name}`}
      aria-pressed={favorite}
      disabled={!actions}
      onClick={() => actions?.toggleFavorite(nft)}
    >
      <FavoriteIcon active={favorite} className="h-[13px] w-[14px]" />
    </CardIconButton>
  )
}
