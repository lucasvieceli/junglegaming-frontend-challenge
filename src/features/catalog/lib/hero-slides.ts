import type { NftSummary } from '@/shared/contracts/nft'
import { formatEth } from '@/shared/lib/money'
import { NETWORK_LABELS } from '@/shared/lib/network-label'

export type HeroVariant = 'desktop' | 'mobile'

export type HeroSlide = {
  eyebrow: string
  titleLines: string[]
  description: string
  cta: { label: string; nftId?: string }
}

const WELCOME: Record<HeroVariant, HeroSlide> = {
  desktop: {
    eyebrow: 'Bem-vindo à Kurio',
    titleLines: ['SEJA DONO DO FUTURO', 'DA ARTE DIGITAL'],
    description:
      'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
    cta: { label: 'EXPLORAR' },
  },
  mobile: {
    eyebrow: 'Bem-vindo à Kurio',
    titleLines: ['SEJA DONO DA CULTURA DIGITAL'],
    description: 'Descubra NFTs selecionados de criadores do mundo todo.',
    cta: { label: 'EXPLORAR' },
  },
}

export function heroSlide(
  item: NftSummary | undefined,
  index: number,
  variant: HeroVariant,
): HeroSlide {
  if (index === 0 || !item) return WELCOME[variant]
  const price = formatEth(item.price)
  return {
    eyebrow: variant === 'desktop' ? `Em destaque · ${item.collection.name}` : 'Em destaque',
    titleLines: [item.name.toUpperCase()],
    description:
      variant === 'desktop'
        ? `Peça da coleção ${item.collection.name} na rede ${NETWORK_LABELS[item.network]}, a partir de ${price}. Edições limitadas para colecionadores que querem arte digital com procedência.`
        : `${item.collection.name} · ${price}`,
    cta: { label: 'VER NFT', nftId: item.id },
  }
}

export function heroSlideAnimation(direction: 'next' | 'prev' | null): string {
  if (!direction) return ''
  return direction === 'next'
    ? 'animate-in fade-in-0 slide-in-from-right-6 duration-500 ease-out'
    : 'animate-in fade-in-0 slide-in-from-left-6 duration-500 ease-out'
}
