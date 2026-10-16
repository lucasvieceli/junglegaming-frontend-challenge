import type { Page } from '@playwright/test'

import { CheckoutPage } from '../pages/CheckoutPage'
import { NftDetailPage } from '../pages/NftDetailPage'
import { expect, type AppController } from './test'

export async function openCheckoutWithItem(app: AppController, page: Page, scenario = 'default') {
  await app.installClock()
  await app.reset(scenario, { user: 'ana', path: '/nfts/nft_emerald_ape_042' })
  await new NftDetailPage(page).addToCart().click()
  await expect(page.getByText('Emerald Ape #042 adicionado ao carrinho.')).toBeVisible()
  await page.goto('/checkout')
  const checkout = new CheckoutPage(page)
  await expect(checkout.field('Nome de exibição')).toHaveValue('Ana Sato')
  return checkout
}
