import type { Page } from '@playwright/test'

import { openCheckoutWithItem } from '../fixtures/flows'
import { expect, test } from '../fixtures/test'

const ACCENT = 'rgb(232, 155, 85)'
const PRIMARY = 'rgb(210, 138, 76)'
const BORDER = 'rgb(63, 35, 25)'
const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024

test.describe('Figma design tokens (DIR-1)', () => {
  test('home: typography, colors and sizes', async ({ app, page }) => {
    await app.reset()
    const card = page.getByRole('article').first()
    await expect(card).toBeVisible()
    await expect(page.locator('body')).toHaveCSS('font-family', /Roboto Mono/)
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(20, 13, 10)')
    const price = card.locator('p span').first()
    await expect(price).toHaveCSS('color', ACCENT)
    await expect(price).toHaveCSS('font-weight', '700')

    if (isDesktop(page)) {
      const wordmark = page.getByRole('link', { name: 'Kurio — página inicial' })
      await expect(wordmark).toHaveCSS('font-size', '14px')
      await expect(wordmark).toHaveCSS('font-weight', '700')
      await expect(wordmark).toHaveCSS('letter-spacing', '1.4px')
      const nav = page
        .getByRole('navigation', { name: 'Principal' })
        .getByRole('link', { name: 'Mercado' })
        .locator('span')
        .first()
      await expect(nav).toHaveCSS('font-size', '16px')
      await expect(nav).toHaveCSS('font-weight', '400')
      await expect(price).toHaveCSS('font-size', '18px')
      await expect(page.getByRole('link', { name: 'Entrar' })).toHaveCSS(
        'background-color',
        PRIMARY,
      )
      if (page.viewportSize()?.width === 1440) {
        expect((await page.getByRole('banner').boundingBox())?.width).toBe(1200)
        const tile = card.locator('> div').first()
        const box = await tile.boundingBox()
        expect(Math.round(box?.width ?? 0)).toBe(258)
        expect(Math.round(box?.height ?? 0)).toBe(300)
      }
    } else {
      await expect(price).toHaveCSS('font-size', '16px')
      const tile = card.locator('> div').first()
      // Figma mobile tile is 175x200; fluid width keeps the ratio.
      const box = await tile.boundingBox()
      if ((page.viewportSize()?.width ?? 0) < 768) {
        expect(Math.abs((box?.height ?? 0) - ((box?.width ?? 0) * 200) / 175)).toBeLessThanOrEqual(
          4,
        )
      }
    }
  })

  test('checkout: labels, fields and primary button', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page)
    const label = page
      .locator('label')
      .filter({ hasText: /^Nome de exibição/ })
      .first()
    await expect(label).toHaveCSS('font-size', '15px')
    await expect(label).toHaveCSS('line-height', '15px')
    const input = checkout.field('Nome de exibição')
    await expect(input).toHaveCSS('border-top-color', BORDER)
    expect(Math.round((await input.boundingBox())?.height ?? 0)).toBe(isDesktop(page) ? 40 : 50)
    await expect(page.locator('.type-asterisk').first()).toHaveCSS('color', 'rgb(240, 128, 95)')
    if (isDesktop(page)) await expect(checkout.confirmButton).toHaveCSS('background-color', PRIMARY)
  })
})
