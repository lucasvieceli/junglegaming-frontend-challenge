import { KebabIcon } from '@/shared/components/icons/KebabIcon'
import { cn } from '@/shared/lib/cn'
import { RadioGroupItem } from '@/shared/ui/radio-group'

type WalletCardMobileProps = {
  value: string
  title: string
  lines: [string, string]
  selected: boolean
}

export function WalletCardMobile({ value, title, lines, selected }: WalletCardMobileProps) {
  return (
    <label
      className={cn(
        'flex min-h-[93px] cursor-pointer items-center gap-[19px] rounded-[14px] bg-surface-card pr-5 pl-[19px]',
        selected && 'shadow-card-selected',
      )}
    >
      <RadioGroupItem value={value} className={cn(!selected && 'border-line-soft')} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="type-b-16-bold text-foreground">{title}</span>
        <span className="type-b-14-22 text-text-secondary">
          {lines[0]}
          <br />
          {lines[1]}
        </span>
      </span>
      <KebabIcon aria-hidden="true" className="h-[15px] w-[3px] text-secondary" />
    </label>
  )
}
