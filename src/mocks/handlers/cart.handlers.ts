import { http } from 'msw'
import { z } from 'zod'

import {
  AddCartItemRequestSchema,
  CartSchema,
  QuoteRequestSchema,
  QuoteSchema,
} from '@/shared/contracts/cart'

import { getDb } from '../db/db'
import { api } from '../lib/api-path'
import { ownerKeyOf, requireUser, resolveActor } from '../lib/auth'
import {
  addCartItem,
  applyCoupon,
  buildCartView,
  getOrCreateCart,
  mergeGuestCart,
  removeCartItem,
  removeCoupon,
  updateCartItem,
} from '../lib/cart'
import { createQuote } from '../lib/quote'
import { json, parseBody } from '../lib/respond'
import { withScenario } from '../scenarios/apply'
import { runScenarioTrigger } from '../scenarios/triggers'

const ownerOf = (request: Request) => ownerKeyOf(resolveActor(request))

export const cartHandlers = [
  http.get(
    api('/cart'),
    withScenario(({ request }) => {
      const ownerKey = ownerOf(request)
      return json(CartSchema, buildCartView(getDb(), getOrCreateCart(ownerKey)))
    }),
  ),

  http.post(
    api('/cart/quote'),
    withScenario(async ({ request }) => {
      const actor = resolveActor(request)
      const ownerKey = ownerKeyOf(actor)
      const body = await parseBody(request, QuoteRequestSchema)
      const quote = createQuote(ownerKey, body)
      runScenarioTrigger('checkout_quote', { userId: actor.user?.id, ownerKey })
      return json(QuoteSchema, quote)
    }),
  ),

  http.post(
    api('/cart/merge'),
    withScenario(async ({ request }) => {
      const { user } = requireUser(request)
      const { guestId } = await parseBody(request, z.object({ guestId: z.string().min(1) }))
      return json(CartSchema, mergeGuestCart(`user:${user.id}`, guestId))
    }),
  ),

  http.post(
    api('/cart/coupon'),
    withScenario(async ({ request }) => {
      const { code } = await parseBody(request, z.object({ code: z.string().min(1) }))
      return json(CartSchema, applyCoupon(ownerOf(request), code))
    }),
  ),

  http.delete(
    api('/cart/coupon'),
    withScenario(({ request }) => json(CartSchema, removeCoupon(ownerOf(request)))),
  ),

  http.post(
    api('/cart/items'),
    withScenario(async ({ request }) => {
      const body = await parseBody(request, AddCartItemRequestSchema)
      return json(CartSchema, addCartItem(ownerOf(request), body))
    }),
  ),

  http.patch(
    api('/cart/items/:itemId'),
    withScenario(async ({ request, params }) => {
      const { quantity } = await parseBody(request, z.object({ quantity: z.int().min(1) }))
      return json(CartSchema, updateCartItem(ownerOf(request), String(params.itemId), quantity))
    }),
  ),

  http.delete(
    api('/cart/items/:itemId'),
    withScenario(({ request, params }) =>
      json(CartSchema, removeCartItem(ownerOf(request), String(params.itemId))),
    ),
  ),
]
