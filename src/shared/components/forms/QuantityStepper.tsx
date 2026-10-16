import { MinusIcon } from '@/shared/components/icons/MinusIcon'
import { PlusIcon } from '@/shared/components/icons/PlusIcon'
import { cn } from '@/shared/lib/cn'

const SIZES = {
  lg: {
    button: 'h-[49.5px] w-[33px] shadow-stepper-lg before:-inset-x-1.5',
    icon: 'size-[26.4px]',
    value: 'type-t-20-regular min-w-6',
  },
  sm: {
    button: 'h-[30px] w-5 shadow-stepper before:-inset-x-3 before:-inset-y-[7px]',
    icon: 'size-4',
    value: 'type-t-18-medium min-w-[11px]',
  },
}

type QuantityStepperProps = {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  itemName: string
  size?: keyof typeof SIZES
  disabled?: boolean
  valueClassName?: string
}

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  itemName,
  size = 'lg',
  disabled = false,
  valueClassName,
}: QuantityStepperProps) {
  const styles = SIZES[size]
  const buttonClass = cn(
    'relative flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink bg-primary before:absolute before:content-[""] text-ink outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40',
    styles.button,
  )

  return (
    <div className="flex items-center gap-3" role="group" aria-label={`Quantidade de ${itemName}`}>
      <button
        type="button"
        className={buttonClass}
        aria-label={`Diminuir quantidade de ${itemName}`}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <MinusIcon className={styles.icon} />
      </button>
      <output
        aria-live="polite"
        className={cn('text-center text-foreground', styles.value, valueClassName)}
      >
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        aria-label={`Aumentar quantidade de ${itemName}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <PlusIcon className={styles.icon} />
      </button>
    </div>
  )
}
