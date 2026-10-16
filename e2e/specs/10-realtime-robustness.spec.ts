import type { Page } from '@playwright/test'

import { openCheckoutWithItem } from '../fixtures/flows'
import { expect, test, type AppController } from '../fixtures/test'

const status = (page: Page) => page.getByTestId('realtime-status').filter({ visible: true }).first()

async function placeOrder(app: AppController, page: Page, scenario: string) {
  const checkout = await openCheckoutWithItem(app, page, scenario)
  await checkout.goToWalletStep()
  await checkout.connectWallet()
  await checkout.goToReviewStep()
  await checkout.confirm()
  await expect(page).toHaveURL(/\/orders\//)
  return page.url().split('/orders/')[1]?.split('?')[0] ?? ''
}

test.describe('realtime robustness', () => {
  test('duplicate event and stale version are ignored', async ({ app, page }) => {
    await openCheckoutWithItem(app, page)
    await page.goto('/cart')
    await expect(
      page.getByRole('list', { name: 'Itens do carrinho' }).filter({ visible: true }),
    ).toBeVisible()
    await expect(status(page)).toHaveAttribute('data-state', 'connected')
    const id = await app.emit('nft.updated', { nftId: 'nft_emerald_ape_042', price: '1.29' })
    const toast = page.getByText('O preço de Emerald Ape #042 no seu carrinho mudou.')
    await expect(toast).toHaveCount(1)
    await app.emit('nft.updated', {}, { duplicateOf: id })
    await app.emit('nft.updated', {}, { duplicateOf: id, version: 1 })
    await page.waitForTimeout(500)
    await expect(toast).toHaveCount(1)
    await expect(status(page)).toHaveAttribute('data-last-event-id', id ?? '')
  })

  test('socket drop with pending order: reconnects and shows the receipt', async ({
    app,
    page,
  }) => {
    const orderId = await placeOrder(app, page, 'payment-stuck-pending')
    await expect(status(page)).toHaveAttribute('data-state', 'connected')
    await status(page).evaluate((element) => {
      const states: string[] = []
      new MutationObserver(() => states.push(element.getAttribute('data-state') ?? '')).observe(
        element,
        { attributes: true, attributeFilter: ['data-state'] },
      )
      Object.assign(window, { realtimeStates: states })
    })
    await app.dropSocket()
    await expect
      .poll(
        () =>
          page.evaluate(() => (window as unknown as { realtimeStates: string[] }).realtimeStates),
        {
          timeout: 15_000,
        },
      )
      .toEqual(expect.arrayContaining(['reconnecting', 'connected']))
    await expect(status(page)).toHaveAttribute('data-state', 'connected')
    await app.settleOrder(orderId, 'confirmed')
    await expect(
      page.getByRole('dialog', { name: 'Seus NFTs agora estão na sua carteira' }),
    ).toBeVisible()
  })

  test('refresh with pending order: settlement rescheduled on boot', async ({ app, page }) => {
    await placeOrder(app, page, 'default')
    await page.reload()
    await app.fastForward(4500)
    await expect(
      page.getByRole('dialog', { name: 'Seus NFTs agora estão na sua carteira' }),
    ).toBeVisible({ timeout: 15_000 })
    expect(Object.keys((await app.db())?.orders ?? {})).toHaveLength(1)
  })

  test('order event from another user is ignored', async ({ app, page }) => {
    const orderId = await placeOrder(app, page, 'payment-stuck-pending')
    await expect(status(page)).toHaveAttribute('data-state', 'connected')
    await app.emit(
      'order.updated',
      { orderId, status: 'declined' },
      { userId: 'usr_bruno', deliverTo: 'all' },
    )
    await page.waitForTimeout(800)
    await expect(page.getByRole('heading', { name: 'Pagamento em processamento' })).toBeVisible()
    await expect(page.getByText('Pagamento recusado.')).toHaveCount(0)
  })
})
