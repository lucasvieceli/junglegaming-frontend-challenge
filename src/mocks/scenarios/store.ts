import { seedRandom } from '../lib/prng'
import { SCENARIOS, isScenarioName, type ScenarioName } from './presets'
import type { ScenarioConfig } from './types'

const STORAGE_KEY = 'kurio.scenario'

let active: ScenarioName = 'default'
let latencyOverride: number | null = null
const hits = new Map<string, number>()
const listeners = new Set<() => void>()

export function getScenario(): ScenarioConfig {
  const config = SCENARIOS[active]
  return latencyOverride === null
    ? config
    : { ...config, latency: { mode: 'fixed', minMs: latencyOverride, maxMs: latencyOverride } }
}

export function getScenarioName(): ScenarioName {
  return active
}

export function setScenario(name: ScenarioName): void {
  active = name
  hits.clear()
  seedRandom()
  try {
    window.localStorage.setItem(STORAGE_KEY, name)
  } catch {
    // ignore
  }
  listeners.forEach((listener) => listener())
}

export function initScenario(fromUrl: string | null, fallback: string): ScenarioName {
  let stored: string | null = null
  try {
    stored = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    stored = null
  }
  const name = [fromUrl, stored, fallback].find(isScenarioName) ?? 'default'
  setScenario(name)
  return name
}

export function clearStoredScenario(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function setLatencyOverride(ms: number | null): void {
  latencyOverride = ms
  listeners.forEach((listener) => listener())
}

export function countHit(ruleKey: string): number {
  const value = (hits.get(ruleKey) ?? 0) + 1
  hits.set(ruleKey, value)
  return value
}

export function subscribeScenario(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
