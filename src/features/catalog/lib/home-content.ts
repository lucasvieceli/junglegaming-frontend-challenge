import type { NftImageKey } from '@/shared/lib/nft-image'

export const PROMOS: Array<{
  title: [string, string]
  text: string
  imageKey: NftImageKey
  search: { tab?: 'new'; categories?: string[] }
  layout: { right: string; textWidth: string }
}> = [
  {
    title: ['Lançamentos gênesis', 'de edição limitada'],
    text: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    imageKey: 'emerald-ape',
    search: { tab: 'new' },
    layout: { right: 'lg:pr-[30px]', textWidth: 'lg:w-[263px]' },
  },
  {
    title: ['Arte digital selecionada', 'e muito mais'],
    text: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    imageKey: 'ivory-baron',
    search: { categories: ['arte-digital'] },
    layout: { right: 'lg:pr-[35px]', textWidth: 'lg:w-[252px]' },
  },
]

export const BLOG_POSTS: Array<{
  meta: string
  title: string
  summary: string
  imageKey: NftImageKey
}> = [
  {
    meta: '12 de setembro  |  Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    summary: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    imageKey: 'ivory-baron',
  },
  {
    meta: '13 de setembro  |  Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    summary: 'Conheça criadores que moldam a cultura digital.',
    imageKey: 'emerald-ape',
  },
  {
    meta: '15 de setembro  |  Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    summary: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    imageKey: 'sage-nomad',
  },
  {
    meta: '15 de setembro  |  Leitura de 2 min',
    title: 'Como proteger sua carteira',
    summary: 'Proteja sua carteira, seus ativos e sua identidade.',
    imageKey: 'golden-beat',
  },
]
