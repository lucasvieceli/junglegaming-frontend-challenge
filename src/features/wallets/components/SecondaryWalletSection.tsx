import { useState } from 'react'

import type { Wallet } from '@/shared/contracts/wallet'
import { cn } from '@/shared/lib/cn'

import { WalletForm } from './WalletForm'
import { WalletSectionHeading } from './WalletSectionHeading'

type SecondaryWalletSectionProps = {
  userId: string
  primary: Wallet | undefined
  secondary: Wallet | undefined
  onSaved: () => void
}

export function SecondaryWalletSection({
  userId,
  primary,
  secondary,
  onSaved,
}: SecondaryWalletSectionProps) {
  const [open, setOpen] = useState(Boolean(secondary))
  const [sameAsPrimary, setSameAsPrimary] = useState(secondary?.sameAsPrimary ?? false)

  const toggleSame = () => {
    setSameAsPrimary((value) => !value)
    setOpen(true)
  }

  return (
    <section aria-labelledby="secondary-wallet" className="flex flex-col gap-3">
      <WalletSectionHeading
        id="secondary-wallet"
        title="Carteira secundária"
        actions={
          <div className="flex items-center gap-2 lg:w-[343px]">
            <button
              type="button"
              role="checkbox"
              aria-checked={sameAsPrimary}
              disabled={!primary}
              onClick={toggleSame}
              className="type-b-14 flex cursor-pointer items-center gap-2 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                aria-hidden="true"
                className="flex size-4 items-center justify-center rounded-full border-[1.5px] border-primary"
              >
                <span
                  className={cn('size-2 rounded-full bg-primary', !sameAsPrimary && 'hidden')}
                />
              </span>
              Igual à carteira principal
            </button>
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="type-b-16-medium-16 cursor-pointer text-accent hover:underline"
              >
                Adicionar
              </button>
            )}
          </div>
        }
      />
      {open ? (
        <WalletForm
          key={sameAsPrimary ? 'same' : 'own'}
          userId={userId}
          kind="secondary"
          existing={secondary}
          copyFrom={sameAsPrimary ? primary : undefined}
          onSaved={onSaved}
        />
      ) : (
        <p className="type-b-14-15 text-text-secondary">
          Você ainda não adicionou uma carteira secundária.
        </p>
      )}
    </section>
  )
}
