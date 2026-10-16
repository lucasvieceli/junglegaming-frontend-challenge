import { BrandWordmark } from './BrandWordmark'
import { CartLink } from './CartLink'
import { HeaderAuthButton } from './HeaderAuthButton'
import { HeaderSearchButton } from './HeaderSearchButton'
import { MainNav } from './MainNav'

type SiteHeaderProps = {
  cartCount: number
  userName: string | null
  onSearch: () => void
  withDivider: boolean
}

export function SiteHeader({ cartCount, userName, onSearch, withDivider }: SiteHeaderProps) {
  return (
    <header className="hidden lg:block">
      <div className="flex items-start justify-between">
        <BrandWordmark />
        <MainNav />
        <div className="flex items-center gap-7">
          <HeaderSearchButton onClick={onSearch} />
          <CartLink count={cartCount} />
          <HeaderAuthButton userName={userName} />
        </div>
      </div>
      {withDivider && <div aria-hidden="true" className="hairline -mb-px" />}
    </header>
  )
}
