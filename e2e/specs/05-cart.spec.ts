import Big from 'big.js'

import { CartPage } from '../pages/CartPage'
import { NftDetailPage } from '../pages/NftDetailPage'
import { AuthPage } from '../pages/AuthPage'
import { USERS, expect, test } from '../fixtures/test'

const eth = (value: Big) => `${value.toFixed(Math.max(2, value.c.length - value.e - 1))} ETH`

test.describe('cart', () => {
  test('guest: add, update, remove, refresh, coupons and merge on login', async ({ app, page }) => {
    await app.reset('default', { path: '/nfts/nft_emerald_ape_042' })
    const detail = new NftDetailPage(page)
    await detail.addToCart().click()
    await expect(page.getByText('Emerald Ape #042 adicionado ao carrinho.')).toBeVisible()
    await detail.goto('nft_sage_nomad_009')
    await detail.addToCart().click()
    await expect(page.getByText('Sage Nomad #009 adicionado ao carrinho.')).toBeVisible()

    const cart = new CartPage(page)
    await cart.goto()
    await expect(cart.items).toHaveCount(2)
    await cart.increase('Emerald Ape #042').click()
    await expect(cart.item('Emerald Ape #042')).toContainText('2.38 ETH')
    await cart.remove('Sage Nomad #009').click()
    await expect(cart.items).toHaveCount(1)

    await page.reload()
    await expect(cart.items).toHaveCount(1)
    await expect(cart.item('Emerald Ape #042')).toContainText('2')

    await cart.applyCoupon('KURIO10')
    const subtotal = new Big('2.38')
    const discount = subtotal.times(10).div(100)
    await expect(cart.summaryValue('Total')).toHaveText(eth(subtotal.minus(discount).plus('0.016')))
    await expect(cart.summaryValue('Desconto do lançamento')).toHaveText(`(-) ${eth(discount)}`)
    await page
      .getByRole('button', { name: 'Remover', exact: true })
      .filter({ visible: true })
      .first()
      .click()

    await cart.applyCoupon('EXPIRADO20')
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: /expirado/i })
        .filter({ visible: true }),
    ).toBeVisible()
    await cart.applyCoupon('XYZ')
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: /inválido/i })
        .filter({ visible: true }),
    ).toBeVisible()

    await page.goto('/login?redirect=%2Fcart')
    await new AuthPage(page).login(USERS.ana.email, USERS.ana.password)
    await expect(page).toHaveURL(/\/cart/)
    await expect(cart.item('Emerald Ape #042')).toBeVisible()
    const anaCart = (await app.db())?.carts['user:usr_ana']
    expect(anaCart?.items.some((item) => item.nftId === 'nft_emerald_ape_042')).toBe(true)
    await app.expectNoHorizontalOverflow()
  })

  test('availability limit: "+" disabled and PATCH above max returns 409', async ({
    app,
    page,
  }) => {
    await app.reset('default', { path: '/nfts/nft_velvet_signal_017' })
    await new NftDetailPage(page).addToCart().click()
    await expect(page.getByText('Velvet Signal #017 adicionado ao carrinho.')).toBeVisible()
    const cart = new CartPage(page)
    await cart.goto()
    await expect(cart.increase('Velvet Signal #017')).toBeDisabled()

    const result = await page.evaluate(async () => {
      const guestId = JSON.parse(localStorage.getItem('kurio.guestId') ?? '""') as string
      const headers = { 'Content-Type': 'application/json', 'X-Guest-Id': guestId }
      const current = (await (await fetch('/api/cart', { headers })).json()) as {
        items: Array<{ id: string }>
      }
      const response = await fetch(`/api/cart/items/${current.items[0]?.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ quantity: 2 }),
      })
      return {
        status: response.status,
        body: (await response.json()) as { error: { message: string } },
      }
    })
    expect(result.status).toBe(409)
    expect(result.body.error.message).toBe('Máximo disponível: 1.')
  })
})
