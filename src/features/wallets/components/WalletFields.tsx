import type { UseFormReturn } from 'react-hook-form'

import { EnsFieldRhf } from '@/shared/components/forms/EnsFieldRhf'
import { SelectFieldRhf } from '@/shared/components/forms/SelectFieldRhf'
import { TextFieldRhf } from '@/shared/components/forms/TextFieldRhf'
import { NETWORK_OPTIONS, WALLET_TYPE_OPTIONS } from '@/shared/lib/select-options'

import type { WalletFormValues } from '../lib/wallet-form'

export function WalletFields({
  form,
  readOnly = false,
}: {
  form: UseFormReturn<WalletFormValues>
  readOnly?: boolean
}) {
  const field = { form, variant: 'wallets' } as const
  return (
    <fieldset
      disabled={readOnly}
      className="grid gap-6 lg:grid-cols-[repeat(2,minmax(0,417px))] lg:justify-between"
    >
      <TextFieldRhf {...field} name="displayName" label="Nome de exibição" />
      <TextFieldRhf {...field} name="alias" label="Apelido da carteira" />
      <SelectFieldRhf
        {...field}
        name="network"
        label="Rede"
        options={NETWORK_OPTIONS}
        placeholder="Selecione uma rede"
        disabled={readOnly}
      />
      <TextFieldRhf {...field} name="profileName" label="Nome do perfil" />
      <TextFieldRhf
        {...field}
        name="address"
        label="Endereço da carteira"
        placeholder="Endereço 0x da carteira"
      />
      <TextFieldRhf
        {...field}
        name="secondaryAddress"
        label="ENS ou carteira secundária (opcional)"
        required={false}
        hideLabel
        keepLabelSpace
        placeholder="ENS ou carteira secundária (opcional)"
      />
      <SelectFieldRhf
        {...field}
        name="type"
        label="Tipo de carteira"
        options={WALLET_TYPE_OPTIONS}
        placeholder="Selecione uma carteira"
        disabled={readOnly}
      />
      <TextFieldRhf {...field} name="referralCode" label="Código de indicação" />
      <TextFieldRhf {...field} name="email" label="E-mail" type="email" />
      <EnsFieldRhf {...field} name="ensName" />
    </fieldset>
  )
}
