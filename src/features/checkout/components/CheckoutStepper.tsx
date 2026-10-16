import { cn } from '@/shared/lib/cn'

import { CHECKOUT_STEPS } from '../lib/checkout-steps'

export function CheckoutStepper({ step, className }: { step: number; className?: string }) {
  return (
    <ol aria-label="Etapas do pagamento" className={cn('flex gap-2', className)}>
      {CHECKOUT_STEPS.map((label, index) => (
        <li key={label} aria-current={index + 1 === step ? 'step' : undefined} className="flex-1">
          <span
            className={
              index + 1 <= step
                ? 'block h-1 rounded-full bg-primary'
                : 'block h-1 rounded-full bg-line'
            }
          />
          <span className="sr-only">
            Etapa {index + 1} de {CHECKOUT_STEPS.length}: {label}
          </span>
        </li>
      ))}
    </ol>
  )
}
