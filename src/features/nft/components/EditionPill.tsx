import type { Edition } from '@/shared/contracts/nft'
import { cn } from '@/shared/lib/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

import { isSoldOut } from '../lib/editions'

const isFraction = (label: string) => /^\d/.test(label)

function pillPadding(fraction: boolean, selected: boolean): string {
  if (fraction) return selected ? 'px-[5px]' : 'px-[3px]'
  return selected ? 'px-[9px]' : 'px-[7px]'
}

type EditionPillProps = { edition: Edition; selected: boolean; onSelect: () => void }

export function EditionPill({ edition, selected, onSelect }: EditionPillProps) {
  const soldOut = isSoldOut(edition)
  const pill = (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={soldOut || undefined}
      aria-label={soldOut ? `Edição ${edition.label}, esgotada` : `Edição ${edition.label}`}
      onClick={soldOut ? undefined : onSelect}
      className={cn(
        'type-b-14 flex h-7 min-w-9 cursor-pointer items-center justify-center rounded-[50%] border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent',
        pillPadding(isFraction(edition.label), selected),
        selected
          ? 'border-primary font-medium text-accent'
          : 'border-line text-text-secondary hover:border-primary',
        soldOut && 'cursor-not-allowed line-through opacity-50 hover:border-line',
      )}
    >
      {edition.label}
    </button>
  )
  if (!soldOut) return pill
  return (
    <Tooltip>
      <TooltipTrigger asChild>{pill}</TooltipTrigger>
      <TooltipContent>Edição esgotada</TooltipContent>
    </Tooltip>
  )
}
