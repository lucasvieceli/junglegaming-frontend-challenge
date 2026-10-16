import path from 'node:path'

import { AccountPage } from '../pages/AccountPage'
import { AuthPage } from '../pages/AuthPage'
import { USERS, expect, test } from '../fixtures/test'

test.describe('profile and wallets', () => {
  test('display name persists after refresh', async ({ app, page }) => {
    await app.reset('default', { user: 'ana', path: '/account/profile' })
    const account = new AccountPage(page)
    await account.field('Nome de exibição').fill('Ana Colecionadora')
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(page.getByText('Perfil atualizado.')).toBeVisible()
    await page.reload()
    await expect(account.field('Nome de exibição')).toHaveValue('Ana Colecionadora')
    expect((await app.db())?.users.usr_ana?.displayName).toBe('Ana Colecionadora')
  })

  test('avatar: upload shows the preview and persists', async ({ app, page }) => {
    await app.reset('default', { user: 'ana', path: '/account/profile' })
    await page
      .getByLabel('Avatar')
      .setInputFiles(path.join(import.meta.dirname, '../fixtures/avatar.png'))
    await expect(page.getByRole('img', { name: 'Seu avatar' })).toBeVisible()
    expect((await app.db())?.users.usr_ana?.avatarUrl).toMatch(/^data:image\//)
  })

  test('password: wrong current shows error; correct one changes it and the new login works', async ({
    app,
    page,
  }) => {
    await app.reset('default', { user: 'ana', path: '/account/profile' })
    const account = new AccountPage(page)
    await account.field('Senha atual').fill('errada123')
    await account.field('Nova senha').fill('NovaSenha2026')
    await account.field('Confirmar nova senha').fill('NovaSenha2026')
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(page.getByText('A senha atual está incorreta.')).toBeVisible()

    await account.field('Senha atual').fill(USERS.ana.password)
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(page.getByText('Perfil e senha atualizados.')).toBeVisible()

    await account.logout()
    await page.goto('/login')
    await new AuthPage(page).login(USERS.ana.email, 'NovaSenha2026')
    await expect(page).toHaveURL(/localhost:\d+\/(\?|$)/)
  })

  test('primary wallet: invalid address shows error; valid one saves', async ({ app, page }) => {
    await app.reset('default', { user: 'bruno', path: '/account/wallets' })
    const account = new AccountPage(page)
    const primary = account.section('Carteira principal')
    await account.field('Nome de exibição', primary).fill('Bruno Lima')
    await account.field('Apelido da carteira', primary).fill('Principal')
    await account.field('Nome do perfil', primary).fill('bruno.lima')
    await account.field('Endereço da carteira', primary).fill('0x123')
    await account.field('Código de indicação', primary).fill('KURIO-BR')
    await account.field('E-mail', primary).fill('bruno@kurio.test')
    await account.field('Nome ENS', primary).fill('bruno')
    await primary.getByRole('combobox', { name: /^Rede/ }).click()
    await page.getByRole('option', { name: 'Polygon' }).click()
    await primary.getByRole('combobox', { name: /^Tipo de carteira/ }).click()
    await page.getByRole('option', { name: 'MetaMask' }).click()
    await primary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(
      primary.getByText('Endereço 0x inválido (40 caracteres hexadecimais)'),
    ).toBeVisible()

    await account
      .field('Endereço da carteira', primary)
      .fill('0x1111111111111111111111111111111111111111')
    await primary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(page.getByText('Carteira salva.')).toBeVisible()
    const wallets = Object.values((await app.db())?.wallets ?? {}).filter(
      (wallet) => wallet.userId === 'usr_bruno',
    )
    expect(
      wallets.some((wallet) => wallet.kind === 'primary' && wallet.network === 'polygon'),
    ).toBe(true)
  })

  test('API validation errors show on the right fields', async ({ app, page }) => {
    await app.reset('validation-errors', { user: 'ana', path: '/account/profile' })
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    const account = new AccountPage(page)
    await expect(account.field('Nome de usuário')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Este nome de usuário não é permitido.')).toBeVisible()
  })

  test('sidebar stays mounted across subpages and the indicator slides to the active item', async ({
    app,
    page,
  }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, 'sidebar is desktop only')
    await app.reset('default', { user: 'ana', path: '/account/profile' })
    const sidebar = page.getByRole('navigation', { name: 'Minha conta' }).filter({ visible: true })
    await sidebar.evaluate((element) => element.setAttribute('data-test-mounted', 'true'))
    const wallets = sidebar.getByRole('link', { name: 'Carteiras' })
    await wallets.click()
    await expect(page).toHaveURL(/\/account\/wallets/)
    await expect(wallets).toHaveAttribute('aria-current', 'page')
    await expect(sidebar).toHaveAttribute('data-test-mounted', 'true')
    const indicator = sidebar.locator('ul > span[aria-hidden="true"]')
    await expect
      .poll(async () => {
        const [a, b] = await Promise.all([indicator.boundingBox(), wallets.boundingBox()])
        return a && b ? Math.round(a.y - b.y) : null
      })
      .toBe(0)
  })
})
