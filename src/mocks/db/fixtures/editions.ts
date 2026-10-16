import type { Edition } from '@/shared/contracts/nft'

export type EditionPreset = 'full' | 'limited' | 'unique' | 'open'
export type Stock = 'normal' | 'low' | 'sold_out'

const EDITION_SETS: Record<
  EditionPreset,
  Array<Pick<Edition, 'id' | 'label' | 'supply' | 'maxPerOrder'>>
> = {
  full: [
    { id: 'ed_1of1', label: '1/1', supply: 1, maxPerOrder: 1 },
    { id: 'ed_1of10', label: '1/10', supply: 10, maxPerOrder: 10 },
    { id: 'ed_1of50', label: '1/50', supply: 50, maxPerOrder: 20 },
    { id: 'ed_open', label: 'ABERTA', supply: null, maxPerOrder: 20 },
  ],
  limited: [
    { id: 'ed_1of10', label: '1/10', supply: 10, maxPerOrder: 10 },
    { id: 'ed_1of50', label: '1/50', supply: 50, maxPerOrder: 20 },
  ],
  unique: [{ id: 'ed_1of1', label: '1/1', supply: 1, maxPerOrder: 1 }],
  open: [{ id: 'ed_open', label: 'ABERTA', supply: null, maxPerOrder: 20 }],
}

export function buildEditions(preset: EditionPreset, stock: Stock): Edition[] {
  return EDITION_SETS[preset].map((edition) => {
    if (stock === 'sold_out') return { ...edition, available: 0 }
    if (edition.supply === null) return { ...edition, available: null }
    if (stock === 'low') return { ...edition, available: 1 }
    return { ...edition, available: edition.supply }
  })
}
