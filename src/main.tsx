import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'
import { env } from '@/app/env'
import { takeControlParams } from '@/mocks/control-params'
import { openApiGate } from '@/shared/api/api-gate'
import { firstScreenOrTimeout } from '@/shared/lib/first-screen'
import '@/styles/globals.css'

async function startApi(controlUrl: URL) {
  if (!env.VITE_ENABLE_MOCKS) return openApiGate()
  const { startMocks } = await import('@/mocks/browser')
  await startMocks(controlUrl)
  openApiGate()
}

function render() {
  const root = document.getElementById('root')
  if (!root) throw new Error('#root not found')
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

const controlUrl = takeControlParams()
render()
// Requests wait on the API gate until the MSW worker starts, which loads after the first paint.
const FIRST_SCREEN_MAX_WAIT_MS = 300
void firstScreenOrTimeout(FIRST_SCREEN_MAX_WAIT_MS).then(() => startApi(controlUrl))
