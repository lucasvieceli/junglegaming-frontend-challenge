import type { Page } from '@playwright/test'

import { expect, test, USERS } from '../fixtures/test'

test.skip(({ isMobile }) => isMobile, 'infrastructure: one viewport is enough')

type ApiInit = { method?: string; headers?: Record<string, string>; body?: string }

const api = async (page: Page, path: string, init: ApiInit = {}) =>
  page.evaluate(
    async ([p, i]) => {
      const response = await fetch(`/api${p}`, i)
      const text = await response.text()
      return { status: response.status, body: text ? JSON.parse(text) : null }
    },
    [path, init] as const,
  )

test('REST: catalog, facets, pagination, filters and 404', async ({ app, page }) => {
  await app.reset()
  const first = await api(page, '/nfts')
  expect(first.status).toBe(200)
  expect(first.body.total).toBe(36)
  expect(first.body.totalPages).toBe(4)
  expect(first.body.items[0].name).toBe('Emerald Ape #042')
  expect(first.body.items.map((n: { name: string }) => n.name).slice(0, 3)).toEqual([
    'Emerald Ape #042',
    'Sage Nomad #009',
    'Neon Vessel #552',
  ])

  const filtered = await api(page, '/nfts?categories=musica&networks=ethereum&sort=price_asc')
  expect(
    filtered.body.items.every(
      (n: { category: string; network: string }) =>
        n.category === 'musica' && n.network === 'ethereum',
    ),
  ).toBe(true)
  const prices = filtered.body.items.map((n: { price: string }) => Number(n.price))
  expect(prices).toEqual([...prices].sort((a, b) => a - b))

  const fresh = await api(page, '/nfts?tab=new')
  expect(fresh.body.total).toBe(12)

  expect((await api(page, '/nfts/nft_missing')).status).toBe(404)
  expect((await api(page, '/nfts/featured')).body.hero).toHaveLength(3)
})

test('REST: login, guest cart, merge and quote with the Figma totals', async ({ app, page }) => {
  await app.reset()
  const guest = { 'X-Guest-Id': 'guest-e2e', 'Content-Type': 'application/json' }
  for (const [nftId, quantity] of [
    ['nft_emerald_ape_042', 2],
    ['nft_violet_nomad_314', 6],
    ['nft_ivory_baron_088', 9],
  ] as const) {
    const added = await api(page, '/cart/items', {
      method: 'POST',
      headers: guest,
      body: JSON.stringify({ nftId, editionId: 'ed_1of50', quantity }),
    })
    expect(added.status).toBe(200)
  }
  const cart = await api(page, '/cart', { headers: guest })
  expect(cart.body.pricing).toMatchObject({
    subtotal: '26.83',
    networkFee: '0.016',
    total: '26.846',
  })

  const login = await api(page, '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: USERS.ana.email, password: USERS.ana.password }),
  })
  expect(login.status).toBe(200)
  const auth = {
    Authorization: `Bearer ${login.body.session.token}`,
    'Content-Type': 'application/json',
  }
  const merged = await api(page, '/cart/merge', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ guestId: 'guest-e2e' }),
  })
  expect(merged.body.items).toHaveLength(3)

  const coupon = await api(page, '/cart/coupon', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ code: 'EXPIRADO20' }),
  })
  expect(coupon.status).toBe(422)
  expect(coupon.body.error.code).toBe('COUPON_EXPIRED')

  const quote = await api(page, '/cart/quote', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ network: 'polygon' }),
  })
  expect(quote.body.pricing).toMatchObject({ networkFee: '0.002', total: '26.832' })
})

test('REST: idempotent order (replay = same order; different body = 409)', async ({
  app,
  page,
}) => {
  await app.reset('payment-stuck-pending')
  const login = await api(page, '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: USERS.ana.email, password: USERS.ana.password }),
  })
  const auth = {
    Authorization: `Bearer ${login.body.session.token}`,
    'Content-Type': 'application/json',
  }
  await api(page, '/cart/items', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ nftId: 'nft_golden_beat_207', editionId: 'ed_1of10', quantity: 1 }),
  })
  const quote = await api(page, '/cart/quote', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ network: 'ethereum' }),
  })
  await api(page, '/wallets/wal_ana_primary/connect', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ network: 'ethereum' }),
  })

  const body = {
    quoteId: quote.body.quoteId,
    walletId: 'wal_ana_primary',
    network: 'ethereum',
    collector: {
      displayName: 'Ana Sato',
      username: 'ana.sato',
      email: 'ana@kurio.test',
      profileName: 'ana',
      referralCode: 'KURIO-ANA',
      ensName: 'nova',
      note: null,
    },
  }
  const headers = { ...auth, 'Idempotency-Key': 'key-e2e-1' }
  const created = await api(page, '/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const replay = await api(page, '/orders', { method: 'POST', headers, body: JSON.stringify(body) })
  const conflict = await api(page, '/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...body, network: 'polygon' }),
  })
  expect(created.status).toBe(201)
  expect(replay.status).toBe(200)
  expect(replay.body.id).toBe(created.body.id)
  expect(conflict.body.error.code).toBe('IDEMPOTENCY_KEY_REUSED')
  expect(Object.keys((await app.db())?.orders ?? {})).toHaveLength(1)
})

test('Socket.IO: handshake, resync, nft.updated from the mock server and keepalive', async ({
  app,
  page,
}) => {
  await app.installClock()
  await app.reset()
  await page.evaluate(() => {
    const frames: string[] = []
    const socket = new WebSocket('wss://realtime.kurio.local/socket.io/?EIO=4&transport=websocket')
    socket.addEventListener('message', (event) => frames.push(String(event.data)))
    Object.assign(window, { __frames: frames, __socket: socket })
  })
  await page.clock.runFor(500)
  const frames = () => page.evaluate(() => (window as unknown as { __frames: string[] }).__frames)
  await expect
    .poll(frames)
    .toEqual(expect.arrayContaining([expect.stringMatching(/^0\{/), expect.stringMatching(/^40/)]))
  await expect
    .poll(async () => (await frames()).some((f) => f.includes('realtime.resync')))
    .toBe(true)

  const eventId = await app.emit('nft.updated', { nftId: 'nft_emerald_ape_042', price: '1.29' })
  expect(eventId).toBeTruthy()
  await expect
    .poll(async () =>
      (await frames()).some((f) => f.includes('nft.updated') && f.includes(String(eventId))),
    )
    .toBe(true)
  const detail = await api(page, '/nfts/nft_emerald_ape_042')
  expect(detail.body.price).toBe('1.29')
  expect(detail.body.version).toBe(2)

  await page.clock.runFor(21_000)
  await expect
    .poll(async () => (await frames()).filter((f) => f === '2').length)
    .toBeGreaterThanOrEqual(1)
})
