import { useState } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/shared/ui/sheet'

import { PanelActions } from './panel/PanelActions'
import { ScenarioSelect } from './panel/ScenarioSelect'
import { useMockState } from './panel/useMockState'
import type { KurioControlApi } from './window-api'

export function ScenarioPanel({ control }: { control: KurioControlApi }) {
  const { scenario, pendingOrderId } = useMockState()
  const [status, setStatus] = useState('')

  return (
    <Sheet>
      <SheetTrigger
        data-testid="scenario-panel"
        className="type-c-12-bold fixed bottom-4 left-4 z-40 cursor-pointer rounded-pill border border-line bg-surface-raised px-4 py-2 text-accent shadow-glow outline-none focus-visible:ring-2 focus-visible:ring-accent max-lg:bottom-[140px]"
      >
        Cenários · {scenario}
      </SheetTrigger>
      <SheetContent side="right" className="gap-6 p-6">
        <div className="flex flex-col gap-2 pr-8">
          <SheetTitle>Backend simulado</SheetTitle>
          <SheetDescription>
            Troque o cenário, resete os dados ou dispare eventos de tempo real (saem do servidor
            mock pelo Socket.IO).
          </SheetDescription>
        </div>
        <ScenarioSelect
          value={scenario}
          onChange={(name) =>
            void control.setScenario(name).then(() => setStatus(`Cenário: ${name}`))
          }
        />
        <PanelActions control={control} pendingOrderId={pendingOrderId} onDone={setStatus} />
        <p role="status" aria-live="polite" className="type-c-12-18 text-text-secondary">
          {status}
        </p>
      </SheetContent>
    </Sheet>
  )
}
