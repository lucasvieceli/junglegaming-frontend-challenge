import { Link } from '@tanstack/react-router'

import { isForbidden } from '@/shared/api/api-error'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { HeartIcon } from '@/shared/components/icons/HeartIcon'
import { NftCard } from '@/shared/components/nft/NftCard'
import { NftCardSkeleton } from '@/shared/components/nft/NftCardSkeleton'
import { Button } from '@/shared/ui/button'

import { useFavorites } from '../api/useFavorites'
import { FavoritesGrid } from '../components/FavoritesGrid'

export function FavoritesPage({ userId }: { userId: string }) {
  const favorites = useFavorites(userId)

  return (
    <div className="flex flex-col gap-8 pt-4 lg:pt-8">
      <div className="flex flex-col gap-3">
        <h1 className="type-b-17-bold text-accent">Lista de interesse</h1>
        <div aria-hidden="true" className="hairline" />
      </div>
      {favorites.isPending && (
        <FavoritesGrid>
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index}>
              <NftCardSkeleton />
            </li>
          ))}
        </FavoritesGrid>
      )}
      {favorites.isError &&
        (isForbidden(favorites.error) ? (
          <ErrorState
            title="Acesso não autorizado"
            message="Você não tem permissão para ver esta lista."
          />
        ) : (
          <ErrorState onRetry={() => void favorites.refetch()} isRetrying={favorites.isFetching} />
        ))}
      {favorites.data?.items.length === 0 && (
        <EmptyState
          icon={<HeartIcon />}
          title="Nenhum favorito ainda"
          description="Toque no coração de um NFT para guardá-lo aqui."
          action={
            <Button asChild className="type-b-16-bold-20">
              <Link to="/">Explorar NFTs</Link>
            </Button>
          }
        />
      )}
      {favorites.data && favorites.data.items.length > 0 && (
        <FavoritesGrid>
          {favorites.data.items.map((nft) => (
            <li key={nft.id}>
              <NftCard nft={nft} />
            </li>
          ))}
        </FavoritesGrid>
      )}
    </div>
  )
}
