import { createFileRoute } from '@tanstack/react-router'

import { NftDetailSkeleton } from '@/features/nft/components/NftDetailSkeleton'
import { NotFoundNft } from '@/features/nft/components/NotFoundNft'
import { loadNft } from '@/features/nft/lib/load-nft'
import { NftDetailRoute } from '@/features/nft/pages/NftDetailRoute'
import { pageHead } from '@/shared/lib/page-head'

export const Route = createFileRoute('/nfts/$nftId')({
  loader: ({ context, params }) => loadNft(context.queryClient, params.nftId),
  head: ({ loaderData }) =>
    loaderData ? pageHead(loaderData.name, loaderData.about) : pageHead('NFT não encontrado'),
  pendingComponent: NftDetailSkeleton,
  pendingMs: 400,
  notFoundComponent: NotFoundNft,
  component: NftDetailRoute,
})
