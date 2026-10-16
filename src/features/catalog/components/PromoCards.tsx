import { PROMOS } from '../lib/home-content'
import { PromoCard } from './PromoCard'

export function PromoCards() {
  return (
    <section aria-labelledby="promos-title" className="grid gap-6 lg:grid-cols-2 lg:gap-7">
      <h2 id="promos-title" className="sr-only">
        Coleções em destaque
      </h2>
      {PROMOS.map((promo) => (
        <PromoCard key={promo.title[0]} promo={promo} />
      ))}
    </section>
  )
}
