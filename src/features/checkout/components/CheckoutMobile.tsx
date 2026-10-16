import { useNavigate } from '@tanstack/react-router'

import { MobileScreenHeader } from '@/shared/components/layout/MobileScreenHeader'

import type { CheckoutController } from '../hooks/useCheckoutController'
import { useOrderReview } from '../hooks/useOrderReview'
import { CHECKOUT_STEPS, CUSTOM_WALLET_FIELDS, STEP_ONE_FIELDS } from '../lib/checkout-steps'
import { CheckoutStepper } from './CheckoutStepper'
import { CollectorForm } from './CollectorForm'
import { ConfirmPurchaseButton } from './ConfirmPurchaseButton'
import { OrderItemsList } from './OrderItemsList'
import { QuoteSummary } from './QuoteSummary'
import { StepButton } from './StepButton'
import { SubmissionNotice } from './SubmissionNotice'
import { WalletStepMobile } from './WalletStepMobile'

export function CheckoutMobile({ checkout, step }: { checkout: CheckoutController; step: number }) {
  const navigate = useNavigate()
  const review = useOrderReview(checkout)
  const goTo = (next: number) => void navigate({ to: '/checkout', search: { step: next } })

  const nextFromData = async () => {
    const fields = checkout.customWallet
      ? [...STEP_ONE_FIELDS, ...CUSTOM_WALLET_FIELDS]
      : [...STEP_ONE_FIELDS]
    if (await checkout.form.trigger(fields)) goTo(2)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-1 pt-2">
      <MobileScreenHeader title="Pagamento com carteira" />
      <CheckoutStepper step={step} className={step === 2 ? 'sr-only' : undefined} />
      {step !== 2 && (
        <p className="type-b-14-bold text-text-secondary">{CHECKOUT_STEPS[step - 1]}</p>
      )}
      {step === 1 && (
        <>
          <CollectorForm
            form={checkout.form}
            customWallet={checkout.customWallet}
            onCustomWalletChange={(custom) =>
              checkout.chooseWallet(custom ? 'custom' : (checkout.wallets[0]?.id ?? 'custom'))
            }
          />
          <StepButton onClick={() => void nextFromData()}>Continuar</StepButton>
        </>
      )}
      {step === 2 && (
        <>
          <WalletStepMobile checkout={checkout} />
          <div className="sticky bottom-8 mt-auto">
            <ConfirmPurchaseButton
              variant="mobile"
              disabled={checkout.connection.state.status !== 'connected'}
              busy={false}
              onClick={() => goTo(3)}
            />
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <OrderItemsList items={checkout.quote.data?.items ?? []} />
          <QuoteSummary checkout={checkout} size="sm" />
          <SubmissionNotice submission={checkout.submission} />
          <ConfirmPurchaseButton
            variant="mobile"
            disabled={!checkout.canConfirm}
            busy={review.preparing || checkout.submission.phase === 'sending'}
            onClick={() => void review.prepareAndSubmit()}
          />
        </>
      )}
    </div>
  )
}
