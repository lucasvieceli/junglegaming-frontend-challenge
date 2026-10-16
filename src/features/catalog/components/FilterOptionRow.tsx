import { CheckIcon } from '@/shared/components/icons/CheckIcon'
import { cn } from '@/shared/lib/cn'

type FilterOptionRowProps = {
  label: string
  count: number
  selected: boolean
  onToggle: () => void
  boldCount?: boolean
}

export function FilterOptionRow({
  label,
  count,
  selected,
  onToggle,
  boldCount = false,
}: FilterOptionRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'type-b-15-40 flex w-full cursor-pointer items-center justify-between gap-3 text-left outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent',
        selected ? 'text-accent' : 'text-text-secondary',
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {selected && <CheckIcon aria-hidden="true" className="size-3 shrink-0" />}
        <span className="truncate">{label}</span>
      </span>
      <span className={cn(boldCount && 'font-bold')}>
        <span className="sr-only">, </span>({count})
      </span>
    </button>
  )
}
