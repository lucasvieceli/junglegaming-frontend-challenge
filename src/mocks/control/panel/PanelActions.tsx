import { Button } from '@/shared/ui/button'

import type { KurioControlApi } from '../window-api'
import { currentOwnerKey } from '../current-owner'

type PanelActionsProps = {
  control: KurioControlApi
  pendingOrderId: string | null
  onDone: (message: string) => void
}

const reload = () => window.location.reload()

export function PanelActions({ control, pendingOrderId, onDone }: PanelActionsProps) {
  const raisePrice = () => {
    const ownerKey = currentOwnerKey()
    const nftId = ownerKey ? control.getDb().carts[ownerKey]?.items[0]?.nftId : undefined
    if (!nftId) return onDone('Carrinho vazio: adicione um NFT primeiro.')
    const price = Number(control.getDb().nfts[nftId]?.price ?? 0)
    control.emit('nft.updated', { nftId, price: (price * 1.1).toFixed(3) })
    onDone('nft.updated emitido pelo servidor mock (+10%).')
  }

  const actions: Array<{ label: string; run: () => void | Promise<void> }> = [
    {
      label: 'Resetar dados',
      run: async () => (await control.reset({ scenario: control.getScenario() }), reload()),
    },
    { label: 'Entrar como Ana', run: () => (control.loginAs('ana@kurio.test'), reload()) },
    { label: 'Entrar como Bruno', run: () => (control.loginAs('bruno@kurio.test'), reload()) },
    { label: 'Expirar sessão', run: () => (control.expireSession(), onDone('Sessões expiradas.')) },
    { label: 'Preço +10% (1º item do carrinho)', run: raisePrice },
    {
      label: 'Derrubar socket',
      run: () => (control.dropSocket(), onDone('Conexões fechadas pelo servidor.')),
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          radius="xs"
          onClick={() => void action.run()}
          className="type-b-14-medium"
        >
          {action.label}
        </Button>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          radius="xs"
          className="type-b-14-bold min-w-0 px-2"
          disabled={!pendingOrderId}
          onClick={() =>
            pendingOrderId &&
            (control.settleOrder(pendingOrderId, 'confirmed'), onDone('Pedido confirmado.'))
          }
        >
          Confirmar pedido
        </Button>
        <Button
          variant="outline"
          radius="xs"
          className="type-b-14-medium min-w-0 px-2"
          disabled={!pendingOrderId}
          onClick={() =>
            pendingOrderId &&
            (control.settleOrder(pendingOrderId, 'declined'), onDone('Pedido recusado.'))
          }
        >
          Recusar pedido
        </Button>
      </div>
    </div>
  )
}
