import { z } from 'zod'

export function parseSearch(searchStr: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(searchStr))
}

export function stringifySearch(search: Record<string, unknown>): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(','))
    } else {
      params.set(key, String(value))
    }
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function csvList<T extends z.ZodType<string>>(item: T) {
  return z.preprocess((value) => {
    const list = typeof value === 'string' ? value.split(',') : value
    if (!Array.isArray(list)) return undefined
    const clean = list.map((entry) => String(entry).trim()).filter(Boolean)
    return clean.length > 0 ? clean : undefined
  }, z.array(item).optional())
}
