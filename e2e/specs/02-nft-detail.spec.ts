import { NftDetailPage } from '../pages/NftDetailPage'
import { expect, test } from '../fixtures/test'

test.describe('NFT detail', () => {
  test('direct access shows title, price and editions', async ({ app, page }) => {
    await app.reset('default', { path: '/nfts/nft_emerald_ape_042' })
    const detail = new NftDetailPage(page)
    await expect(detail.title).toHaveText('Emerald Ape #042')
    await expect(page.getByText('1.19 ETH').filter({ visible: true }).first()).toBeVisible()
    await expect(detail.editions()).toHaveCount(4)
    await expect(detail.editions().filter({ hasText: '1/50' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page).toHaveTitle('Emerald Ape #042 — Kurio')
    await app.expectNoHorizontalOverflow()
  })

  test('sold-out editions are disabled', async ({ app, page }) => {
    await app.reset('default', { path: '/nfts/nft_obsidian_relic_001' })
    const detail = new NftDetailPage(page)
    await expect(detail.title).toHaveText('Obsidian Relic #001')
    const editions = detail.editions()
    for (const edition of await editions.all())
      await expect(edition).toHaveAttribute('aria-disabled', 'true')
  })

  test('quantity is capped at availability with a warning', async ({ app, page }) => {
    await app.reset('default', { path: '/nfts/nft_velvet_signal_017' })
    const detail = new NftDetailPage(page)
    await expect(detail.title).toHaveText('Velvet Signal #017')
    const increase = detail.increase('Velvet Signal #017')
    while (await increase.isEnabled()) await increase.click()
    await expect(increase).toBeDisabled()
  })

  test('unknown NFT shows the not-found state', async ({ app, page }) => {
    await app.reset('default', { path: '/nfts/nft_missing' })
    await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Voltar ao início' })).toBeVisible()
  })

  test('availability conflict on add (client-error) shows the server message', async ({
    app,
    page,
  }) => {
    await app.reset('client-error', { path: '/nfts/nft_emerald_ape_042' })
    await new NftDetailPage(page).addToCart().click()
    await expect(page.getByText('Máximo disponível: 1.')).toBeVisible()
    const carts = Object.values((await app.db())?.carts ?? {})
    expect(carts.every((cart) => cart.items.length === 0)).toBe(true)
  })

  test('realtime price change shows on the detail with a notice', async ({ app, page }) => {
    await app.reset('default', { path: '/nfts/nft_emerald_ape_042' })
    await expect(new NftDetailPage(page).title).toHaveText('Emerald Ape #042')
    await expect(
      page.getByTestId('realtime-status').filter({ visible: true }).first(),
    ).toHaveAttribute('data-state', 'connected')
    await app.emit('nft.updated', { nftId: 'nft_emerald_ape_042', price: '1.29' })
    await expect(
      page.getByText('Preço atualizado: 1.19 ETH → 1.29 ETH.').filter({ visible: true }),
    ).toBeVisible()
  })

  test('slow route change shows the top progress bar and hides it when done', async ({
    app,
    page,
  }) => {
    await app.reset()
    const card = page.locator('a[href^="/nfts/"]').filter({ visible: true }).first()
    await expect(card).toBeVisible()
    await app.setLatency(1500)
    await card.click()
    const progress = page.getByRole('progressbar', { name: 'Carregando página' })
    await expect(progress).toBeVisible()
    await expect(page).toHaveURL(/\/nfts\//)
    await expect(new NftDetailPage(page).title).toBeVisible()
    await expect(progress).toHaveCount(0)
  })

  test('switching editions does not shift content below (max notice out of flow)', async ({
    app,
    page,
  }) => {
    await app.reset('default', { path: '/nfts/nft_emerald_ape_042' })
    const detail = new NftDetailPage(page)
    await expect(detail.title).toHaveText('Emerald Ape #042')
    const buy = page.getByRole('button', { name: 'COMPRAR' }).filter({ visible: true }).first()
    const before = (await buy.boundingBox())?.y
    const single = detail.editions().filter({ hasText: /^1\/1$/ })
    await single.click()
    await expect(single).toHaveAttribute('aria-checked', 'true')
    expect((await buy.boundingBox())?.y).toBe(before)
  })

  test('clicking a card morphs its artwork into the detail artwork', async ({ app, page }) => {
    await app.reset()
    const card = page.getByRole('list', { name: 'NFTs' }).getByRole('listitem').nth(1)
    await expect(card.getByRole('article')).toBeVisible()
    await page.evaluate(() => {
      const seen = new Set<string>()
      Object.assign(window, { viewTransitionTargets: seen })
      const observe = () => {
        for (const animation of document.getAnimations()) {
          const target = (animation.effect as KeyframeEffect | null)?.pseudoElement
          if (target) seen.add(target)
        }
        requestAnimationFrame(observe)
      }
      observe()
    })
    // Hover preloads the detail (as on desktop), so the morph does not depend on machine speed.
    await app.setLatency(0)
    await card.hover()
    await page.waitForTimeout(500)
    await card.getByRole('link').first().click()
    await expect(page).toHaveURL(/\/nfts\//)
    await expect
      .poll(() =>
        page.evaluate(() => [
          ...(window as unknown as { viewTransitionTargets: Set<string> }).viewTransitionTargets,
        ]),
      )
      .toEqual(
        expect.arrayContaining([
          '::view-transition-old(nft-artwork)',
          '::view-transition-new(nft-artwork)',
        ]),
      )
  })

  test('tab indicator slides to the selected tab', async ({ app, page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, 'detail tabs are desktop only')
    await app.reset('default', { path: '/nfts/nft_emerald_ape_042' })
    const tabs = page.getByRole('tablist', { name: 'Informações do NFT' })
    const reviews = tabs.getByRole('tab', { name: /Avaliações de colecionadores/ })
    await reviews.click()
    await expect(reviews).toHaveAttribute('aria-selected', 'true')
    const indicator = tabs.locator('span[aria-hidden="true"]')
    await expect
      .poll(async () => {
        const [bar, tab] = await Promise.all([indicator.boundingBox(), reviews.boundingBox()])
        return bar && tab
          ? [Math.abs(Math.round(bar.x - tab.x)), Math.abs(Math.round(bar.width - tab.width))]
          : null
      })
      .toEqual([0, 0])
  })

  test('clicking anywhere on the artwork opens the zoom', async ({ app, page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, 'gallery zoom is desktop only')
    await app.reset('default', { path: '/nfts/nft_emerald_ape_042' })
    const artwork = page.getByRole('button', { name: 'Ampliar Emerald Ape #042' })
    await artwork.click({ position: { x: 120, y: 300 } })
    await expect(page.getByRole('dialog', { name: 'Emerald Ape #042' })).toBeVisible()
  })
})
