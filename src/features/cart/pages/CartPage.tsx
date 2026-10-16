import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb'
import { MobileScreenHeader } from '@/shared/components/layout/MobileScreenHeader'
import { RelatedNftsSection } from '@/shared/components/nft/RelatedNftsSection'

import { useCart } from '../api/useCart'
import { useTrendingNfts } from '../api/useTrendingNfts'
import { CartChangeNotice } from '../components/CartChangeNotice'
import { CartRowMobile } from '../components/CartRowMobile'
import { CartSkeleton } from '../components/CartSkeleton'
import { CartSummary } from '../components/CartSummary'
import { CartSummaryMobile } from '../components/CartSummaryMobile'
import { CartTable } from '../components/CartTable'
import { EmptyCart } from '../components/EmptyCart'

export function CartPage() {
  const cart = useCart()
  const trending = useTrendingNfts()
  const data = cart.data

  return (
    <div className="flex flex-1 flex-col gap-10 max-lg:px-1 lg:gap-24 lg:pt-8">
      <div className="flex flex-1 flex-col gap-3">
        <Breadcrumb
          items={[
            { label: 'Início', to: '/' },
            { label: 'Mercado', to: '/', hash: 'catalog' },
            { label: 'Carrinho' },
          ]}
        />
        <h1 className="sr-only max-lg:hidden">Carrinho de NFTs</h1>
        <MobileScreenHeader title="Carrinho de NFTs" titleInset="wide" />
        {cart.isPending && <CartSkeleton />}
        {cart.isError && !data && (
          <ErrorState
            title="Não foi possível carregar o carrinho"
            onRetry={() => void cart.refetch()}
            isRetrying={cart.isFetching}
          />
        )}
        {data && data.items.length === 0 && <EmptyCart />}
        {data && data.items.length > 0 && (
          <>
            <CartChangeNotice cart={data} />
            <div className="hidden justify-between gap-8 lg:flex">
              <CartTable cart={data} />
              <CartSummary cart={data} />
            </div>
            <ul aria-label="Itens do carrinho" className="flex flex-col gap-5 lg:hidden">
              {data.items.map((item) => (
                <CartRowMobile key={item.id} item={item} />
              ))}
            </ul>
            <div className="flex flex-1 flex-col lg:hidden">
              <CartSummaryMobile cart={data} />
            </div>
          </>
        )}
      </div>
      <div className="hidden lg:block">
        <RelatedNftsSection
          title="Colecionadores também viram"
          items={trending.data}
          variant="cart"
        />
      </div>
    </div>
  )
}
