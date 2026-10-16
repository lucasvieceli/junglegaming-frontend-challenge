import axios from 'axios'

import { env } from '@/app/env'

import { installInterceptors } from './interceptors'

export const http = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 8000,
  // The fetch adapter implements timeouts with setTimeout, so Playwright's clock can control them.
  adapter: 'fetch',
  headers: { Accept: 'application/json' },
})

installInterceptors(http)
