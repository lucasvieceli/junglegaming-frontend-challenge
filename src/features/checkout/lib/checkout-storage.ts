import { z } from 'zod'

import { CreateOrderRequestSchema } from '@/shared/contracts/order'
import {
  checkoutAttemptKey as attemptKey,
  checkoutDraftKey as draftKey,
} from '@/shared/lib/checkout-keys'
import { readJson, removeKey, writeJson } from '@/shared/lib/storage'

export const CheckoutDraftSchema = z.object({
  values: z.record(z.string(), z.string().optional()),
  walletChoice: z.string().nullable(),
})
export type CheckoutDraft = z.infer<typeof CheckoutDraftSchema>

export const OrderAttemptSchema = z.object({
  key: z.string(),
  body: CreateOrderRequestSchema,
  bodyHash: z.string(),
  status: z.enum(['sending', 'failed']),
  orderId: z.string().nullable(),
})
export type OrderAttempt = z.infer<typeof OrderAttemptSchema>

export const checkoutStorage = {
  loadDraft: (userId: string) => readJson(draftKey(userId), CheckoutDraftSchema, 'session'),
  saveDraft: (userId: string, draft: CheckoutDraft) =>
    writeJson(draftKey(userId), draft, 'session'),
  clearDraft: (userId: string) => removeKey(draftKey(userId), 'session'),
  loadAttempt: (userId: string) => readJson(attemptKey(userId), OrderAttemptSchema),
  saveAttempt: (userId: string, attempt: OrderAttempt) => writeJson(attemptKey(userId), attempt),
  clearAttempt: (userId: string) => removeKey(attemptKey(userId)),
}
