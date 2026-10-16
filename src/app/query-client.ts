import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { isClientError } from '@/shared/api/api-error'
import { reportRequestError, reportRequestSuccess } from '@/shared/lib/network-status'

export function createQueryClient(): QueryClient {
  const reporters = { onError: reportRequestError, onSuccess: reportRequestSuccess }
  return new QueryClient({
    queryCache: new QueryCache(reporters),
    mutationCache: new MutationCache(reporters),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: { retry: 0 },
    },
  })
}
