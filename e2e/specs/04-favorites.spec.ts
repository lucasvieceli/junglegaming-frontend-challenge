import type { Page } from '@playwright/test'

import { expect, test } from '../fixtures/test'

const favoriteButton = (page: Page, name: string) =>
  page
    .getByRole('button', { name: `Favoritar ${name}` })
    .filter({ visible: true })
    .first()

test.describe('favorites (optimistic update)', () => {
  test('favoriting persists; API failure rolls back and warns', async ({ app, page }) => {
    await app.reset('default', { user: 'bruno' })
    const emerald = favoriteButton(page, 'Emerald Ape #042')
    await emerald.click()
    await expect(
      page
        .getByRole('button', { name: 'Remover Emerald Ape #042 dos favoritos' })
        .filter({ visible: true })
        .first(),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect
      .poll(async () => (await app.db())?.favorites.usr_bruno)
      .toContain('nft_emerald_ape_042')

    await app.setScenario('favorites-fail')
    await favoriteButton(page, 'Neon Vessel #552').click()
    await expect(page.getByText('Não foi possível favoritar agora.')).toBeVisible()
    await expect(favoriteButton(page, 'Neon Vessel #552')).toHaveAttribute('aria-pressed', 'false')
    expect((await app.db())?.favorites.usr_bruno).not.toContain('nft_neon_vessel_552')

    await app.setScenario('default')
    await page.goto('/favorites')
    const grid = page.getByRole('main').getByRole('article')
    await expect(grid).toHaveCount(1)
    await expect(grid.getByRole('heading')).toHaveText('Emerald Ape #042')
  })

  test('guest favoriting goes to login', async ({ app, page }) => {
    await app.reset()
    await favoriteButton(page, 'Emerald Ape #042').click()
    await expect(page).toHaveURL(/\/login\?redirect=/)
  })

  test('unauthorized access (403) shows its own message', async ({ app, page }) => {
    await app.reset('unauthorized', { user: 'ana', path: '/favorites' })
    await expect(page.getByRole('heading', { name: 'Acesso não autorizado' })).toBeVisible()
  })
})
