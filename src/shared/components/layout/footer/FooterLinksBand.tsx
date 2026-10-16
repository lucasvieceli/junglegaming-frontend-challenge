import { WalletChip } from '@/shared/components/layout/WalletChip'

import { FOOTER_LINK_COLUMNS } from './footer-content'
import { FooterLinkColumn } from './FooterLinkColumn'
import { SocialLinks } from './SocialLinks'

export function FooterLinksBand() {
  return (
    <div className="grid grid-cols-1 gap-8 bg-surface-card sm:grid-cols-2 p-6 lg:flex lg:h-[236px] lg:items-start lg:gap-10 lg:p-8 xl:gap-[124px]">
      {FOOTER_LINK_COLUMNS.map((column) => (
        <FooterLinkColumn key={column.title} {...column} />
      ))}
      <div className="flex flex-col gap-8 sm:col-span-2 lg:w-[228px] lg:shrink-0">
        <div className="flex flex-col gap-5">
          <h2 className="type-b-18-bold text-foreground">Redes sociais</h2>
          <SocialLinks />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="type-b-18-bold text-foreground">Carteiras compatíveis</h2>
          <WalletChip className="w-full max-w-[228px]" />
        </div>
      </div>
    </div>
  )
}
