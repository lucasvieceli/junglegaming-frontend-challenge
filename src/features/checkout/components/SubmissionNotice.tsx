import { InlineAlert } from '@/shared/components/feedback/InlineAlert'
import { Button } from '@/shared/ui/button'

import type { CheckoutController } from '../hooks/useCheckoutController'

export function SubmissionNotice({ submission }: { submission: CheckoutController['submission'] }) {
  if (submission.phase === 'unconfirmed') {
    return (
      <InlineAlert
        tone="warning"
        title="Há uma confirmação pendente"
        action={
          <Button size="sm" className="type-b-14-bold" onClick={() => void submission.resend()}>
            Reenviar
          </Button>
        }
      >
        Não recebemos a confirmação do pedido. O reenvio usa a mesma chave, sem risco de compra
        duplicada.
      </InlineAlert>
    )
  }
  if (submission.phase === 'failed') {
    return (
      <InlineAlert
        tone="error"
        title="Não foi possível concluir o pedido"
        action={
          <Button
            size="sm"
            variant="outline"
            className="type-b-14-bold"
            onClick={submission.cancel}
          >
            Cancelar tentativa
          </Button>
        }
      >
        Os dados enviados não conferem com a tentativa anterior. Cancele para começar uma nova.
      </InlineAlert>
    )
  }
  if (submission.phase === 'sending') {
    return (
      <p role="status" className="type-b-14 text-text-secondary">
        Enviando pedido…
      </p>
    )
  }
  return null
}
