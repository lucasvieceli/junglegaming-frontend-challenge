import { http } from '@/shared/api/http-client'
import { CartSchema, type AddCartItemRequest, type Cart } from '@/shared/contracts/cart'
import { NftListResponseSchema, type NftSummary } from '@/shared/contracts/nft'

const cartPath = '/cart'
const itemPath = (itemId: string) => `${cartPath}/items/${encodeURIComponent(itemId)}`

async function parseCart(request: Promise<{ data: unknown }>): Promise<Cart> {
  const { data } = await request
  return CartSchema.parse(data)
}

export const addCartItem = (body: AddCartItemRequest) =>
  parseCart(http.post(`${cartPath}/items`, body))
export const updateCartItem = (itemId: string, quantity: number) =>
  parseCart(http.patch(itemPath(itemId), { quantity }))
export const removeCartItem = (itemId: string) => parseCart(http.delete(itemPath(itemId)))
export const applyCoupon = (code: string) => parseCart(http.post(`${cartPath}/coupon`, { code }))
export const removeCoupon = () => parseCart(http.delete(`${cartPath}/coupon`))

export async function getTrendingNfts(signal?: AbortSignal): Promise<NftSummary[]> {
  const { data } = await http.get('/nfts', { params: { tab: 'trending', pageSize: 7 }, signal })
  return NftListResponseSchema.parse(data).items
}
