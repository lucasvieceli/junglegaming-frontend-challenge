import { useId, type ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'
import { Label } from '@/shared/ui/label'

import { FieldError } from './FieldError'
import type { FormFieldVariant } from './form-field-variant'
import { RequiredMark } from './RequiredMark'

export type FieldControlProps = {
  id: string
  'aria-invalid': boolean
  'aria-required': boolean
  'aria-describedby': string | undefined
}

type FormFieldProps = {
  label: string
  required?: boolean
  error?: string
  hint?: string
  variant?: FormFieldVariant
  hideLabel?: boolean
  keepLabelSpace?: boolean
  className?: string
  children: (control: FieldControlProps) => ReactNode
}

const REQUIRED_LABEL_ROW = 'h-[29px]'

const REQUIRED_LABEL_GAP: Record<FormFieldVariant, string> = {
  profile: 'mb-2.5',
  wallets: '-mb-1',
  checkout: 'mb-0',
}

const OPTIONAL_LABEL = 'h-[15px] mb-3'

export function FormField({
  label,
  required = false,
  error,
  hint,
  variant = 'profile',
  hideLabel = false,
  keepLabelSpace = false,
  className,
  children,
}: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
  const requiredLabelBox = cn(REQUIRED_LABEL_ROW, REQUIRED_LABEL_GAP[variant])

  return (
    <div className={cn('flex min-w-0 flex-col gap-2.5', className)}>
      <div className="flex flex-col">
        <Label
          htmlFor={id}
          className={cn(required ? requiredLabelBox : OPTIONAL_LABEL, hideLabel && 'sr-only')}
        >
          {label}
          {required && <RequiredMark />}
        </Label>
        {hideLabel && keepLabelSpace && (
          <span aria-hidden="true" className={cn('max-lg:hidden', requiredLabelBox)} />
        )}
        {children({
          id,
          'aria-invalid': Boolean(error),
          'aria-required': required,
          'aria-describedby': describedBy,
        })}
      </div>
      {hint && (
        <p id={hintId} className="type-c-13 text-text-secondary">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  )
}
