import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { NftDetailPage } from '../pages/NftDetailPage'
import { expect, test } from '../fixtures/test'

test('full purchase: detail → cart → checkout → order → receipt', async ({ app, page }) => {
  await app.installClock()
  await app.reset('default', { user: 'ana', path: '/nfts/nft_emerald_ape_042' })
  await new NftDetailPage(page).addToCart().click()
  await expect(page.getByText('Emerald Ape #042 adicionado ao carrinho.')).toBeVisible()

  const cart = new CartPage(page)
  await cart.goto()
  await page.getByRole('link', { name: 'Conectar e finalizar' }).filter({ visible: true }).click()
  await expect(page).toHaveURL(/\/checkout/)

  const checkout = new CheckoutPage(page)
  await expect(checkout.field('Nome de exibição')).toHaveValue('Ana Sato')
  await checkout.goToWalletStep()
  await checkout.connectWallet()
  await checkout.goToReviewStep()
  const shownTotal = await page
    .getByRole('term')
    .filter({ hasText: /^Total$/ })
    .first()
    .locator('xpath=following-sibling::dd[1]')
    .innerText()
  await checkout.confirm()

  await expect(page).toHaveURL(/\/orders\//)
  await expect(page.getByRole('heading', { name: 'Pagamento em processamento' })).toBeVisible()
  await app.fastForward(4500)

  const receipt = page.getByRole('dialog', { name: 'Seus NFTs agora estão na sua carteira' })
  await expect(receipt).toBeVisible({ timeout: 15_000 })
  const db = await app.db()
  const orders = Object.values(db?.orders ?? {})
  expect(orders).toHaveLength(1)
  expect(orders[0]?.status).toBe('confirmed')
  await expect(receipt).toContainText(`${orders[0]?.pricing.total}`.replace(/0+$/, ''))
  await expect(receipt).toContainText(shownTotal)
  await expect(receipt).toContainText('29 Jul, 2026')
  await expect(receipt).toContainText('Emerald Ape #042')
  await expect(receipt.getByRole('link', { name: 'Ver no Etherscan' })).toHaveAttribute(
    'href',
    orders[0]?.transaction?.explorerUrl ?? '',
  )
  expect(
    db?.carts['user:usr_ana']?.items.some((item) => item.nftId === 'nft_emerald_ape_042'),
  ).toBe(false)
  await app.expectNoHorizontalOverflow()
})
