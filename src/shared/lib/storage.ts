import type { z } from 'zod'

const PREFIX = 'kurio.'

type StorageKind = 'local' | 'session'

function getStore(kind: StorageKind): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function readJson<T>(
  key: string,
  schema: z.ZodType<T>,
  kind: StorageKind = 'local',
): T | null {
  try {
    const raw = getStore(kind)?.getItem(PREFIX + key)
    if (raw == null) return null
    const parsed = schema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function writeJson(key: string, value: unknown, kind: StorageKind = 'local'): void {
  try {
    getStore(kind)?.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private mode, quota): continue without persistence.
  }
}

export function removeKey(key: string, kind: StorageKind = 'local'): void {
  try {
    getStore(kind)?.removeItem(PREFIX + key)
  } catch {
    // Storage unavailable (private mode, quota): continue without persistence.
  }
}

export function removeKeysWithPrefix(prefix: string, kind: StorageKind = 'local'): void {
  const store = getStore(kind)
  if (!store) return
  Object.keys(store)
    .filter((key) => key.startsWith(PREFIX + prefix))
    .forEach((key) => store.removeItem(key))
}
