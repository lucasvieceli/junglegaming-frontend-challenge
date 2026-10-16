import type { NftRow } from './nfts'
import { COLLECTIONS } from './catalog-taxonomy'

export function buildNftCopy(row: NftRow) {
  const collection = COLLECTIONS[row.collection]
  const networkName = { ethereum: 'Ethereum', polygon: 'Polygon', solana: 'Solana' }[row.network]
  return {
    about: `Um colecionável digital finalizado à mão da coleção ${collection.name}, verificado na ${networkName}, com arte desbloqueável e acesso para colecionadores.`,
    description: [
      `${row.name} é uma obra digital finalizada à mão da coleção ${collection.name}. Cada atributo fica armazenado nos metadados do token e verificado na ${networkName}. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
      `A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. ${collection.creator} recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.`,
    ].join('\n\n'),
    creator: collection.creator,
    contract: '0x7A42...19E8',
  }
}

export const REVIEW_TEMPLATES = [
  {
    author: 'Marina Costa',
    stars: 5,
    text: 'Acabamento impecável e a procedência ficou clara desde a compra.',
  },
  {
    author: 'Diego Ramos',
    stars: 4,
    text: 'Arte linda em alta resolução. O acesso aos lançamentos vale muito.',
  },
  {
    author: 'Júlia Prado',
    stars: 5,
    text: 'Uma das melhores peças da coleção. Recomendo para quem está começando.',
  },
] as const
