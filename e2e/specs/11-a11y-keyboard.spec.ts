import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

import { openCheckoutWithItem } from '../fixtures/flows'
import { expect, test } from '../fixtures/test'

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024

async function expectNoSeriousViolations(page: Page) {
  // Wait for fade transitions so contrast is measured on the final state.
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running'),
  )
  const results = await new AxeBuilder({ page }).exclude('[data-sonner-toaster]').analyze()
  const serious = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )
  expect(
    serious.map(
      (violation) =>
        `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
    ),
  ).toEqual([])
}

test.describe('accessibility and keyboard', () => {
  test('visible focus on header and skip-to-content link', async ({ app, page }) => {
    await app.reset()
    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
    await expect(skip).toBeAttached()
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await page.keyboard.press('Tab')
    await expect(skip).toBeFocused()
    await page.keyboard.press('Tab')
    // The indicator may be on the element itself or on a focus-within container (mobile search).
    const hasIndicator = await page.evaluate(() => {
      let element = document.activeElement as HTMLElement | null
      for (let depth = 0; element && depth < 3; depth++, element = element.parentElement) {
        const style = getComputedStyle(element)
        if (style.outlineStyle !== 'none' || style.boxShadow !== 'none') return true
      }
      return false
    })
    expect(hasIndicator).toBe(true)
  })

  test('login modal: focus on first field, Tab trapped, Esc closes', async ({ app, page }) => {
    test.skip(!isDesktop(page), 'modal is desktop only')
    await app.reset()
    await page.getByRole('link', { name: 'Entrar' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByLabel('E-mail', { exact: true })).toBeFocused()
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('filters drawer: focus moves in, Tab stays inside, Esc closes and returns focus', async ({
    app,
    page,
  }) => {
    test.skip(isDesktop(page), 'drawer is mobile only')
    await app.reset()
    const trigger = page.getByRole('button', { name: 'Filtros', exact: true })
    await trigger.click()
    const drawer = page.getByRole('dialog', { name: 'Filtros' })
    await expect(drawer).toBeVisible()
    expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    for (let i = 0; i < 15; i++) await page.keyboard.press('Tab')
    expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('empty sign-up: errors linked to fields and focus on first invalid', async ({
    app,
    page,
  }) => {
    await app.reset('default', { path: '/register' })
    await page.getByRole('button', { name: /^Criar (conta|perfil)$/ }).click()
    const username = page.getByLabel('Nome de usuário', { exact: true })
    await expect(username).toBeFocused()
    await expect(username).toHaveAttribute('aria-invalid', 'true')
    const describedBy = await username.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`[id="${describedBy?.split(' ')[0] ?? ''}"]`)).toBeVisible()
  })

  test('out-of-scope actions notify via toast without navigating', async ({ app, page }) => {
    await app.reset()
    const url = page.url()
    await page.getByRole('button', { name: 'Central de ajuda' }).first().click()
    await expect(
      page.getByText('Central de ajuda não está disponível nesta demonstração.'),
    ).toBeVisible()
    await page.getByLabel('Antecipe-se ao próximo lançamento').fill('eu@exemplo.com')
    await page.getByRole('button', { name: 'Enviar' }).click()
    await expect(
      page.getByText('A inscrição na newsletter não está disponível nesta demonstração.'),
    ).toBeVisible()
    expect(page.url()).toBe(url)
  })

  test('axe: main screens without serious violations', async ({ app, page }) => {
    test.setTimeout(120_000)
    await app.reset('default', { user: 'ana' })
    for (const path of [
      '/',
      '/nfts/nft_emerald_ape_042',
      '/favorites',
      '/account/profile',
      '/account/wallets',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await expectNoSeriousViolations(page)
    }
    await openCheckoutWithItem(app, page)
    await expectNoSeriousViolations(page)
    await page.goto('/cart')
    await expectNoSeriousViolations(page)
  })

  test('axe: login/sign-up without serious violations', async ({ app, page }) => {
    // The modal only opens once the initial session is known.
    await app.reset('default', { path: '/login' })
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
    await expectNoSeriousViolations(page)
    await page.goto('/register')
    await expect(page.getByRole('button', { name: /^Criar (conta|perfil)$/ })).toBeVisible()
    await expectNoSeriousViolations(page)
  })

  test('200% zoom: content reflows without horizontal scroll or loss', async ({ app, page }) => {
    test.skip(!isDesktop(page), 'equivalent to 1440px at 200% zoom')
    await page.setViewportSize({ width: 720, height: 450 })
    await app.reset('default', { user: 'ana' })
    for (const path of [
      '/',
      '/nfts/nft_emerald_ape_042',
      '/cart',
      '/account/profile',
      '/account/wallets',
    ]) {
      await page.goto(path)
      await expect(
        page.getByRole('heading', { level: 1 }).filter({ visible: true }).first(),
      ).toBeVisible()
      await app.expectNoHorizontalOverflow()
    }
  })
})
