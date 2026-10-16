import { useQuery } from '@tanstack/react-query'

import { nftDetailQuery } from './nft-detail-query'

export function useNftDetail(id: string) {
  return useQuery(nftDetailQuery(id))
}
