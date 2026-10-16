import type { NftUpdatedPayload } from '@/shared/contracts/events'
import type { NftDetail, NftListResponse, NftSummary } from '@/shared/contracts/nft'

export function patchSummary<T extends NftSummary>(
  nft: T,
  payload: NftUpdatedPayload,
  version: number,
): T {
  if (nft.id !== payload.nftId || nft.version >= version) return nft
  return {
    ...nft,
    price: payload.price,
    previousPrice: payload.previousPrice,
    availability: payload.availability,
    version,
  }
}

export function patchDetail(
  nft: NftDetail,
  payload: NftUpdatedPayload,
  version: number,
): NftDetail {
  const patched = patchSummary(nft, payload, version)
  if (patched === nft) return nft
  const available = new Map(payload.editions.map((edition) => [edition.id, edition.available]))
  return {
    ...patched,
    editions: nft.editions.map((edition) =>
      available.has(edition.id)
        ? { ...edition, available: available.get(edition.id) ?? null }
        : edition,
    ),
  }
}

export function patchList(
  list: NftListResponse,
  payload: NftUpdatedPayload,
  version: number,
): NftListResponse {
  return { ...list, items: list.items.map((item) => patchSummary(item, payload, version)) }
}
