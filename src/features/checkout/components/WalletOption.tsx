import type { ReactNode } from 'react'

import type { WalletType } from '@/shared/contracts/common'
import { cn } from '@/shared/lib/cn'
import { WALLET_TYPE_LABELS } from '@/shared/lib/wallet-labels'
import { RadioGroupItem } from '@/shared/ui/radio-group'

type WalletOptionProps = {
  type: WalletType
  selected: boolean
  content: ReactNode
  status: ReactNode
}

export function WalletOption({ type, selected, content, status }: WalletOptionProps) {
  return (
    <div
      className={cn(
        'flex h-[45px] items-center gap-3 rounded-xs border pr-3 pl-3',
        selected ? 'border-primary' : 'border-line',
      )}
    >
      <label className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2.5">
        <RadioGroupItem
          value={type}
          aria-label={WALLET_TYPE_LABELS[type]}
          className="[&_span]:size-2.5"
        />
        {content}
      </label>
      {selected && status}
    </div>
  )
}
