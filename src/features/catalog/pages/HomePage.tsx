import type { CatalogTab } from '@/shared/contracts/nft'
import { Tabs, TabsContent } from '@/shared/ui/tabs'

import { useFeaturedNfts } from '../api/useFeaturedNfts'
import { useNftList } from '../api/useNftList'
import { CatalogFilters } from '../components/CatalogFilters'
import { CatalogResults } from '../components/CatalogResults'
import { CatalogToolbar } from '../components/CatalogToolbar'
import { FeaturedNftBanner } from '../components/FeaturedNftBanner'
import { HeroBanner } from '../components/HeroBanner'
import { HeroBannerMobile } from '../components/HeroBannerMobile'
import { BlogSection } from '../components/BlogSection'
import { MobileFiltersSheet } from '../components/MobileFiltersSheet'
import { PromoCards } from '../components/PromoCards'
import { SearchBarMobile } from '../components/SearchBarMobile'
import { useCatalogSearch } from '../hooks/useCatalogSearch'
import { CLEARED_FILTERS, type CatalogSearch } from '../lib/catalog-search'

export function HomePage({ search }: { search: CatalogSearch }) {
  const { setFilter } = useCatalogSearch(search)
  const list = useNftList(search)
  const featured = useFeaturedNfts()
  const facets = list.data?.facets

  return (
    <div className="flex flex-col gap-10 pt-4 lg:gap-24 lg:pt-8">
      <div className="flex flex-col gap-4 lg:gap-24">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 lg:hidden">
            <SearchBarMobile
              value={search.q}
              onSearch={(q) => setFilter({ q }, { replace: true })}
            />
            <MobileFiltersSheet facets={facets} search={search} onChange={setFilter} />
          </div>
          <HeroBanner items={featured.data?.hero ?? []} />
          <HeroBannerMobile items={featured.data?.hero ?? []} />
        </div>

        <section
          id="catalog"
          tabIndex={-1}
          aria-label="Catálogo de NFTs"
          className="flex scroll-mt-6 items-start gap-12 outline-none"
        >
          <h2 className="sr-only">Catálogo de NFTs</h2>
          <aside aria-label="Filtros" className="hidden w-[310px] shrink-0 flex-col gap-6 lg:flex">
            <CatalogFilters facets={facets} search={search} onChange={setFilter} />
            {featured.data && <FeaturedNftBanner nft={featured.data.sidebar} />}
          </aside>
          <Tabs
            value={search.tab}
            onValueChange={(tab) => setFilter({ tab: tab as CatalogTab })}
            className="min-w-0 flex-1 gap-4 lg:gap-8"
          >
            <CatalogToolbar sort={search.sort} onSortChange={(sort) => setFilter({ sort })} />
            <TabsContent value={search.tab}>
              <CatalogResults
                query={list}
                page={search.page}
                onClearFilters={() => setFilter(CLEARED_FILTERS)}
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>

      <PromoCards />
      <BlogSection />
    </div>
  )
}
