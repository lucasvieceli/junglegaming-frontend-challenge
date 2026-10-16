import type { UseFormReturn } from 'react-hook-form'

import { SelectFieldRhf } from '@/shared/components/forms/SelectFieldRhf'
import type { SelectOption } from '@/shared/components/forms/SelectField'

import { COLLECTOR_FIELD_LABELS, type CollectorFormValues } from '../lib/collector-form'

type CollectorSelectFieldProps = {
  form: UseFormReturn<CollectorFormValues>
  name: 'network' | 'walletType'
  options: SelectOption[]
  placeholder: string
  disabled?: boolean
}

export function CollectorSelectField({ name, ...props }: CollectorSelectFieldProps) {
  return (
    <div className="[&_[data-slot=select-trigger]:disabled]:opacity-100">
      <SelectFieldRhf
        {...props}
        name={name}
        label={COLLECTOR_FIELD_LABELS[name]}
        variant="checkout"
      />
    </div>
  )
}
