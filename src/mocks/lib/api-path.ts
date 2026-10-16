import { env } from '@/app/env'

export function api(path: string): string {
  return `${env.VITE_API_URL}${path}`
}
