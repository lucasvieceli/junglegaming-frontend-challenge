import { z } from 'zod'

import { newId } from '@/shared/lib/id'
import { readJson, writeJson } from '@/shared/lib/storage'

const KEY = 'guestId'

export function getGuestId(): string {
  const stored = readJson(KEY, z.string().min(1))
  if (stored) return stored
  const id = newId()
  writeJson(KEY, id)
  return id
}
