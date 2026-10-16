import type { NftDetail } from '@/shared/contracts/nft'

export function TokenMeta({ nft }: { nft: NftDetail }) {
  return (
    <dl className="type-b-15 flex flex-col gap-3 text-secondary">
      <div className="flex gap-1">
        <dt>ID do token:</dt>
        <dd>{nft.tokenId}</dd>
      </div>
      <div className="flex gap-1">
        <dt>Coleção:</dt>
        <dd>{nft.collection.name}</dd>
      </div>
      <div className="flex gap-1">
        <dt>Atributos:</dt>
        <dd>{nft.attributes.join(', ')}</dd>
      </div>
    </dl>
  )
}
