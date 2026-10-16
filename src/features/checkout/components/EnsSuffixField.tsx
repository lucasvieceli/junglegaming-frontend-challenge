import type { UseFormReturn } from 'react-hook-form'

import { EnsSuffixSelect } from '@/shared/components/forms/EnsSuffixSelect'
import { fieldErrorOf } from '@/shared/components/forms/field-error-of'
import { FormField } from '@/shared/components/forms/FormField'

import { COLLECTOR_FIELD_LABELS, type CollectorFormValues } from '../lib/collector-form'

export function EnsSuffixField({ form }: { form: UseFormReturn<CollectorFormValues> }) {
  return (
    <FormField
      label={COLLECTOR_FIELD_LABELS.ensName}
      required
      variant="checkout"
      error={fieldErrorOf(form, 'ensName')}
    >
      {(control) => <EnsSuffixSelect {...control} variant="checkout" className="max-lg:h-[50px]" />}
    </FormField>
  )
}
