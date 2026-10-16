import { openCheckoutWithItem } from '../fixtures/flows'
import { expect, test } from '../fixtures/test'

test.describe('payment failures', () => {
  test('declined payment shows the reason and keeps the cart', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page, 'payment-declined')
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await checkout.goToReviewStep()
    await checkout.confirm()
    await expect(page).toHaveURL(/\/orders\//)
    await app.fastForward(3500)
    await expect(page.getByRole('heading', { name: 'Pagamento recusado' })).toBeVisible()
    await expect(page.getByText('Transação recusada pela carteira.')).toBeVisible()
    await page.getByRole('link', { name: 'Voltar ao carrinho' }).click()
    const db = await app.db()
    expect(
      db?.carts['user:usr_ana']?.items.some((item) => item.nftId === 'nft_emerald_ape_042'),
    ).toBe(true)
  })

  test('after a declined payment the user can check out again', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page, 'payment-declined')
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await checkout.goToReviewStep()
    await checkout.confirm()
    await app.fastForward(3500)
    await expect(page.getByRole('heading', { name: 'Pagamento recusado' })).toBeVisible()
    await page.getByRole('link', { name: 'Voltar ao carrinho' }).click()
    await expect(page).toHaveURL(/\/cart/)
    await page.getByRole('link', { name: 'Conectar e finalizar' }).filter({ visible: true }).click()
    await expect(page).toHaveURL(/\/checkout/)
    await expect(checkout.field('Nome de exibição')).toHaveValue('Ana Sato')
  })

  test('double click on "Confirmar compra" creates a single order', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page)
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await checkout.goToReviewStep()
    if (checkout.isDesktop) {
      await checkout.confirmButton.click()
      await checkout.reviewDialog.getByRole('button', { name: 'Confirmar compra' }).dblclick()
    } else {
      await checkout.confirmButton.dblclick()
    }
    await expect(page).toHaveURL(/\/orders\//)
    expect(Object.keys((await app.db())?.orders ?? {})).toHaveLength(1)
  })

  test('timeout: resends with the same key and reaches the same order', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page, 'order-timeout-recover')
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await checkout.goToReviewStep()
    await checkout.confirm()
    await app.fastForward(8500)
    await expect(page.getByText('Há uma confirmação pendente')).toBeVisible()
    await app.fastForward(2500)
    await expect(page).toHaveURL(/\/orders\//)
    const db = await app.db()
    expect(Object.keys(db?.orders ?? {})).toHaveLength(1)
    expect(Object.keys(db?.idempotency ?? {})).toHaveLength(1)
  })

  test('refresh with a pending attempt offers resend and does not duplicate the order', async ({
    app,
    page,
  }) => {
    const checkout = await openCheckoutWithItem(app, page, 'order-timeout-recover')
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await checkout.goToReviewStep()
    await checkout.confirm()
    await app.fastForward(8500)
    await expect(page.getByText('Há uma confirmação pendente')).toBeVisible()
    await page.reload()
    // Network is back: the resend reuses the saved key and body and finds the existing order.
    await app.setScenario('default')
    await page.getByRole('button', { name: 'Reenviar' }).click()
    await expect(page).toHaveURL(/\/orders\//)
    expect(Object.keys((await app.db())?.orders ?? {})).toHaveLength(1)
  })

  test('wallet rejects connection: purchase blocked until connected', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page, 'wallet-connect-rejected')
    await checkout.goToWalletStep()
    await page.getByRole('button', { name: 'Conectar', exact: true }).click()
    await app.fastForward(2000)
    await expect(checkout.walletStatus).toHaveAttribute('data-state', 'rejected')
    await expect(checkout.walletStatus.getByText('Conexão recusada')).toBeVisible()
    await expect(
      checkout.walletStatus.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeVisible()
    await expect(checkout.confirmButton).toBeDisabled()
  })

  test('external disconnect is detected within 5 s', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page)
    await checkout.goToWalletStep()
    await checkout.connectWallet()
    await app.disconnectWallet('wal_ana_primary')
    await app.fastForward(5500)
    await expect(checkout.walletStatus).toHaveAttribute('data-state', 'disconnected')
    await expect(checkout.walletStatus.getByText('Desconectada')).toBeVisible()
    if (checkout.isDesktop) await expect(checkout.confirmButton).toBeDisabled()
  })
})
