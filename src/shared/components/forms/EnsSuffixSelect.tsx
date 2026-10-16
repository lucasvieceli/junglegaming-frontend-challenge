import { ChevronDownIcon } from '@/shared/components/icons/ChevronDownIcon'
import { cn } from '@/shared/lib/cn'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { FIELD_CHEVRON_SIZE, type FormFieldVariant } from './form-field-variant'
import type { FieldControlProps } from './FormField'

const ENS_SUFFIXES = ['.eth']

const SUFFIX_PADDING: Record<FormFieldVariant, string> = {
  profile: 'pr-1 pl-[9px]',
  wallets: 'pr-1 pl-[9px]',
  checkout: 'pr-1.5 pl-2.5',
}

type EnsSuffixSelectProps = Partial<FieldControlProps> & {
  variant: FormFieldVariant
  disabled?: boolean
  'aria-label'?: string
  className?: string
}

export function EnsSuffixSelect({ variant, disabled, className, ...aria }: EnsSuffixSelectProps) {
  return (
    <Select value={ENS_SUFFIXES[0]} disabled={disabled}>
      <SelectTrigger
        {...aria}
        className={cn(
          'type-b-15-15 w-[78px] shrink-0 gap-1 [&>span]:overflow-visible',
          SUFFIX_PADDING[variant],
          className,
        )}
        icon={
          <ChevronDownIcon
            className={cn('pointer-events-none text-foreground', FIELD_CHEVRON_SIZE[variant])}
          />
        }
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ENS_SUFFIXES.map((suffix) => (
          <SelectItem key={suffix} value={suffix}>
            {suffix}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
