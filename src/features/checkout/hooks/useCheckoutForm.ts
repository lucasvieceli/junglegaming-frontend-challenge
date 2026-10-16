import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { User } from '@/shared/contracts/auth'
import type { Wallet } from '@/shared/contracts/wallet'

import { checkoutStorage } from '../lib/checkout-storage'
import { collectorFormSchema, type CollectorFormValues } from '../lib/collector-form'
import { formDefaults, walletFields } from '../lib/form-defaults'
import { CUSTOM_WALLET } from '../lib/wallet-choice'

const DRAFT_DEBOUNCE_MS = 300

export function useCheckoutForm(userId: string, me: User, wallets: Wallet[]) {
  const [draft] = useState(() => checkoutStorage.loadDraft(userId))
  const primary = wallets.find((wallet) => wallet.kind === 'primary') ?? wallets[0]
  const [choice, setChoice] = useState<string>(
    () => draft?.walletChoice ?? primary?.id ?? CUSTOM_WALLET,
  )
  const chosenWallet = wallets.find((wallet) => wallet.id === choice)

  const form = useForm<CollectorFormValues>({
    resolver: zodResolver(collectorFormSchema),
    mode: 'onChange',
    defaultValues: formDefaults(me, chosenWallet, draft),
  })

  const chooseWallet = (next: string) => {
    setChoice(next)
    const wallet = wallets.find((item) => item.id === next)
    if (wallet) {
      for (const [field, value] of Object.entries(walletFields(wallet))) {
        form.setValue(field as keyof CollectorFormValues, value, { shouldValidate: true })
      }
    }
  }

  useEffect(() => {
    let timer: number | undefined
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        window.clearTimeout(timer)
        timer = window.setTimeout(
          () => checkoutStorage.saveDraft(userId, { values, walletChoice: choice }),
          DRAFT_DEBOUNCE_MS,
        )
      },
    })
    return () => {
      window.clearTimeout(timer)
      unsubscribe()
    }
  }, [form, userId, choice])

  return { form, choice, chooseWallet, chosenWallet, customWallet: choice === CUSTOM_WALLET }
}
