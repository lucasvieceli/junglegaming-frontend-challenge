import { DangerIcon } from '@/shared/components/icons/DangerIcon'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Verifique sua conexão e tente novamente.',
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center justify-center gap-4 py-12 text-center', className)}
    >
      <DangerIcon aria-hidden="true" className="size-12 text-coral" />
      <h2 className="type-b-18-bold-24 text-foreground">{title}</h2>
      <p className="type-b-14-24 max-w-[480px] text-text-secondary">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} disabled={isRetrying} className="type-b-16-bold-20">
          {isRetrying ? 'Tentando…' : 'Tentar novamente'}
        </Button>
      )}
    </div>
  )
}
