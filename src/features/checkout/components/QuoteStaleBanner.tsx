import type { QuoteChange } from '@/shared/contracts/cart'
import { Button } from '@/shared/ui/button'

type QuoteStaleBannerProps = {
  changes: QuoteChange[]
  outdated: boolean
  updating: boolean
  onUpdate: () => void
}

export function QuoteStaleBanner({ changes, outdated, updating, onUpdate }: QuoteStaleBannerProps) {
  return (
    <div
      role="status"
      data-testid="quote-stale-banner"
      className="flex flex-col gap-3 rounded-md border-l-4 border-amber bg-surface-raised p-4"
    >
      <p className="type-b-15-bold text-foreground">
        {outdated ? 'A cotação mudou' : 'Revise as mudanças na cotação'}
      </p>
      {changes.length > 0 && (
        <ul className="type-b-14-22 flex list-disc flex-col gap-1 pl-5 text-text-secondary">
          {changes.map((change) => (
            <li key={`${change.itemId}-${change.kind}`}>{change.message}</li>
          ))}
        </ul>
      )}
      <Button
        size="sm"
        className="type-b-14-bold self-start"
        onClick={onUpdate}
        disabled={updating}
      >
        {updating ? 'Atualizando…' : outdated ? 'Atualizar cotação' : 'Entendi, atualizar'}
      </Button>
    </div>
  )
}
