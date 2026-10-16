import { SEED_VERSION, buildSeed } from './seed'
import { clearPersistedDb, loadPersistedDb, persistNow, schedulePersist } from './persistence'
import type { MockDb } from './schema'

let db: MockDb | null = null
const listeners = new Set<() => void>()

export async function loadDb(): Promise<MockDb> {
  const persisted = loadPersistedDb()
  db = persisted && persisted.meta?.seedVersion === SEED_VERSION ? persisted : await buildSeed()
  persistNow(db)
  return db
}

export function getDb(): MockDb {
  if (!db) throw new Error('[mock] DB not initialized: call loadDb() in startMocks()')
  return db
}

export function transact<T>(mutator: (draft: MockDb) => T): T {
  const current = getDb()
  const result = mutator(current)
  schedulePersist(current)
  listeners.forEach((listener) => listener())
  return result
}

export async function resetDb(): Promise<MockDb> {
  clearPersistedDb()
  db = await buildSeed()
  persistNow(db)
  listeners.forEach((listener) => listener())
  return db
}

export function subscribeDb(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function nextId(prefix: string): string {
  return transact((draft) => {
    const value = (draft.meta.counters[prefix] ?? 0) + 1
    draft.meta.counters[prefix] = value
    return `${prefix}_${String(value).padStart(4, '0')}`
  })
}

export function bumpResourceVersion(key: string, atLeast = 0): number {
  return transact((draft) => {
    const next = Math.max((draft.events.lastVersionByResource[key] ?? 0) + 1, atLeast)
    draft.events.lastVersionByResource[key] = next
    return next
  })
}
