import { StoredSessionSchema, type AuthResponse, type User } from '@/shared/contracts/auth'
import { readJson, removeKey, writeJson } from '@/shared/lib/storage'

export type SessionStatus = 'loading' | 'guest' | 'authenticated' | 'expired'

export type SessionState = {
  status: SessionStatus
  user: User | null
  token: string | null
  expiresAt: string | null
}

const STORAGE_KEY = 'session'
const GUEST: SessionState = { status: 'guest', user: null, token: null, expiresAt: null }

function initialState(): SessionState {
  const stored = readJson(STORAGE_KEY, StoredSessionSchema)
  return stored ? { status: 'loading', ...stored } : GUEST
}

// Storage is read only in boot(), after the API is ready (mocks may reset data or seed a session).
const BOOTING: SessionState = { status: 'loading', user: null, token: null, expiresAt: null }
let state: SessionState | null = null
function current(): SessionState {
  return state ?? BOOTING
}
const listeners = new Set<() => void>()

function setState(next: SessionState) {
  state = next
  if (next.user && next.token && next.expiresAt) {
    writeJson(STORAGE_KEY, { token: next.token, expiresAt: next.expiresAt, user: next.user })
  } else {
    removeKey(STORAGE_KEY)
  }
  listeners.forEach((listener) => listener())
}

export const sessionStore = {
  get: (): SessionState => current(),
  boot() {
    if (state) return
    setState(initialState())
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  authenticate(response: AuthResponse) {
    setState({
      status: 'authenticated',
      user: response.user,
      token: response.session.token,
      expiresAt: response.session.expiresAt,
    })
  },
  updateUser(user: User) {
    const now = current()
    if (now.status === 'authenticated') setState({ ...now, user })
  },
  clear() {
    setState(GUEST)
  },
  expire() {
    const { status } = current()
    if (status === 'authenticated' || status === 'loading') {
      setState({ ...GUEST, status: 'expired' })
    }
  },
  acknowledgeExpiry() {
    if (current().status === 'expired') setState(GUEST)
  },
}

export function isSessionPastExpiry(session: SessionState, now = Date.now()): boolean {
  return (
    session.status === 'authenticated' &&
    session.expiresAt !== null &&
    new Date(session.expiresAt).getTime() <= now
  )
}
