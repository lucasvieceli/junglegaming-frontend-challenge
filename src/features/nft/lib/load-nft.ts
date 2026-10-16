import type { QueryClient } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'

import { isApiError } from '@/shared/api/api-error'

import { nftDetailQuery } from '../api/nft-detail-query'

export async function loadNft(queryClient: QueryClient, nftId: string) {
  try {
    return await queryClient.ensureQueryData(nftDetailQuery(nftId))
  } catch (error) {
    if (isApiError(error) && error.status === 404) throw notFound()
    throw error
  }
}
