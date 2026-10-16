import { createRoot } from 'react-dom/client'

import { ScenarioPanel } from './ScenarioPanel'
import type { KurioControlApi } from './window-api'

export function mountScenarioPanel(control: KurioControlApi): void {
  const host = document.createElement('div')
  host.id = 'kurio-scenario-panel'
  document.body.append(host)
  createRoot(host).render(<ScenarioPanel control={control} />)
}
