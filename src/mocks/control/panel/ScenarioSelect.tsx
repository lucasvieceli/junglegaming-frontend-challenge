import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { SCENARIOS, SCENARIO_NAMES, type ScenarioName } from '../../scenarios/presets'

type ScenarioSelectProps = {
  value: ScenarioName
  onChange: (name: ScenarioName) => void
}

export function ScenarioSelect({ value, onChange }: ScenarioSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="mock-scenario">Cenário</Label>
      <Select value={value} onValueChange={(next) => onChange(next as ScenarioName)}>
        <SelectTrigger id="mock-scenario">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SCENARIO_NAMES.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="type-c-12-18 text-text-secondary">{SCENARIOS[value].description}</p>
    </div>
  )
}
