import type { UseFormReturn } from 'react-hook-form'

import { FormField } from '@/shared/components/forms/FormField'
import { Textarea } from '@/shared/ui/textarea'

import type { CollectorFormValues } from '../lib/collector-form'
import { NETWORK_OPTIONS, WALLET_TYPE_OPTIONS } from '@/shared/lib/select-options'
import { CollectorSelectField } from './CollectorSelectField'
import { CollectorTextField } from './CollectorTextField'
import { EnsSuffixField } from './EnsSuffixField'
import { UseAnotherWalletToggle } from './UseAnotherWalletToggle'

type CollectorFormProps = {
  form: UseFormReturn<CollectorFormValues>
  customWallet: boolean
  onCustomWalletChange: (value: boolean) => void
}

export function CollectorForm({ form, customWallet, onCustomWalletChange }: CollectorFormProps) {
  const walletLocked = !customWallet
  return (
    <section aria-labelledby="collector-title" className="flex min-w-0 flex-1 flex-col gap-3">
      <h2 id="collector-title" className="type-b-17-bold text-foreground">
        Perfil do colecionador
      </h2>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-x-6">
          <div className="flex flex-col gap-3">
            <CollectorTextField form={form} name="displayName" autoComplete="name" />
            <CollectorSelectField
              form={form}
              name="network"
              options={NETWORK_OPTIONS}
              placeholder="Selecione uma rede"
              disabled={walletLocked}
            />
            <CollectorTextField
              form={form}
              name="walletAddress"
              placeholder="Endereço 0x da carteira"
              readOnly={walletLocked}
            />
            <CollectorSelectField
              form={form}
              name="walletType"
              options={WALLET_TYPE_OPTIONS}
              placeholder="Selecione uma carteira"
              disabled={walletLocked}
            />
            <CollectorTextField form={form} name="email" autoComplete="email" />
          </div>
          <div className="flex flex-col gap-3">
            <CollectorTextField form={form} name="username" autoComplete="username" />
            <CollectorTextField form={form} name="profileName" />
            <CollectorTextField
              form={form}
              name="secondaryWallet"
              required={false}
              hideLabel
              keepLabelSpace
              placeholder="ENS ou carteira secundária (opcional)"
            />
            <CollectorTextField form={form} name="referralCode" />
            <EnsSuffixField form={form} />
          </div>
        </div>
        <UseAnotherWalletToggle checked={customWallet} onChange={onCustomWalletChange} />
        <FormField label="Observação do colecionador (opcional)" className="w-full lg:w-[350px]">
          {(control) => <Textarea {...control} {...form.register('note')} className="h-[152px]" />}
        </FormField>
      </div>
    </section>
  )
}
