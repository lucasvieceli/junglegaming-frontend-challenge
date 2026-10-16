import { Breadcrumb } from '@/shared/components/layout/Breadcrumb'

import type { CheckoutController } from '../hooks/useCheckoutController'
import { useOrderReview } from '../hooks/useOrderReview'
import { reviewWallet } from '../lib/review-wallet'
import { CollectorForm } from './CollectorForm'
import { ConfirmPurchaseButton } from './ConfirmPurchaseButton'
import { OrderItemsList } from './OrderItemsList'
import { QuoteSummary } from './QuoteSummary'
import { ReviewOrderDialog } from './ReviewOrderDialog'
import { SubmissionNotice } from './SubmissionNotice'
import { WalletSelector } from './WalletSelector'

export function CheckoutDesktop({ checkout }: { checkout: CheckoutController }) {
  const review = useOrderReview(checkout)
  const wallet = reviewWallet(checkout)
  const items = checkout.quote.data?.items ?? []

  return (
    <div className="flex flex-col gap-8 pt-8">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Mercado', to: '/', hash: 'catalog' },
          { label: 'Pagamento' },
        ]}
      />
      <h1 className="sr-only">Pagamento</h1>
      <div className="flex items-start gap-8">
        <CollectorForm
          form={checkout.form}
          customWallet={checkout.customWallet}
          onCustomWalletChange={(custom) =>
            checkout.chooseWallet(custom ? 'custom' : (checkout.wallets[0]?.id ?? 'custom'))
          }
        />
        <aside aria-label="Resumo do pedido" className="flex w-[405px] shrink-0 flex-col gap-3">
          <h2 className="type-b-17-bold text-foreground">Seus NFTs</h2>
          <OrderItemsList items={items} />
          <QuoteSummary checkout={checkout} />
          <section aria-labelledby="wallet-title" className="flex flex-col gap-5">
            <h2 id="wallet-title" className="type-b-17-bold text-center text-foreground">
              Carteira e rede
            </h2>
            <div className="flex flex-col gap-6">
              <WalletSelector checkout={checkout} />
              <SubmissionNotice submission={checkout.submission} />
              <ConfirmPurchaseButton
                variant="desktop"
                disabled={!checkout.canConfirm}
                busy={review.preparing}
                onClick={() => void review.start()}
              />
            </div>
          </section>
        </aside>
      </div>
      <ReviewOrderDialog
        order={review.review}
        quote={checkout.quote.data}
        walletLabel={wallet.label}
        walletAddress={wallet.address}
        busy={checkout.submission.phase === 'sending'}
        onBack={review.close}
        onConfirm={review.confirm}
      />
    </div>
  )
}
