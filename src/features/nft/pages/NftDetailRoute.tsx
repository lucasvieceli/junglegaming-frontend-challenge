import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'

import { nftDetailQuery } from '../api/nft-detail-query'
import { NftDetailPage } from './NftDetailPage'

const routeApi = getRouteApi('/nfts/$nftId')

export function NftDetailRoute() {
  const { nftId } = routeApi.useParams()
  const { data } = useSuspenseQuery(nftDetailQuery(nftId))
  return <NftDetailPage key={data.id} nft={data} />
}
