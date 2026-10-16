import { cn } from '@/shared/lib/cn'

export function WalletChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'type-tiny-9 inline-flex h-[26px] items-center justify-center rounded-md border border-line-soft bg-surface-dark px-2 whitespace-pre text-accent',
        className,
      )}
    >
      {'METAMASK  •  WALLETCONNECT  •  COINBASE'}
    </span>
  )
}
