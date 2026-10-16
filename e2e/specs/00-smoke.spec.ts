import { expect, test } from '../fixtures/test'

test('app opens on the home route in pt-BR, with Roboto Mono and no overflow', async ({
  app,
  page,
}) => {
  await app.reset()
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('font-family', /Roboto Mono/)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(20, 13, 10)')
  await app.expectNoHorizontalOverflow()
})

test('unknown route shows the 404 page', async ({ page }) => {
  await page.goto('/rota-inexistente')
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
})

test('shell: per-route title, 404 with header/footer and skip-to-content link', async ({
  app,
  page,
}) => {
  await app.reset('default', { path: '/cart' })
  await expect(page).toHaveTitle('Carrinho de NFTs — Kurio')
  await page.goto('/rota-inexistente')
  await expect(page.getByRole('contentinfo')).toContainText('© 2026 Kurio')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skip).toBeFocused()
  await skip.press('Enter')
  await expect(page.locator('#content')).toBeFocused()
})

test.describe('desktop', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'desktop header (>= 1024px)')

  test('header: active item per route and divider only on "Header With Divider" screens', async ({
    app,
    page,
  }) => {
    await app.reset()
    const nav = page.getByRole('navigation', { name: 'Principal' })
    await expect(nav.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('header .hairline')).toHaveCount(1)

    await page.goto('/cart')
    await expect(nav.getByRole('link', { name: 'Mercado' })).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('header .hairline')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', /\/login/)
  })

  test('out-of-scope actions warn via toast without faking success', async ({ app, page }) => {
    await app.reset()
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('button', { name: 'Criadores' })
      .click()
    await expect(page.getByText('Criadores não está disponível nesta demonstração.')).toBeVisible()
  })
})

test.describe('mobile', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'tab bar (< 1024px)')

  test('tab bar only on Home/Favorites/Account, with the active tab marked', async ({
    app,
    page,
  }) => {
    await app.reset('default', { user: 'ana' })
    const tabBar = page.getByRole('navigation', { name: 'Navegação inferior' })
    await expect(tabBar.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await tabBar.getByRole('link', { name: 'Favoritos' }).click()
    await expect(page).toHaveURL(/\/favorites(\?|$)/)
    await expect(tabBar.getByRole('link', { name: 'Favoritos' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await page.goto('/cart')
    await expect(tabBar).toHaveCount(0)
    await app.expectNoHorizontalOverflow()
  })
})
