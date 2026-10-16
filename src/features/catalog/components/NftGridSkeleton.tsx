import { NftCardSkeleton } from '@/shared/components/nft/NftCardSkeleton'

import { NftGrid } from './NftGrid'

export function NftGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <NftGrid>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <NftCardSkeleton />
        </li>
      ))}
    </NftGrid>
  )
}
