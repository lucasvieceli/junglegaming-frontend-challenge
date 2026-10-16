import { http } from 'msw'

import {
  CreateOrderRequestSchema,
  OrderSchema,
  OrdersResponseSchema,
} from '@/shared/contracts/order'

import { getDb } from '../db/db'
import type { DbOrder } from '../db/schema'
import { api } from '../lib/api-path'
import { requireUser } from '../lib/auth'
import { messages } from '../lib/messages'
import { createOrder, publicOrder } from '../lib/orders'
import { MockHttpError, json, parseBody } from '../lib/respond'
import { withScenario } from '../scenarios/apply'

export const orderHandlers = [
  http.post(
    api('/orders'),
    withScenario(async ({ request }) => {
      const { user } = requireUser(request)
      const key = request.headers.get('Idempotency-Key')
      if (!key)
        throw new MockHttpError(400, 'BAD_REQUEST', 'O header Idempotency-Key é obrigatório.')
      const body = await parseBody(request, CreateOrderRequestSchema)
      const { order, replay } = await createOrder(user.id, key, body)
      return json(OrderSchema, order, { status: replay ? 200 : 201 })
    }),
  ),

  http.get(
    api('/orders'),
    withScenario(({ request }) => {
      const { user } = requireUser(request)
      const items = Object.values(getDb().orders)
        .filter((order) => order.userId === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(publicOrder)
      return json(OrdersResponseSchema, { items })
    }),
  ),

  http.get(
    api('/orders/:id'),
    withScenario(({ request, params }) => {
      const { user } = requireUser(request)
      const order = getDb().orders[String(params.id)] as DbOrder | undefined
      if (!order) throw new MockHttpError(404, 'ORDER_NOT_FOUND', messages.orderNotFound)
      if (order.userId !== user.id) throw new MockHttpError(403, 'FORBIDDEN', messages.forbidden)
      return json(OrderSchema, publicOrder(order))
    }),
  ),
]
