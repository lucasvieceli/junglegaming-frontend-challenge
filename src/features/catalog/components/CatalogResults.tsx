import { Link } from '@tanstack/react-router'

import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { NftCard } from '@/shared/components/nft/NftCard'
import { Button } from '@/shared/ui/button'

import type { useNftList } from '../api/useNftList'
import { NftGrid } from './NftGrid'
import { NftGridSkeleton } from './NftGridSkeleton'
import { Pagination } from './Pagination'

type CatalogResultsProps = {
  query: ReturnType<typeof useNftList>
  page: number
  onClearFilters: () => void
}

export function CatalogResults({ query, page, onClearFilters }: CatalogResultsProps) {
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = query

  if (isPending) return <NftGridSkeleton />
  if (isError && !data) {
    return (
      <ErrorState
        title="Não foi possível carregar os NFTs"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    )
  }
  if (data.items.length === 0 && data.totalPages > 0 && page > data.totalPages) {
    return (
      <EmptyState
        title="Esta página não existe"
        description={`O catálogo tem ${data.totalPages} páginas com estes filtros.`}
        action={
          <Button asChild className="type-b-16-bold-20">
            <Link to="/" search={(prev) => ({ ...prev, page: data.totalPages })} hash="catalog">
              Ir para a última página
            </Link>
          </Button>
        }
      />
    )
  }
  if (data.items.length === 0) {
    return (
      <EmptyState
        title="Nenhum NFT encontrado"
        description="Tente outros termos ou remova alguns filtros."
        action={
          <Button className="type-b-16-bold-20" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-[88px]">
      <p className="sr-only" role="status">
        {isPlaceholderData ? 'Atualizando resultados…' : `${data.total} NFTs encontrados`}
      </p>
      <NftGrid busy={isPlaceholderData}>
        {data.items.map((nft, index) => (
          <li key={nft.id}>
            <NftCard nft={nft} priority={index < 3} staggered={index % 2 === 1} />
          </li>
        ))}
      </NftGrid>
      <Pagination page={data.page} totalPages={data.totalPages} />
    </div>
  )
}
