import type { Locator, Page } from '@playwright/test'

export class AccountPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  field(label: string, scope?: Locator): Locator {
    return (scope ?? this.page.getByRole('main')).getByLabel(new RegExp(`^${label}\\*?$`)).first()
  }

  section(name: string): Locator {
    return this.page.getByRole('region', { name })
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Sair' }).filter({ visible: true }).first().click()
  }
}
