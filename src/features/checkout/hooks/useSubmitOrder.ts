import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { isApiError, type ApiError } from '@/shared/api/api-error'
import { queryKeys } from '@/shared/api/query-keys'
import type { CreateOrderRequest } from '@/shared/contracts/order'
import { hashBody } from '@/shared/lib/hash'
import { newId } from '@/shared/lib/id'

import { createOrder } from '../api/checkout.api'
import { checkoutStorage, type OrderAttempt } from '../lib/checkout-storage'
import { isDefinitiveRejection, isUnconfirmed } from '../lib/submit-errors'

const AUTO_RETRY_MS = 2000

export type SubmitPhase = 'idle' | 'sending' | 'unconfirmed' | 'failed'

export function useSubmitOrder(userId: string, onRejected: (error: ApiError) => void) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState<OrderAttempt | null>(() =>
    checkoutStorage.loadAttempt(userId),
  )
  const [phase, setPhase] = useState<SubmitPhase>(() =>
    attempt?.status === 'failed' ? 'failed' : attempt ? 'unconfirmed' : 'idle',
  )
  const retryTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(retryTimer.current), [])

  const store = (next: OrderAttempt | null) => {
    setAttempt(next)
    if (next) checkoutStorage.saveAttempt(userId, next)
    else checkoutStorage.clearAttempt(userId)
  }

  const send = async (current: OrderAttempt, autoRetry: boolean): Promise<void> => {
    setPhase('sending')
    try {
      const order = await createOrder(current.body, current.key)
      store({ ...current, orderId: order.id })
      checkoutStorage.clearDraft(userId)
      queryClient.setQueryData(queryKeys.orders.detail(userId, order.id), order)
      await navigate({ to: '/orders/$orderId', params: { orderId: order.id }, replace: true })
    } catch (error) {
      if (isUnconfirmed(error)) {
        setPhase('unconfirmed')
        if (autoRetry)
          retryTimer.current = window.setTimeout(() => void send(current, false), AUTO_RETRY_MS)
      } else if (isApiError(error) && error.code === 'IDEMPOTENCY_KEY_REUSED') {
        store({ ...current, status: 'failed' })
        setPhase('failed')
      } else if (isDefinitiveRejection(error)) {
        store(null)
        setPhase('idle')
        onRejected(error)
      } else {
        // 401 or 5xx: keep the stored attempt so retries reuse the same idempotency key.
        setPhase('unconfirmed')
      }
    }
  }

  const submitting = useRef(false)

  const submit = async (body: CreateOrderRequest) => {
    if (submitting.current) return
    submitting.current = true
    try {
      const current = attempt ?? {
        key: newId(),
        body,
        bodyHash: await hashBody(body),
        status: 'sending' as const,
        orderId: null,
      }
      store(current)
      await send(current, true)
    } finally {
      submitting.current = false
    }
  }

  return {
    attempt,
    phase,
    submit,
    resend: () => (attempt ? send(attempt, false) : Promise.resolve()),
    cancel: () => {
      store(null)
      setPhase('idle')
    },
  }
}
