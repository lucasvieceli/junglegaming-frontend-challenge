import { openCheckoutWithItem } from '../fixtures/flows'
import { AccountPage } from '../pages/AccountPage'
import { AuthPage } from '../pages/AuthPage'
import { USERS, expect, test } from '../fixtures/test'

test.describe('auth and session', () => {
  test('sign-up with new data logs in and returns home', async ({ app, page }) => {
    await app.reset('default', { path: '/register' })
    await new AuthPage(page).register({
      username: 'carla.dev',
      email: 'carla@kurio.test',
      password: 'Senha2026',
    })
    await expect(page).toHaveURL(/localhost:\d+\/(\?|$)/)
    const db = await app.db()
    expect(Object.values(db?.users ?? {}).some((user) => user.email === 'carla@kurio.test')).toBe(
      true,
    )
  })

  test('sign-up with existing email shows a field error', async ({ app, page }) => {
    await app.reset('default', { path: '/register' })
    const auth = new AuthPage(page)
    await auth.register({ username: 'ana.nova', email: USERS.ana.email, password: 'Senha2026' })
    await expect(auth.field('E-mail')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Este e-mail já está em uso').first()).toBeVisible()
  })

  test('login with wrong password shows an alert', async ({ app, page }) => {
    await app.reset('default', { path: '/login' })
    await new AuthPage(page).login(USERS.ana.email, 'errada123')
    await expect(
      page.getByRole('alert').filter({ hasText: 'E-mail ou senha incorretos.' }),
    ).toBeVisible()
  })

  test('private route redirects to login and back after signing in', async ({ app, page }) => {
    await app.reset('default', { path: '/account/profile' })
    await expect(page).toHaveURL(/\/login\?redirect=%2Faccount%2Fprofile/)
    await new AuthPage(page).login(USERS.ana.email, USERS.ana.password)
    await expect(page).toHaveURL(/\/account\/profile(\?|$)/)
  })

  test('signed-in user does not see the login', async ({ app, page }) => {
    await app.reset('default', { user: 'ana', path: '/login' })
    await expect(page).toHaveURL(/localhost:\d+\/(\?|$)/)
  })

  test('session expires on checkout: notice, login and restored draft', async ({ app, page }) => {
    const checkout = await openCheckoutWithItem(app, page, 'session-expired')
    await checkout.field('Código de indicação').fill('KURIO-TEST')
    await app.fastForward(1000)
    await app.fastForward(21_000)
    await expect(page.getByText('Sua sessão expirou. Entre novamente.')).toBeVisible()
    await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout/)
    await new AuthPage(page).login(USERS.ana.email, USERS.ana.password)
    await expect(page).toHaveURL(/\/checkout/)
    await expect(checkout.field('Código de indicação')).toHaveValue('KURIO-TEST')
  })

  test('logout clears private data and another user does not see the previous cart', async ({
    app,
    page,
  }) => {
    await openCheckoutWithItem(app, page)
    await page.goto('/account/profile')
    await new AccountPage(page).logout()
    await expect(page).toHaveURL(/localhost:\d+\/(\?|$)/)
    await page.goto('/favorites')
    await expect(page).toHaveURL(/\/login\?redirect=%2Ffavorites/)

    await new AuthPage(page).login(USERS.bruno.email, USERS.bruno.password)
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible()
    const db = await app.db()
    expect(db?.carts['user:usr_ana']?.items.length).toBe(1)
    expect(db?.carts['user:usr_bruno']?.items.length ?? 0).toBe(0)
  })
})
