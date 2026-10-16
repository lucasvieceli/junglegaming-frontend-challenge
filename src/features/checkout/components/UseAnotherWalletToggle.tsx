import { useId } from 'react'

import { cn } from '@/shared/lib/cn'

export function UseAnotherWalletToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex size-[15px] cursor-pointer items-center justify-center rounded-full border-[1.2px] border-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className={cn('size-[7px] rounded-full bg-primary', !checked && 'hidden')} />
      </button>
      <label htmlFor={id} className="type-b-15 cursor-pointer text-foreground">
        Usar outra carteira?
      </label>
    </div>
  )
}
