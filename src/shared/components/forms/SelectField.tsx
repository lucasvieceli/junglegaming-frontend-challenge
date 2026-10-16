import { ChevronDownIcon } from '@/shared/components/icons/ChevronDownIcon'
import { cn } from '@/shared/lib/cn'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { FIELD_CHEVRON_SIZE, type FormFieldVariant } from './form-field-variant'
import type { FieldControlProps } from './FormField'

export type SelectOption = { value: string; label: string }

type SelectFieldProps = Partial<FieldControlProps> & {
  options: SelectOption[]
  value: string | undefined
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder: string
  disabled?: boolean
  variant?: FormFieldVariant
  className?: string
}

export function SelectField({
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  variant = 'profile',
  className,
  ...aria
}: SelectFieldProps) {
  return (
    <Select
      value={value ?? ''}
      onValueChange={onChange}
      onOpenChange={(open) => !open && onBlur?.()}
      disabled={disabled}
    >
      <SelectTrigger
        className={className}
        icon={
          <ChevronDownIcon
            className={cn('pointer-events-none text-secondary', FIELD_CHEVRON_SIZE[variant])}
          />
        }
        {...aria}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
