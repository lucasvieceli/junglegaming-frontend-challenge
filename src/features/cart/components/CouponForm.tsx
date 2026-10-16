import { useId, useState, type FormEvent } from 'react'

import { isApiError } from '@/shared/api/api-error'
import type { Coupon } from '@/shared/contracts/cart'
import { cn } from '@/shared/lib/cn'

import { useApplyCoupon } from '../api/useCoupon'
import { AppliedCoupon } from './AppliedCoupon'

const STYLES = {
  desktop: {
    field: 'h-10 rounded-xs border border-primary pl-2',
    input: 'type-c-12 placeholder:text-secondary',
    button: 'type-b-15-bold h-10 w-[102px] rounded-r-xs bg-primary text-ink',
  },
  mobile: {
    field: 'h-[50px] rounded-pill border border-line pl-4 shadow-glow',
    input: 'type-c-13-22 placeholder:text-secondary',
    button: 'type-b-15-bold h-[50px] w-[97px] rounded-pill bg-gradient-apply text-foreground',
  },
}

type CouponFormProps = { coupon: Coupon | null; variant: keyof typeof STYLES; showLabel?: boolean }

export function CouponForm({ coupon, variant, showLabel = true }: CouponFormProps) {
  const inputId = useId()
  const errorId = `${inputId}-error`
  const [code, setCode] = useState('')
  const apply = useApplyCoupon()
  const styles = STYLES[variant]
  const error =
    apply.error && isApiError(apply.error) && apply.error.status === 422
      ? apply.error.message
      : null

  if (coupon) return <AppliedCoupon coupon={coupon} />

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (code.trim()) apply.mutate(code.trim(), { onSuccess: () => setCode('') })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn('type-b-14-bold text-foreground', !showLabel && 'sr-only')}
      >
        Código promocional
      </label>
      <div
        className={cn(
          'flex items-center overflow-hidden focus-within:ring-2 focus-within:ring-accent',
          styles.field,
          error && 'border-coral',
        )}
      >
        <input
          id={inputId}
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            apply.reset()
          }}
          placeholder="Digite o código promocional..."
          autoCapitalize="characters"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent text-foreground outline-none',
            styles.input,
          )}
        />
        <button
          type="submit"
          disabled={apply.isPending}
          className={cn(
            'shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70',
            styles.button,
          )}
        >
          {apply.isPending ? '…' : 'Aplicar'}
        </button>
      </div>
      {error && (
        <p id={errorId} className="type-c-13 text-coral" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
