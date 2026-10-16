import type { Page } from '@playwright/test'

import { openCheckoutWithItem } from '../fixtures/flows'
import { expect, test } from '../fixtures/test'
import { CartPage } from '../pages/CartPage'

const status = (page: Page) => page.getByTestId('realtime-status').filter({ visible: true }).first()

test.describe('realtime on cart and checkout', () => {
  test('price change: cart notice and totals match the server', async ({ app, page }) => {
    await openCheckoutWithItem(app, page)
    const cart = new CartPage(page)
    await cart.goto()
    await expect(cart.items).toHaveCount(1)
    await expect(status(page)).toHaveAttribute('data-state', 'connected')
    const eventId = await app.emit('nft.updated', { nftId: 'nft_emerald_ape_042', price: '1.29' })
    await expect(
      page.getByRole('status').filter({ hasText: 'Preço de Emerald Ape #042 mudou' }),
    ).toBeVisible()
    await expect(cart.summaryValue('Total')).toHaveText('1.306 ETH')
    await expect(status(page)).toHaveAttribute('data-last-event-id', eventId ?? '')
  })

  test('checkout blocks confirmation until the quote is refreshed; network changes the fee', async ({
    app,
    page,
  }) => {
    const checkout = await openCheckoutWithItem(app, page)
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await checkout.goToReviewStep()
    await expect(status(page)).toHaveAttribute('data-state', 'connected')
    await expect(checkout.confirmButton).toBeEnabled()

    await app.emit('nft.updated', { nftId: 'nft_emerald_ape_042', price: '1.39' })
    await expect(page.getByTestId('quote-stale-banner')).toBeVisible()
    await expect(checkout.confirmButton).toBeDisabled()
    await page.getByRole('button', { name: /Atualizar cotação|Entendi, atualizar/ }).click()
    await expect(page.getByTestId('quote-stale-banner')).toBeHidden()
    const total = page
      .getByRole('term')
      .filter({ hasText: /^Total$/ })
      .first()
      .locator('xpath=following-sibling::dd[1]')
    await expect(total).toHaveText('1.406 ETH')
    await expect(checkout.confirmButton).toBeEnabled()

    if (checkout.isDesktop) {
      await page.getByRole('radio', { name: 'WalletConnect' }).click()
      const fee = page
        .getByRole('term')
        .filter({ hasText: /^Taxa de rede$/ })
        .first()
        .locator('xpath=following-sibling::dd[1]')
      await expect(fee).toHaveText('0.002 ETH')
      await expect(total).toHaveText('1.392 ETH')
    }
  })

  test('edition sells out during checkout: confirmation blocked', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page, 'edition-sold-out-during-checkout')
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await checkout.goToReviewStep()
    await app.fastForward(3500)
    await expect(page.getByTestId('quote-stale-banner')).toBeVisible()
    await expect(checkout.confirmButton).toBeDisabled()
  })

  test('catalog and detail show the new price without reloading', async ({ app, page }) => {
    await app.reset('default', { path: '/nfts/nft_sage_nomad_009' })
    await expect(page.getByRole('heading', { level: 1 }).filter({ visible: true })).toHaveText(
      'Sage Nomad #009',
    )
    await expect(status(page)).toHaveAttribute('data-state', 'connected')
    await app.emit('nft.updated', { nftId: 'nft_sage_nomad_009', price: '2.05' })
    await expect(page.getByText('2.05 ETH').filter({ visible: true }).first()).toBeVisible()
    await page.goto('/')
    await expect(
      page.getByRole('article').filter({ hasText: 'Sage Nomad #009' }).first(),
    ).toContainText('2.05 ETH')
  })
})
