import { z } from 'zod'

const EnvSchema = z.object({
  VITE_API_URL: z.string().min(1).default('/api'),
  VITE_SOCKET_URL: z.string().min(1).default('wss://realtime.kurio.local'),
  VITE_ENABLE_MOCKS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  VITE_DEFAULT_SCENARIO: z.string().min(1).default('default'),
  VITE_APP_URL: z.string().default('http://localhost:4173'),
})

export const env = EnvSchema.parse(import.meta.env)
export type Env = typeof env
