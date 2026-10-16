import { WalletChip } from '@/shared/components/layout/WalletChip'
import type { WalletType } from '@/shared/contracts/common'
import { WALLET_TYPE_LABELS } from '@/shared/lib/wallet-labels'
import { RadioGroup } from '@/shared/ui/radio-group'

import type { CheckoutController } from '../hooks/useCheckoutController'
import { useWalletSelection } from '../hooks/useWalletSelection'
import { WALLET_OPTION_TYPES } from '../lib/wallet-choice'
import { WalletOption } from './WalletOption'
import { WalletOptionStatus } from './WalletOptionStatus'

export function WalletSelector({ checkout }: { checkout: CheckoutController }) {
  const selection = useWalletSelection(checkout)
  return (
    <RadioGroup
      value={selection.selectedType ?? ''}
      onValueChange={(value) => selection.selectType(value as WalletType)}
      aria-label="Carteira para pagamento"
      className="gap-4"
    >
      {WALLET_OPTION_TYPES.map((type, index) => (
        <WalletOption
          key={type}
          type={type}
          selected={selection.selectedType === type}
          content={
            index === 0 ? (
              <WalletChip className="w-[224px]" />
            ) : (
              <span className="type-b-15 truncate text-foreground">{WALLET_TYPE_LABELS[type]}</span>
            )
          }
          status={
            <WalletOptionStatus
              state={checkout.connection.state}
              canConnect={selection.canConnect}
              onConnect={selection.connectCurrent}
              onDisconnect={selection.disconnect}
            />
          }
        />
      ))}
    </RadioGroup>
  )
}
