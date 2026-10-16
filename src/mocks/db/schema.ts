import type { Coupon, Quote } from '@/shared/contracts/cart'
import type { EthAmount, Network } from '@/shared/contracts/common'
import type { NftDetail } from '@/shared/contracts/nft'
import type { Order, OrderStatus } from '@/shared/contracts/order'
import type { User } from '@/shared/contracts/auth'
import type { Wallet } from '@/shared/contracts/wallet'

export interface DbUser extends User {
  passwordHash: string
  salt: string
}

export interface DbSession {
  token: string
  userId: string
  expiresAt: string
  ttlMs: number
}

export interface DbCartItem {
  id: string
  nftId: string
  editionId: string
  quantity: number
  lastSeenPrice: EthAmount
  lastSeenQuantity: number
}

export interface DbCart {
  id: string
  ownerKey: string
  items: DbCartItem[]
  couponCode: string | null
  version: number
  updatedAt: string
}

export interface DbCoupon extends Coupon {
  expiresAt: string | null
}

export interface DbQuote extends Quote {
  ownerKey: string
  feeNetwork: Network
}

export interface DbOrder extends Order {
  settlement: { outcome: Exclude<OrderStatus, 'pending'>; settleAt: string; reason?: string } | null
  cartOwnerKey: string
}

export interface DbWalletConnection {
  walletId: string
  userId: string
  network: Network
  status: 'connected' | 'disconnected'
  connectedAt: string
}

export interface MockDb {
  meta: { seedVersion: number; counters: Record<string, number> }
  users: Record<string, DbUser>
  sessions: Record<string, DbSession>
  nfts: Record<string, NftDetail>
  featured: { hero: string[]; sidebar: string }
  favorites: Record<string, string[]>
  carts: Record<string, DbCart>
  coupons: Record<string, DbCoupon>
  quotes: Record<string, DbQuote>
  orders: Record<string, DbOrder>
  idempotency: Record<string, { userId: string; bodyHash: string; orderId: string }>
  wallets: Record<string, Wallet>
  walletConnections: Record<string, DbWalletConnection>
  events: { lastVersionByResource: Record<string, number> }
}
