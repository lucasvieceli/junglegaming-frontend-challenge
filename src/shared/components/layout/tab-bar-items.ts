import type { ComponentType, SVGProps } from 'react'

import { HeartTabIcon } from '@/shared/components/icons/HeartTabIcon'
import { HomeIcon } from '@/shared/components/icons/HomeIcon'
import { ShopIcon } from '@/shared/components/icons/ShopIcon'
import { UserTabIcon } from '@/shared/components/icons/UserTabIcon'

type TabItem = {
  to: '/' | '/favorites' | '/cart' | '/account/profile'
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  left: string
  isActive: (pathname: string) => boolean
}

export const TAB_BAR_ITEMS: TabItem[] = [
  { to: '/', label: 'Início', Icon: HomeIcon, left: '8.7%', isActive: (p) => p === '/' },
  {
    to: '/favorites',
    label: 'Favoritos',
    Icon: HeartTabIcon,
    left: '26.09%',
    isActive: (p) => p.startsWith('/favorites'),
  },
  {
    to: '/cart',
    label: 'Carrinho',
    Icon: ShopIcon,
    left: '70.53%',
    isActive: (p) => p.startsWith('/cart'),
  },
  {
    to: '/account/profile',
    label: 'Minha conta',
    Icon: UserTabIcon,
    left: '85.51%',
    isActive: (p) => p.startsWith('/account'),
  },
]

const TAB_BAR_PREFIXES = ['/favorites', '/account']

export function showsTabBar(pathname: string): boolean {
  return pathname === '/' || TAB_BAR_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}
