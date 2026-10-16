import { useQueries } from '@tanstack/react-query'

import type { NftSummary } from '@/shared/contracts/nft'

import { nftDetailQuery } from './nft-detail-query'

export function useRelatedNfts(ids: string[]): NftSummary[] | undefined {
  return useQueries({
    queries: ids.map((id) => nftDetailQuery(id)),
    combine: (results) =>
      results.some((result) => result.isPending)
        ? undefined
        : results.flatMap((result) => (result.data ? [result.data] : [])),
  })
}
