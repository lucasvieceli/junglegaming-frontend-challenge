import type { Network } from '@/shared/contracts/common'

export const CATEGORIES = [
  { slug: 'arte-digital', name: 'Arte digital' },
  { slug: 'fotografia', name: 'Fotografia' },
  { slug: 'musica', name: 'Música' },
  { slug: 'arte-3d', name: 'Arte 3D' },
  { slug: 'colecionaveis', name: 'Colecionáveis' },
  { slug: 'generativa', name: 'Generativa' },
  { slug: 'jogos', name: 'Jogos' },
  { slug: 'assinaturas', name: 'Assinaturas' },
  { slug: 'utilidade', name: 'Utilidade' },
] as const

export const NETWORKS: Array<{ slug: Network; name: string }> = [
  { slug: 'ethereum', name: 'Ethereum' },
  { slug: 'polygon', name: 'Polygon' },
  { slug: 'solana', name: 'Solana' },
]

export const COLLECTIONS = {
  'kurio-apes': { name: 'Kurio Apes', creator: 'Nova Sato' },
  'sage-nomads': { name: 'Sage Nomads', creator: 'Rui Okada' },
  'ivory-court': { name: 'Ivory Court', creator: 'Lia Moraes' },
  'golden-frequency': { name: 'Golden Frequency', creator: 'Theo Vance' },
} as const
export type CollectionSlug = keyof typeof COLLECTIONS

export type CategorySlug = (typeof CATEGORIES)[number]['slug']
