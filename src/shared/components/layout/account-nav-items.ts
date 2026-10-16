import type { ComponentType, SVGProps } from 'react'

import { ActivityIcon } from '@/shared/components/icons/ActivityIcon'
import { DangerIcon } from '@/shared/components/icons/DangerIcon'
import { DownloadIcon } from '@/shared/components/icons/DownloadIcon'
import { HeartIcon } from '@/shared/components/icons/HeartIcon'
import { LocationIcon } from '@/shared/components/icons/LocationIcon'
import { ShoppingIcon } from '@/shared/components/icons/ShoppingIcon'
import { UserIcon } from '@/shared/components/icons/UserIcon'

type AccountNavItem = {
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  iconSize: string
  to?: '/account/profile' | '/account/wallets' | '/favorites'
}

const ICON_18 = 'size-[18px]'

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { label: 'Dados do perfil', Icon: UserIcon, iconSize: ICON_18, to: '/account/profile' },
  { label: 'Carteiras', Icon: LocationIcon, iconSize: 'size-5', to: '/account/wallets' },
  { label: 'Atividade', Icon: ShoppingIcon, iconSize: ICON_18 },
  { label: 'Lista de interesse', Icon: HeartIcon, iconSize: 'size-4', to: '/favorites' },
  { label: 'Ofertas', Icon: ActivityIcon, iconSize: ICON_18 },
  { label: 'Arquivos baixados', Icon: DownloadIcon, iconSize: ICON_18 },
  { label: 'Suporte', Icon: DangerIcon, iconSize: ICON_18 },
]
