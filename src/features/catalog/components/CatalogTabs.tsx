import type { CatalogTab } from '@/shared/contracts/nft'
import { cn } from '@/shared/lib/cn'
import { TabsList, TabsTrigger } from '@/shared/ui/tabs'

import { CATALOG_TABS } from '../lib/catalog-options'

export function CatalogTabs() {
  return (
    <TabsList
      aria-label="Listas do catálogo"
      className="gap-1 overflow-x-auto lg:gap-5 lg:overflow-visible"
      indicatorClassName="lg:top-[23px] lg:bottom-auto"
    >
      {CATALOG_TABS.map((tab, tabIndex) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value satisfies CatalogTab}
          className={cn(
            'type-b-14 pb-0.5 data-[state=active]:font-bold lg:type-b-15-medium lg:border-b-0 lg:pb-0 lg:data-[state=active]:font-medium',
            tabIndex > 1 && 'ml-3 lg:ml-0',
          )}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
