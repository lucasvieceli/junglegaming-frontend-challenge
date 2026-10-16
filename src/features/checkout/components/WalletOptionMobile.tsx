import type { ReactNode } from 'react'

import { WalletIcon } from '@/shared/components/icons/WalletIcon'
import type { WalletType } from '@/shared/contracts/common'
import { cn } from '@/shared/lib/cn'
import { WALLET_TYPE_LABELS } from '@/shared/lib/wallet-labels'
import { RadioGroupItem } from '@/shared/ui/radio-group'

const GLYPHS: Partial<Record<WalletType, string>> = { walletconnect: 'W', metamask: 'M' }

type WalletOptionMobileProps = {
  type: WalletType
  selected: boolean
  status: ReactNode
}

export function WalletOptionMobile({ type, selected, status }: WalletOptionMobileProps) {
  const glyph = GLYPHS[type]
  return (
    <div
      className={cn(
        'flex h-[65px] items-center gap-2 rounded-[15px] bg-surface-card pr-4 pl-3.5',
        selected ? 'shadow-[0_0_40px_rgba(10,6,4,0.45)]' : 'shadow-[0_0_20px_rgba(10,6,4,0.45)]',
      )}
    >
      <label className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-[11px]">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-primary"
        >
          {glyph ? (
            <span className="type-b-14-bold text-accent">{glyph}</span>
          ) : (
            <WalletIcon className="h-[18.6px] w-[20.1px]" />
          )}
        </span>
        <span className="type-b-14 min-w-0 flex-1 truncate text-foreground">
          {WALLET_TYPE_LABELS[type]}
        </span>
      </label>
      {selected && status}
      <RadioGroupItem
        value={type}
        aria-label={WALLET_TYPE_LABELS[type]}
        className={cn('ml-1', !selected && 'border-line-soft')}
      />
    </div>
  )
}
