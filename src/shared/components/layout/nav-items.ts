export type NavKey = 'home' | 'market' | 'creators' | 'learn'

export const NAV_ITEMS: Array<{ key: NavKey; label: string; to?: string; hash?: string }> = [
  { key: 'home', label: 'Início', to: '/' },
  { key: 'market', label: 'Mercado', to: '/', hash: 'catalog' },
  { key: 'creators', label: 'Criadores' },
  { key: 'learn', label: 'Aprenda' },
]

const MARKET_PATHS = ['/nfts', '/cart', '/checkout', '/orders']

export function activeNavKey(pathname: string): NavKey {
  return MARKET_PATHS.some((prefix) => pathname.startsWith(prefix)) ? 'market' : 'home'
}
