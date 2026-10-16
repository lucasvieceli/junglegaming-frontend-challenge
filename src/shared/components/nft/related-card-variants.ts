export const RELATED_CARD_VARIANTS = {
  detail: { card: 'gap-3', text: '', art: 'rounded-[13px]' },
  cart: { card: 'gap-2', text: 'gap-2', art: 'rounded-[17px]' },
}

export type RelatedCardVariant = keyof typeof RELATED_CARD_VARIANTS
