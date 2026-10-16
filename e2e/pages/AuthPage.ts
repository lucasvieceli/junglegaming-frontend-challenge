import type { Locator, Page } from '@playwright/test'

export class AuthPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get root(): Locator {
    const desktop = (this.page.viewportSize()?.width ?? 0) >= 1024
    return desktop ? this.page.getByRole('dialog') : this.page.getByRole('main')
  }

  field(label: string): Locator {
    return this.root.getByLabel(label, { exact: true })
  }

  async login(email: string, password: string) {
    await this.field('E-mail').fill(email)
    await this.field('Senha').fill(password)
    await this.root.getByRole('button', { name: 'Entrar', exact: true }).click()
  }

  async register(values: { username: string; email: string; password: string }) {
    await this.field('Nome de usuário').fill(values.username)
    await this.field('E-mail').fill(values.email)
    await this.field('Senha').fill(values.password)
    await this.field('Confirmar senha').fill(values.password)
    await this.root.getByRole('button', { name: /^Criar (conta|perfil)$/ }).click()
  }
}
