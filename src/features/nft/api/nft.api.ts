import { http } from '@/shared/api/http-client'
import { NftDetailSchema, type NftDetail } from '@/shared/contracts/nft'

export async function getNft(id: string, signal?: AbortSignal): Promise<NftDetail> {
  const { data } = await http.get(`/nfts/${encodeURIComponent(id)}`, { signal })
  return NftDetailSchema.parse(data)
}
