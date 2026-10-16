const DIVIDER_PREFIXES = ['/login', '/register', '/account', '/favorites']

export function headerHasDivider(pathname: string): boolean {
  return pathname === '/' || DIVIDER_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function mobileBottomInset(pathname: string, withTabBar: boolean): string {
  if (pathname.startsWith('/nfts/')) return 'pb-[188px] lg:pb-6'
  return withTabBar ? 'pb-[150px] lg:pb-6' : 'pb-6'
}

const FULL_SCREEN_MOBILE = ['/login', '/register', '/cart', '/checkout']

export function hidesFooterOnMobile(pathname: string): boolean {
  return FULL_SCREEN_MOBILE.some((prefix) => pathname.startsWith(prefix))
}

export function hidesFooter(pathname: string): boolean {
  return pathname.startsWith('/account')
}
