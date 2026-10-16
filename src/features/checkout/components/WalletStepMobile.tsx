import { Link } from '@tanstack/react-router'

import { InlineAlert } from '@/shared/components/feedback/InlineAlert'
import type { WalletType } from '@/shared/contracts/common'
import { formatEth } from '@/shared/lib/money'
import { RadioGroup } from '@/shared/ui/radio-group'

import type { CheckoutController } from '../hooks/useCheckoutController'
import { useWalletSelection } from '../hooks/useWalletSelection'
import { walletCardLines } from '../lib/wallet-card-lines'
import { WALLET_OPTION_TYPES } from '../lib/wallet-choice'
import { WalletCardMobile } from './WalletCardMobile'
import { WalletOptionMobile } from './WalletOptionMobile'
import { WalletOptionStatus } from './WalletOptionStatus'

const MANAGE_WALLETS = { to: '/account/wallets', search: { redirect: '/checkout?step=2' } } as const

export function WalletStepMobile({ checkout }: { checkout: CheckoutController }) {
  const selection = useWalletSelection(checkout)
  const total = checkout.quote.data?.pricing.total

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="type-b-16-bold text-foreground">Carteira conectada</h2>
        <Link {...MANAGE_WALLETS} className="type-b-14-bold text-accent hover:underline">
          Trocar carteira
        </Link>
      </div>
      {checkout.wallets.length === 0 ? (
        <InlineAlert tone="warning">
          Você ainda não cadastrou carteiras.{' '}
          <Link {...MANAGE_WALLETS} className="text-accent underline">
            Cadastrar carteira
          </Link>{' '}
          ou escolha uma carteira abaixo.
        </InlineAlert>
      ) : (
        <RadioGroup
          value={checkout.customWallet ? '' : checkout.choice}
          onValueChange={selection.selectWallet}
          aria-label="Carteira cadastrada"
          className="gap-5"
        >
          {checkout.wallets.map((wallet) => (
            <WalletCardMobile
              key={wallet.id}
              value={wallet.id}
              title={wallet.alias}
              lines={walletCardLines(wallet)}
              selected={!checkout.customWallet && checkout.choice === wallet.id}
            />
          ))}
        </RadioGroup>
      )}
      <section aria-labelledby="wallet-options-title" className="flex flex-col gap-4">
        <h2 id="wallet-options-title" className="type-b-16-bold text-foreground">
          Carteira e rede
        </h2>
        <RadioGroup
          value={selection.selectedType ?? ''}
          onValueChange={(value) => selection.selectType(value as WalletType)}
          aria-labelledby="wallet-options-title"
          className="gap-4"
        >
          {WALLET_OPTION_TYPES.map((type) => (
            <WalletOptionMobile
              key={type}
              type={type}
              selected={selection.selectedType === type}
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
      </section>
      {total && (
        <p className="flex items-center justify-end gap-7">
          <span className="type-b-16-bold text-foreground">Total:</span>
          <span className="type-b-18-bold text-accent">{formatEth(total)}</span>
        </p>
      )}
    </div>
  )
}
