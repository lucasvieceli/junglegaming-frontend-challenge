import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'
import { Input } from '@/shared/ui/input'

import { EnsSuffixSelect } from './EnsSuffixSelect'
import type { FormFieldVariant } from './form-field-variant'

type EnsInputProps = ComponentProps<typeof Input> & { variant?: FormFieldVariant }

export function EnsInput({ className, variant = 'profile', ...props }: EnsInputProps) {
  return (
    <div className="flex w-full gap-2.5">
      <EnsSuffixSelect
        aria-label="Sufixo ENS"
        variant={variant}
        disabled={props.disabled || props.readOnly}
      />
      <Input
        autoCapitalize="none"
        spellCheck={false}
        {...props}
        className={cn('flex-1', className)}
      />
    </div>
  )
}
