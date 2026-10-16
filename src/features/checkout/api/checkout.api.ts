import { http } from '@/shared/api/http-client'
import { QuoteSchema, type Quote, type QuoteRequest } from '@/shared/contracts/cart'
import { OrderSchema, type CreateOrderRequest, type Order } from '@/shared/contracts/order'
import {
  ConnectWalletResponseSchema,
  WalletConnectionSchema,
  type ConnectCustomWalletRequest,
  type ConnectWalletResponse,
  type WalletConnection,
} from '@/shared/contracts/wallet'
import type { Network } from '@/shared/contracts/common'

export async function postQuote(body: QuoteRequest): Promise<Quote> {
  return QuoteSchema.parse((await http.post('/cart/quote', body)).data)
}

export async function connectWallet(
  walletId: string,
  network: Network,
): Promise<ConnectWalletResponse> {
  return ConnectWalletResponseSchema.parse(
    (await http.post(`/wallets/${walletId}/connect`, { network })).data,
  )
}

export async function connectCustomWallet(
  body: ConnectCustomWalletRequest,
): Promise<ConnectWalletResponse> {
  return ConnectWalletResponseSchema.parse((await http.post('/wallets/connect-custom', body)).data)
}

export async function disconnectWallet(walletId: string): Promise<void> {
  await http.post(`/wallets/${walletId}/disconnect`)
}

export async function getWalletConnection(
  walletId: string,
  signal?: AbortSignal,
): Promise<WalletConnection> {
  return WalletConnectionSchema.parse(
    (await http.get(`/wallets/${walletId}/connection`, { signal })).data,
  )
}

export async function createOrder(
  body: CreateOrderRequest,
  idempotencyKey: string,
): Promise<Order> {
  const { data } = await http.post('/orders', body, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })
  return OrderSchema.parse(data)
}
