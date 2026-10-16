import type { Network } from '@/shared/contracts/common'

export const queryKeys = {
  nfts: {
    all: ['nfts'] as const,
    lists: ['nfts', 'list'] as const,
    list: (params: object) => ['nfts', 'list', params] as const,
    detail: (id: string) => ['nfts', 'detail', id] as const,
    featured: ['nfts', 'featured'] as const,
  },
  favorites: (userId: string) => ['favorites', userId] as const,
  cart: (ownerKey: string) => ['cart', ownerKey] as const,
  quote: (ownerKey: string, cartVersion: number, coupon: string | null, network: Network | null) =>
    ['quote', ownerKey, cartVersion, coupon, network] as const,
  orders: {
    detail: (userId: string, id: string) => ['orders', userId, id] as const,
    list: (userId: string) => ['orders', userId, 'list'] as const,
  },
  me: (userId: string) => ['me', userId] as const,
  wallets: (userId: string) => ['wallets', userId] as const,
  walletConnection: (userId: string, walletId: string) =>
    ['wallets', userId, walletId, 'connection'] as const,
}
