import { useState } from 'react'

import { formatEthRange } from '@/shared/lib/money'
import { Button } from '@/shared/ui/button'
import { Slider } from '@/shared/ui/slider'

import type { CatalogFilterPatch } from '../lib/catalog-search'
import { centsToEth, ethToCents, toPricePatch, toSliderValues } from '../lib/price-range'
import { FilterSection } from './FilterSection'

type PriceRangeFilterProps = {
  range: { min: string; max: string }
  priceMin?: string
  priceMax?: string
  onChange: (patch: CatalogFilterPatch) => void
}

export function PriceRangeFilter({ range, priceMin, priceMax, onChange }: PriceRangeFilterProps) {
  const applied = toSliderValues(range, { priceMin, priceMax })
  const [draft, setDraft] = useState<[number, number]>(applied)
  const appliedKey = applied.join('-')
  const [syncedKey, setSyncedKey] = useState(appliedKey)
  if (syncedKey !== appliedKey) {
    setSyncedKey(appliedKey)
    setDraft(applied)
  }

  return (
    <FilterSection title="Faixa de preço">
      <div className="flex flex-col items-start gap-3 pl-3">
        <Slider
          min={ethToCents(range.min)}
          max={ethToCents(range.max)}
          step={1}
          minStepsBetweenThumbs={1}
          value={draft}
          onValueChange={(value) => setDraft([value[0] ?? draft[0], value[1] ?? draft[1]])}
          thumbLabels={['Preço mínimo', 'Preço máximo']}
          formatValue={(cents) => `${centsToEth(cents).replace('.', ',')} ETH`}
        />
        <p className="type-b-15 text-foreground" aria-live="polite">
          Preço: {formatEthRange(centsToEth(draft[0]), centsToEth(draft[1]))}
        </p>
        <Button
          size="none"
          radius="md"
          className="type-b-16-bold-20 px-3 py-2"
          onClick={() => onChange(toPricePatch(range, draft))}
        >
          Aplicar
        </Button>
      </div>
    </FilterSection>
  )
}
