import { StarIcon } from '@/shared/components/icons/StarIcon'

export function RatingPill({ average, count }: { average: number; count: number }) {
  return (
    <p
      role="img"
      aria-label={`Nota ${average.toLocaleString('pt-BR')} de 5, ${count} avaliações`}
      className="flex h-[27px] shrink-0 items-center rounded-[32px] border border-primary px-1"
    >
      <StarIcon aria-hidden="true" className="mr-1 size-3.5 text-amber" />
      <span aria-hidden="true" className="type-b-14-medium text-foreground">
        {average.toFixed(1)}
      </span>
      <span aria-hidden="true" className="type-b-14 text-text-secondary">
        ({count})
      </span>
    </p>
  )
}
