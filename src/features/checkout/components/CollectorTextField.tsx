import type { FieldPath, UseFormReturn } from 'react-hook-form'

import { TextFieldRhf } from '@/shared/components/forms/TextFieldRhf'

import { COLLECTOR_FIELD_LABELS, type CollectorFormValues } from '../lib/collector-form'

type CollectorTextFieldProps = {
  form: UseFormReturn<CollectorFormValues>
  name: FieldPath<CollectorFormValues>
  required?: boolean
  readOnly?: boolean
  placeholder?: string
  hideLabel?: boolean
  keepLabelSpace?: boolean
  autoComplete?: string
}

export function CollectorTextField({ name, ...props }: CollectorTextFieldProps) {
  return (
    <TextFieldRhf {...props} name={name} label={COLLECTOR_FIELD_LABELS[name]} variant="checkout" />
  )
}
