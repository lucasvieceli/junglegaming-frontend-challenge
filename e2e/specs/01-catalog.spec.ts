import { HomePage } from '../pages/HomePage'
import { expect, test } from '../fixtures/test'

test.describe('catalog', () => {
  test('search, combined filters, sorting, pagination, refresh and back', async ({ app, page }) => {
    await app.reset()
    const home = new HomePage(page)
    await home.waitForResults()

    await home.search('gold')
    await expect(page).toHaveURL(/[?&]q=gold/)
    // Search matches name and collection ("Golden Frequency").
    const all = Object.values((await app.db())?.nfts ?? {})
    const matchesGold = (name: string) => {
      const nft = all.find((item) => item.name === name)
      return `${nft?.name} ${nft?.collection.name}`.toLowerCase().includes('gold')
    }
    await expect
      .poll(async () => {
        const names = await home.cardNames()
        return names.includes('Golden Beat #207') && names.every(matchesGold)
      })
      .toBe(true)

    await home.toggleFilter('Música')
    await home.toggleFilter('Polygon')
    await home.closeFilters()
    await expect(page).toHaveURL(/categories=musica/)
    await expect(page).toHaveURL(/networks=polygon/)
    const nfts = Object.values((await app.db())?.nfts ?? {})
    await expect
      .poll(async () => {
        const names = await home.cardNames()
        return (
          names.length > 0 &&
          names.every((name) => {
            const nft = nfts.find((item) => item.name === name)
            return nft?.category === 'musica' && nft.network === 'polygon'
          })
        )
      })
      .toBe(true)

    await page.goBack()
    await expect(page).not.toHaveURL(/networks=/)
    await page.goBack()
    await expect(page).not.toHaveURL(/categories=/)
    await page.reload()
    await expect(page).toHaveURL(/q=gold/)
    await app.expectNoHorizontalOverflow()
  })

  test('lowest price sorting and pagination resets to 1 when filtering', async ({ app, page }) => {
    await app.reset()
    const home = new HomePage(page)
    await home.waitForResults()

    await home.sortBy('Menor preço')
    await home.closeFilters()
    await expect(page).toHaveURL(/sort=price_asc/)
    await expect.poll(async () => (await home.cardNames())[0]).toBe('Canopy Ape #271')

    await home.goToPage(2)
    await expect(page).toHaveURL(/page=2/)
    await home.toggleFilter('Ethereum')
    await home.closeFilters()
    await expect(page).toHaveURL(/networks=ethereum/)
    await expect(page).not.toHaveURL(/page=/)
  })

  test('out-of-order responses never overwrite the latest search', async ({ app, page }) => {
    await app.reset('out-of-order')
    const home = new HomePage(page)
    await home.waitForResults()
    await home.search('gol')
    await page.waitForTimeout(400)
    await home.search('neon')
    await expect(page).toHaveURL(/q=neon/)
    await expect.poll(() => home.cardNames(), { timeout: 5000 }).toEqual(['Neon Vessel #552'])
    await page.waitForTimeout(1600)
    expect(await home.cardNames()).toEqual(['Neon Vessel #552'])
  })

  test('empty catalog shows empty state with "Limpar filtros"', async ({ app, page }) => {
    await app.reset('empty-catalog')
    await expect(page.getByRole('heading', { name: 'Nenhum NFT encontrado' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Limpar filtros' })).toBeVisible()
  })

  test('hero: switching slides changes text, CTA and art; "VER NFT" opens the detail', async ({
    app,
    page,
  }) => {
    await app.reset()
    const hero = page.getByRole('region', { name: 'Destaques' }).filter({ visible: true })
    await expect(hero.getByRole('heading', { level: 1 })).toContainText('SEJA DONO')
    const dots = hero.getByRole('group', { name: 'Escolher destaque' })
    const dotsBefore = await dots.boundingBox()
    await hero.getByRole('button', { name: 'Destaque 2 de 3' }).click()
    await expect(hero.getByRole('heading', { level: 1 })).toHaveCount(0)
    await expect(hero.getByRole('heading', { level: 2 })).toHaveText('SAGE NOMAD #009')
    expect(await dots.boundingBox()).toEqual(dotsBefore)
    await expect(hero.getByRole('img', { name: 'Sage Nomad #009' })).toBeVisible()
    await hero.getByRole('link', { name: 'VER NFT' }).click()
    await expect(page).toHaveURL(/\/nfts\/nft_sage_nomad_009/)
  })
})
