import { test as base, expect, type Page } from '@playwright/test'

export const USERS = {
  ana: { id: 'usr_ana', email: 'ana@kurio.test', password: 'Kurio@2026' },
  bruno: { id: 'usr_bruno', email: 'bruno@kurio.test', password: 'Kurio@2026' },
} as const

type UserKey = keyof typeof USERS

export class AppController {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async reset(scenario = 'default', opts: { user?: UserKey; path?: string } = {}) {
    const params = new URLSearchParams({ scenario, reset: '1', panel: '0' })
    if (opts.user) params.set('user', USERS[opts.user].email)
    await this.page.goto(`${opts.path ?? '/'}?${params.toString()}`)
    await this.page.waitForFunction(() => Boolean(window.__kurio))
  }

  async installClock(time = '2026-07-29T12:00:00.000Z') {
    await this.page.clock.install({ time: new Date(time) })
  }

  fastForward(ms: number) {
    return this.page.clock.fastForward(ms)
  }

  private ready() {
    return this.page.waitForFunction(() => Boolean(window.__kurio))
  }

  async setScenario(name: string) {
    await this.ready()
    return this.page.evaluate((n) => window.__kurio?.setScenario(n as never), name)
  }

  emit(
    event: 'nft.updated' | 'order.updated',
    payload: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) {
    return this.page.evaluate(([e, p, o]) => window.__kurio?.emit(e, p, o) ?? null, [
      event,
      payload,
      options,
    ] as const)
  }

  dropSocket() {
    return this.page.evaluate(() => window.__kurio?.dropSocket())
  }

  settleOrder(orderId: string, status: 'confirmed' | 'declined') {
    return this.page.evaluate(([id, s]) => window.__kurio?.settleOrder(id, s), [
      orderId,
      status,
    ] as const)
  }

  async setLatency(ms: number | null) {
    await this.ready()
    return this.page.evaluate((value) => window.__kurio?.setLatency(value), ms)
  }

  disconnectWallet(walletId: string) {
    return this.page.evaluate((id) => window.__kurio?.disconnectWallet(id), walletId)
  }

  expireSession() {
    return this.page.evaluate(() => window.__kurio?.expireSession())
  }

  seedCart(ownerKey: string, items: Array<{ nftId: string; editionId: string; quantity: number }>) {
    return this.page.evaluate(([o, i]) => window.__kurio?.seedCart(i, o), [
      ownerKey,
      items,
    ] as const)
  }

  async db() {
    await this.ready()
    return this.page.evaluate(() => window.__kurio?.getDb())
  }

  async expectNoHorizontalOverflow() {
    const fits = await this.page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    )
    expect(fits, 'page must not overflow horizontally').toBe(true)
  }
}

export const test = base.extend<{ app: AppController }>({
  app: async ({ page }, use) => {
    await use(new AppController(page))
  },
})

export { expect }
