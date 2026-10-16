import type { Edition } from '@/shared/contracts/nft'

const PREFERRED_LABEL = '1/50'

export function maxQuantityOf(edition: Edition): number {
  return edition.available === null
    ? edition.maxPerOrder
    : Math.min(edition.maxPerOrder, edition.available)
}

export function isSoldOut(edition: Edition): boolean {
  return maxQuantityOf(edition) === 0
}

export function defaultEdition(editions: Edition[]): Edition | undefined {
  const available = editions.filter((edition) => !isSoldOut(edition))
  return available.find((edition) => edition.label === PREFERRED_LABEL) ?? available[0]
}
