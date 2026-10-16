import { cn } from '@/shared/lib/cn'

export function ConfirmPurchaseButton({
  variant,
  disabled,
  busy,
  onClick,
}: {
  variant: 'desktop' | 'mobile'
  disabled: boolean
  busy: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      aria-busy={busy}
      className={cn(
        'type-b-15-bold flex w-full cursor-pointer items-center justify-center text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'desktop'
          ? 'h-[45px] rounded-lg bg-primary'
          : 'h-[60px] rounded-pill bg-gradient-cta',
      )}
    >
      {busy ? 'Confirmando…' : 'Confirmar compra'}
    </button>
  )
}
