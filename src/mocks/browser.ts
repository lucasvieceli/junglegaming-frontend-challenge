import { setupWorker } from 'msw/browser'

import { env } from '@/app/env'

import { createControlApi, type KurioControlApi } from './control/window-api'
import { clearClientStorage } from './control/client-storage'
import { getDb, loadDb, resetDb } from './db/db'
import { rescheduleSettlements } from './lib/orders'
import { seedRandom } from './lib/prng'
import { handlers } from './handlers'
import { clearStoredScenario, initScenario } from './scenarios/store'

declare global {
  interface Window {
    __kurio?: KurioControlApi
  }
}

export async function startMocks(url: URL = new URL(window.location.href)): Promise<void> {
  if (url.searchParams.get('reset') === '1') {
    clearStoredScenario()
    clearClientStorage()
    await resetDb()
    seedRandom()
  } else {
    await loadDb()
  }
  initScenario(url.searchParams.get('scenario'), env.VITE_DEFAULT_SCENARIO)

  const control = createControlApi()
  const loginEmail = url.searchParams.get('user')
  if (loginEmail && Object.values(getDb().users).some((u) => u.email === loginEmail))
    control.loginAs(loginEmail)

  rescheduleSettlements()

  const worker = setupWorker(...handlers)
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
    quiet: !import.meta.env.DEV,
  })

  window.__kurio = control

  if (url.searchParams.get('panel') !== '0') {
    void import('./control/mount-panel').then(({ mountScenarioPanel }) =>
      mountScenarioPanel(control),
    )
  }
}
