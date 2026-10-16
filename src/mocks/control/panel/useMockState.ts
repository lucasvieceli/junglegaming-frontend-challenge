import { useSyncExternalStore } from 'react'

import { getDb, subscribeDb } from '../../db/db'
import { getScenarioName, subscribeScenario } from '../../scenarios/store'

const subscribe = (listener: () => void) => {
  const offScenario = subscribeScenario(listener)
  const offDb = subscribeDb(listener)
  return () => {
    offScenario()
    offDb()
  }
}

export function useMockState() {
  const scenario = useSyncExternalStore(subscribe, getScenarioName)
  const pendingOrderId = useSyncExternalStore(subscribe, () => {
    const pending = Object.values(getDb().orders)
      .filter((order) => order.status === 'pending')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return pending[0]?.id ?? null
  })
  return { scenario, pendingOrderId }
}
