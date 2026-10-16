import type { MockDb } from './schema'

export const DB_STORAGE_KEY = 'kurio.mockdb.v1'

let saveTimer: ReturnType<typeof setTimeout> | undefined
let pending: MockDb | null = null

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    if (pending) persistNow(pending)
  })
}

export function loadPersistedDb(): MockDb | null {
  try {
    const raw = window.localStorage.getItem(DB_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as MockDb) : null
  } catch {
    return null
  }
}

export function schedulePersist(db: MockDb): void {
  clearTimeout(saveTimer)
  pending = db
  saveTimer = setTimeout(() => persistNow(db), 150)
}

export function persistNow(db: MockDb): void {
  clearTimeout(saveTimer)
  pending = null
  try {
    window.localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db))
  } catch {
    // storage unavailable: in-memory only
  }
}

export function clearPersistedDb(): void {
  clearTimeout(saveTimer)
  pending = null
  try {
    window.localStorage.removeItem(DB_STORAGE_KEY)
  } catch {
    // ignore
  }
}
