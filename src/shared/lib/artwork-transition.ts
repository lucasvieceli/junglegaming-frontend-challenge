import type { CSSProperties } from 'react'

const NAME = 'nft-artwork'
const ATTRIBUTE = 'data-artwork-transition'

export const artworkTargetProps = {
  [ATTRIBUTE]: '',
  style: { viewTransitionName: NAME } satisfies CSSProperties,
}

export function markArtworkSource(element: HTMLElement | null) {
  for (const target of document.querySelectorAll<HTMLElement>(`[${ATTRIBUTE}]`)) {
    target.style.viewTransitionName = 'none'
  }
  if (element) element.style.viewTransitionName = NAME
}
