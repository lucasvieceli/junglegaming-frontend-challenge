import type { Page } from '@playwright/test'

import { CheckoutPage } from '../pages/CheckoutPage'
import { expect, test, type AppController } from '../fixtures/test'

const FIGMA_CART = [
  { nftId: 'nft_emerald_ape_042', edition: '1/50', quantity: 2 },
  { nftId: 'nft_violet_nomad_314', edition: '1/50', quantity: 6 },
  { nftId: 'nft_ivory_baron_088', edition: '1/50', quantity: 9 },
]

async function prepare(app: AppController, path: string, user?: 'ana') {
  await app.installClock()
  await app.reset('default', { user, path })
  await app.setLatency(0)
}

async function seedFigmaCart(app: AppController, page: Page) {
  const db = await app.db()
  const items = FIGMA_CART.map(({ nftId, edition, quantity }) => ({
    nftId,
    editionId: db?.nfts[nftId]?.editions.find((item) => item.label === edition)?.id ?? '',
    quantity,
  }))
  await app.seedCart('user:usr_ana', items)
  await page.reload()
}

async function snapshot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByTestId('skeleton')).toHaveCount(0)
  await page.evaluate(async () => {
    const images = [...document.images]
    for (const image of images) image.loading = 'eager'
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
  })
  await page.addStyleTag({
    content: '::-webkit-scrollbar{display:none} html{scrollbar-width:none}',
  })
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    animations: 'disabled',
    scale: 'css',
    mask: [page.getByTestId('realtime-status'), page.getByTestId('scenario-panel')],
    maxDiffPixelRatio: 0.01,
  })
}

test.describe('visual regression', () => {
  test('home', async ({ app, page }) => {
    await prepare(app, '/')
    await expect(page.getByRole('article').first()).toBeVisible()
    await snapshot(page, 'home')
  })

  test('NFT detail', async ({ app, page }) => {
    await prepare(app, '/nfts/nft_emerald_ape_042')
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }).filter({ visible: true }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mais desta coleção' })).toBeVisible()
    await snapshot(page, 'detail')
  })

  test('cart', async ({ app, page }) => {
    await prepare(app, '/cart', 'ana')
    await seedFigmaCart(app, page)
    await expect(
      page
        .getByRole('list', { name: 'Itens do carrinho' })
        .filter({ visible: true })
        .getByRole('listitem'),
    ).toHaveCount(3)
    await snapshot(page, 'cart')
  })

  test('checkout', async ({ app, page }) => {
    await prepare(app, '/cart', 'ana')
    await seedFigmaCart(app, page)
    await page.goto('/checkout')
    await expect(new CheckoutPage(page).field('Nome de exibição')).toHaveValue('Ana Sato')
    await snapshot(page, 'checkout')
  })
})
