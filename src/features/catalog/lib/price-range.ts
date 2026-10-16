import { eth } from '@/shared/lib/money'

export function ethToCents(value: string): number {
  return eth(value).times(100).round(0, 0).toNumber()
}

export function centsToEth(cents: number): string {
  return eth(String(cents)).div(100).toFixed(2)
}

export function toSliderValues(
  range: { min: string; max: string },
  selected: { priceMin?: string; priceMax?: string },
): [number, number] {
  const min = ethToCents(range.min)
  const max = ethToCents(range.max)
  const clamp = (value: number) => Math.min(max, Math.max(min, value))
  return [
    clamp(selected.priceMin ? ethToCents(selected.priceMin) : min),
    clamp(selected.priceMax ? ethToCents(selected.priceMax) : max),
  ]
}

export function toPricePatch(range: { min: string; max: string }, [low, high]: [number, number]) {
  return {
    priceMin: low > ethToCents(range.min) ? centsToEth(low) : undefined,
    priceMax: high < ethToCents(range.max) ? centsToEth(high) : undefined,
  }
}
