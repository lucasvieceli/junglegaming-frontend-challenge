import { useId } from 'react'

import type { Edition } from '@/shared/contracts/nft'
import { cn } from '@/shared/lib/cn'
import { TooltipProvider } from '@/shared/ui/tooltip'

import { EditionPill } from './EditionPill'

type EditionSelectorProps = {
  editions: Edition[]
  selectedId: string | undefined
  onSelect: (id: string) => void
  className?: string
}

export function EditionSelector({
  editions,
  selectedId,
  onSelect,
  className,
}: EditionSelectorProps) {
  const labelId = useId()
  return (
    <div className={cn('flex flex-col gap-2 lg:gap-3', className)}>
      <p id={labelId} className="type-b-15-bold text-foreground">
        Edição:
      </p>
      <TooltipProvider>
        <div
          role="radiogroup"
          aria-labelledby={labelId}
          className="flex flex-wrap items-center gap-3 lg:gap-1.5"
        >
          {editions.map((edition) => (
            <EditionPill
              key={edition.id}
              edition={edition}
              selected={edition.id === selectedId}
              onSelect={() => onSelect(edition.id)}
            />
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
