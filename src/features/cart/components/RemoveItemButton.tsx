import { TrashIcon } from '@/shared/components/icons/TrashIcon'
import { cn } from '@/shared/lib/cn'

import { useRemoveCartItem } from '../api/useRemoveCartItem'

export function RemoveItemButton({
  itemId,
  name,
  className,
}: {
  itemId: string
  name: string
  className?: string
}) {
  const remove = useRemoveCartItem()
  return (
    <button
      type="button"
      aria-label={`Remover ${name}`}
      disabled={remove.isPending}
      onClick={() => remove.mutate(itemId)}
      className={cn(
        'flex size-6 shrink-0 cursor-pointer items-center justify-center text-primary outline-none hover:text-coral focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50',
        className,
      )}
    >
      <TrashIcon className="h-[18.5px] w-[16.4px]" />
    </button>
  )
}
