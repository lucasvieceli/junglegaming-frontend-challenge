import { CheckIcon } from '@/shared/components/icons/CheckIcon'
import { shortAddress } from '@/shared/lib/short-address'

import type { WalletConnectionState } from '../lib/wallet-choice'

type WalletOptionStatusProps = {
  state: WalletConnectionState
  canConnect: boolean
  onConnect: () => void
  onDisconnect: () => void
}

const ACTION =
  'type-c-12-bold cursor-pointer text-accent hover:underline disabled:cursor-not-allowed disabled:opacity-50'

export function WalletOptionStatus({
  state,
  canConnect,
  onConnect,
  onDisconnect,
}: WalletOptionStatusProps) {
  return (
    <div
      data-testid="wallet-connection"
      data-state={state.status}
      className="flex shrink-0 flex-col items-end gap-0.5 text-right"
    >
      <p aria-live="polite" className="type-c-12 empty:hidden">
        {state.status === 'connecting' && (
          <span className="flex items-center gap-1.5 text-text-secondary">
            <span
              aria-hidden="true"
              className="size-3 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none"
            />
            Conectando…
          </span>
        )}
        {state.status === 'connected' && (
          <span className="flex items-center gap-1.5 text-success">
            <CheckIcon aria-hidden="true" className="size-3" />
            <span className="sr-only">Carteira conectada:</span>
            {shortAddress(state.address)}
          </span>
        )}
        {state.status === 'rejected' && <span className="text-coral">{state.message}</span>}
        {state.status === 'disconnected' && <span className="text-coral">Desconectada</span>}
      </p>
      {state.status === 'connected' && (
        <button type="button" onClick={onDisconnect} className={ACTION}>
          Desconectar
        </button>
      )}
      {state.status !== 'connected' && state.status !== 'connecting' && (
        <button type="button" onClick={onConnect} disabled={!canConnect} className={ACTION}>
          {state.status === 'idle' ? 'Conectar' : 'Tentar de novo'}
        </button>
      )}
    </div>
  )
}
