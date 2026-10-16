import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { isApiError } from '@/shared/api/api-error'
import { queryKeys } from '@/shared/api/query-keys'

import {
  connectCustomWallet,
  connectWallet,
  disconnectWallet,
  getWalletConnection,
} from '../api/checkout.api'
import {
  walletTargetKey,
  type WalletConnectionState,
  type WalletTarget,
} from '../lib/wallet-choice'

const POLL_MS = 5000
const IDLE: WalletConnectionState = { status: 'idle' }

type KeyedState = { key: string | null; value: WalletConnectionState }

export function useWalletConnection(userId: string, currentKey: string | null) {
  const queryClient = useQueryClient()
  const [stored, setStored] = useState<KeyedState>({ key: null, value: IDLE })
  const state = stored.key !== null && stored.key === currentKey ? stored.value : IDLE

  const connect = useMutation({
    mutationFn: ({ choice, network, custom }: WalletTarget) =>
      custom ? connectCustomWallet({ ...custom, network }) : connectWallet(choice, network),
    onMutate: (target) =>
      setStored({ key: walletTargetKey(target), value: { status: 'connecting' } }),
    onSuccess: (result, target) => {
      // Drop the cached status so a stale "disconnected" doesn't apply to the new connection.
      queryClient.removeQueries({ queryKey: queryKeys.walletConnection(userId, result.walletId) })
      setStored((current) =>
        current.key === walletTargetKey(target)
          ? {
              key: current.key,
              value: { status: 'connected', walletId: result.walletId, address: result.address },
            }
          : current,
      )
    },
    onError: (error, target) =>
      setStored((current) =>
        current.key === walletTargetKey(target)
          ? {
              key: current.key,
              value: {
                status: 'rejected',
                message:
                  isApiError(error) && error.code === 'WALLET_CONNECTION_REJECTED'
                    ? 'Conexão recusada'
                    : 'Falha ao conectar',
              },
            }
          : current,
      ),
  })

  const connectedId = state.status === 'connected' ? state.walletId : null
  const connection = useQuery({
    queryKey: connectedId ? queryKeys.walletConnection(userId, connectedId) : ['wallets', 'none'],
    queryFn: ({ signal }) => getWalletConnection(connectedId as string, signal),
    enabled: connectedId !== null,
    refetchInterval: (query) =>
      query.state.data?.status === 'connected' || !query.state.data ? POLL_MS : false,
    gcTime: 0,
  })
  const lostConnection =
    connectedId !== null && connection.data !== undefined && connection.data.status !== 'connected'
  const effective: WalletConnectionState = lostConnection ? { status: 'disconnected' } : state

  const markDisconnected = () => setStored({ key: currentKey, value: { status: 'disconnected' } })

  const disconnect = async () => {
    if (connectedId) await disconnectWallet(connectedId).catch(() => undefined)
    markDisconnected()
  }

  return {
    state: effective,
    connect: (target: WalletTarget) => connect.mutate(target),
    disconnect,
    markDisconnected,
  }
}
