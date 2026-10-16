import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from '@/shared/lib/toast'

import { isApiError } from '@/shared/api/api-error'
import { applyApiFieldErrors } from '@/shared/api/field-errors'
import { queryKeys } from '@/shared/api/query-keys'
import type { SaveWalletRequest, Wallet } from '@/shared/contracts/wallet'

import { createWallet, updateWallet } from '../api/wallets.api'
import type { WalletFormValues } from '../lib/wallet-form'

export function useSaveWallet(
  userId: string,
  form: UseFormReturn<WalletFormValues>,
  existing: Wallet | undefined,
  onSaved: () => void,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: SaveWalletRequest) => {
      if (existing) return updateWallet(existing.id, body)
      try {
        return await createWallet(body)
      } catch (error) {
        const current = queryClient
          .getQueryData<Wallet[]>(queryKeys.wallets(userId))
          ?.find((wallet) => wallet.kind === body.kind)
        if (isApiError(error) && error.code === 'WALLET_KIND_EXISTS' && current)
          return updateWallet(current.id, body)
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.wallets(userId) })
      toast.success('Carteira salva.')
      onSaved()
    },
    onError: (error) => {
      if (!applyApiFieldErrors(error, form.setError))
        toast.error(isApiError(error) ? error.message : 'Não foi possível salvar a carteira.')
    },
  })
}
