import { useCanGoBack, useRouter } from '@tanstack/react-router'

import { CurvedChevronIcon } from '@/shared/components/icons/CurvedChevronIcon'
import { NftImage } from '@/shared/components/media/NftImage'
import { CardIconButton } from '@/shared/components/nft/CardIconButton'
import { FavoriteIcon } from '@/shared/components/nft/FavoriteIcon'
import type { NftDetail } from '@/shared/contracts/nft'
import { artworkTargetProps } from '@/shared/lib/artwork-transition'

import { usePurchaseActions } from '../hooks/usePurchaseActions'

export function NftHeroMobile({ nft }: { nft: NftDetail }) {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const { favorite, toggleFavorite, hasActions } = usePurchaseActions(nft, undefined, 1)

  return (
    <div className="-mx-6 -mt-6 overflow-hidden bg-gradient-hero-mobile pt-[23px] pr-[25px] pl-7 max-md:h-[506px] md:pb-[130px] lg:hidden">
      <div className="mx-auto flex max-w-[480px] flex-col items-center gap-2">
        <div className="flex w-full items-center justify-between">
          <CardIconButton
            className="size-[35px] rounded-full text-text-secondary"
            aria-label="Voltar"
            onClick={() => (canGoBack ? router.history.back() : void router.navigate({ to: '/' }))}
          >
            <CurvedChevronIcon className="rotate-90" />
          </CardIconButton>
          <CardIconButton
            className="size-[35px] rounded-full text-accent"
            aria-label={favorite ? `Remover ${nft.name} dos favoritos` : `Favoritar ${nft.name}`}
            aria-pressed={favorite}
            disabled={!hasActions}
            onClick={toggleFavorite}
          >
            <FavoriteIcon active={favorite} className="h-[14.2px] w-4" />
          </CardIconButton>
        </div>
        <div
          {...artworkTargetProps}
          className="relative aspect-[361/356] w-full overflow-hidden rounded-[24px]"
        >
          <NftImage
            imageKey={nft.imageKey}
            alt={nft.name}
            sizes="(min-width: 480px) 480px, 92vw"
            width={361}
            height={356}
            priority
          />
          <img
            src="/images/decor/gallery-dots.svg"
            alt=""
            aria-hidden="true"
            width={56}
            height={7}
            className="absolute bottom-[50px] left-[calc(50%-29.5px)] h-[7px] w-14"
          />
        </div>
      </div>
    </div>
  )
}
