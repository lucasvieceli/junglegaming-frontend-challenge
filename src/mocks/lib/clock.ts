export function now(): Date {
  return new Date()
}

export function nowIso(): string {
  return now().toISOString()
}

const HOUR = 3_600_000
const DAY = 24 * HOUR

export function hoursAgo(hours: number, from: Date = now()): string {
  return new Date(from.getTime() - hours * HOUR).toISOString()
}

export function daysAgo(days: number, from: Date = now()): string {
  return new Date(from.getTime() - days * DAY).toISOString()
}

export function daysFromNow(days: number, from: Date = now()): string {
  return new Date(from.getTime() + days * DAY).toISOString()
}

export function addMs(ms: number, from: Date = now()): string {
  return new Date(from.getTime() + ms).toISOString()
}
