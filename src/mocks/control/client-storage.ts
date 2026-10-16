import type { StoredSession } from '@/shared/contracts/auth'

const CLIENT_KEYS = ['kurio.session', 'kurio.guestId']
const CLIENT_PREFIXES = ['kurio.checkout.']

export function clearClientStorage(): void {
  try {
    CLIENT_KEYS.forEach((key) => window.localStorage.removeItem(key))
    for (const store of [window.localStorage, window.sessionStorage]) {
      Object.keys(store)
        .filter((key) => CLIENT_PREFIXES.some((prefix) => key.startsWith(prefix)))
        .forEach((key) => store.removeItem(key))
    }
  } catch {
    // ignore
  }
}

export function writeClientSession(session: StoredSession): void {
  try {
    window.localStorage.setItem('kurio.session', JSON.stringify(session))
  } catch {
    // ignore
  }
}
