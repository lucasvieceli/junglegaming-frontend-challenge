import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { walletsQuery } from '@/shared/api/account-queries'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { useSession } from '@/shared/session/useSession'
import { Skeleton } from '@/shared/ui/skeleton'

import { SecondaryWalletSection } from '../components/SecondaryWalletSection'
import { WalletForm } from '../components/WalletForm'
import { WalletSectionHeading } from '../components/WalletSectionHeading'

export function WalletsPage({ redirect }: { redirect?: string }) {
  const userId = useSession().user?.id ?? ''
  const navigate = useNavigate()
  const wallets = useQuery({ ...walletsQuery(userId), enabled: Boolean(userId) })
  const onSaved = () => {
    if (redirect?.startsWith('/') && !redirect.startsWith('//')) void navigate({ href: redirect })
  }

  if (wallets.isError)
    return <ErrorState onRetry={() => void wallets.refetch()} isRetrying={wallets.isFetching} />
  if (!wallets.data) return <Skeleton className="h-[640px]" />
  const primary = wallets.data.find((wallet) => wallet.kind === 'primary')
  const secondary = wallets.data.find((wallet) => wallet.kind === 'secondary')

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Carteiras</h1>
      <section aria-labelledby="primary-wallet" className="flex flex-col gap-8">
        <WalletSectionHeading
          id="primary-wallet"
          title="Carteira principal"
          actions={
            <span className="type-b-16-medium-16 text-accent">
              {primary ? 'Editar' : 'Adicionar'}
            </span>
          }
          subtitle="Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados."
        />
        <WalletForm
          key={primary?.id ?? 'new'}
          userId={userId}
          kind="primary"
          existing={primary}
          onSaved={onSaved}
        />
      </section>
      <SecondaryWalletSection
        key={secondary?.id ?? 'none'}
        userId={userId}
        primary={primary}
        secondary={secondary}
        onSaved={onSaved}
      />
    </div>
  )
}
