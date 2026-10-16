import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type { Wallet, WalletKind } from '@/shared/contracts/wallet'
import { Button } from '@/shared/ui/button'

import { useSaveWallet } from '../hooks/useSaveWallet'
import {
  formToRequest,
  walletFormSchema,
  walletToForm,
  type WalletFormValues,
} from '../lib/wallet-form'
import { WalletFields } from './WalletFields'

type WalletFormProps = {
  userId: string
  kind: WalletKind
  existing: Wallet | undefined
  copyFrom?: Wallet
  onSaved: () => void
}

export function WalletForm({ userId, kind, existing, copyFrom, onSaved }: WalletFormProps) {
  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: walletToForm(copyFrom ?? existing),
  })
  const save = useSaveWallet(userId, form, existing, onSaved)

  useEffect(() => {
    if (copyFrom)
      form.reset({
        ...walletToForm(copyFrom),
        alias: existing?.alias ?? `${copyFrom.alias} (cópia)`,
      })
  }, [copyFrom, existing, form])

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        save.mutate(formToRequest(values, kind, Boolean(copyFrom))),
      )}
      className="flex flex-col gap-8"
    >
      <WalletFields form={form} readOnly={Boolean(copyFrom)} />
      <Button
        type="submit"
        size="none"
        radius="xs"
        className="type-b-14-bold h-10 w-full px-3 whitespace-nowrap lg:w-[131px] lg:self-start lg:px-0"
        disabled={save.isPending}
        aria-busy={save.isPending}
      >
        {save.isPending ? 'Salvando…' : 'Salvar carteira'}
      </Button>
    </form>
  )
}
