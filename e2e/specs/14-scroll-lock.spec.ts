import type { Page } from '@playwright/test'

import { expect, test } from '../fixtures/test'

// Headless hides scrollbars, which would hide the layout shift.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } })

const mainX = (page: Page) =>
  page.evaluate(() => document.querySelector('main')?.getBoundingClientRect().x ?? -1)

test.describe('scroll lock', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'scrollbar is desktop only')

  test('opening a select does not shift the page sideways', async ({ app, page }) => {
    await app.reset()
    const before = await mainX(page)
    await page.getByRole('combobox').filter({ visible: true }).first().click()
    await expect(page.getByRole('listbox')).toBeVisible()
    expect(await mainX(page)).toBe(before)
  })

  test('opening a modal does not shift the page sideways', async ({ app, page }) => {
    await app.reset()
    const before = await mainX(page)
    await page.getByRole('link', { name: 'Entrar' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(await mainX(page)).toBe(before)
  })
})
