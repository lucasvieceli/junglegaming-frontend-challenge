import { expect, test } from '../fixtures/test'

test.describe('loading, errors and offline', () => {
  test('slow network: skeletons match final dimensions (no layout shift)', async ({
    app,
    page,
  }) => {
    await app.reset('slow-network')
    const firstItem = page.getByRole('list', { name: 'NFTs' }).getByRole('listitem').first()
    await expect(firstItem.getByTestId('skeleton').first()).toBeVisible()
    const loading = await firstItem.boundingBox()
    await expect(firstItem.getByRole('article')).toBeVisible({ timeout: 15_000 })
    const loaded = await firstItem.boundingBox()
    expect(Math.abs((loading?.height ?? 0) - (loaded?.height ?? 0))).toBeLessThanOrEqual(2)
    expect(Math.abs((loading?.width ?? 0) - (loaded?.width ?? 0))).toBeLessThanOrEqual(1)
  })

  test('slow network: NFT detail and cart summary show skeletons before data', async ({
    app,
    page,
  }) => {
    await app.reset('slow-network', { path: '/nfts/nft_emerald_ape_042' })
    await expect(page.getByTestId('skeleton').filter({ visible: true }).first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }).filter({ visible: true }),
    ).toBeVisible({ timeout: 15_000 })

    await page.getByRole('button', { name: 'COMPRAR' }).filter({ visible: true }).first().click()
    await expect(page.getByText('Emerald Ape #042 adicionado ao carrinho.')).toBeVisible({
      timeout: 15_000,
    })
    await page.goto('/cart')
    await expect(page.getByTestId('skeleton').filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByText('Subtotal').filter({ visible: true }).first()).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.locator('[aria-busy="true"] [data-testid="skeleton"]')).toHaveCount(0)
  })

  test('prefers-reduced-motion disables the skeleton shimmer', async ({ app, page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await app.reset('slow-network')
    const skeleton = page.getByTestId('skeleton').filter({ visible: true }).first()
    await expect(skeleton).toBeVisible()
    expect(
      await skeleton.evaluate((element) => getComputedStyle(element, '::after').animationName),
    ).toBe('none')
  })

  test('server error: error state and successful retry', async ({ app, page }) => {
    // The first attempt and the automatic retry fail (503); the manual retry succeeds.
    await app.reset('server-error', { path: '/nfts/nft_emerald_ape_042' })
    await expect(page.getByRole('heading', { name: 'Algo deu errado' })).toBeVisible({
      timeout: 15_000,
    })
    await page.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }).filter({ visible: true }),
    ).toBeVisible()
  })

  test('offline: connection banner and recovery', async ({ app, page }) => {
    await app.reset('offline')
    await expect(page.getByText('Sem conexão — tentando reconectar…')).toBeVisible({
      timeout: 15_000,
    })
    await app.setScenario('default')
    await page.getByRole('button', { name: 'Tentar novamente' }).first().click()
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Sem conexão — tentando reconectar…')).toBeHidden()
  })
})
