import type { Locator, Page } from '@playwright/test'

export class CartPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  goto() {
    return this.page.goto('/cart')
  }

  private visible(locator: Locator): Locator {
    return locator.filter({ visible: true }).first()
  }

  get items(): Locator {
    return this.visible(this.page.getByRole('list', { name: 'Itens do carrinho' })).getByRole(
      'listitem',
    )
  }

  item(name: string): Locator {
    return this.items.filter({ hasText: name })
  }

  increase(name: string): Locator {
    return this.visible(this.page.getByRole('button', { name: `Aumentar quantidade de ${name}` }))
  }

  remove(name: string): Locator {
    return this.visible(this.page.getByRole('button', { name: `Remover ${name}` }))
  }

  get couponInput(): Locator {
    return this.visible(this.page.getByLabel('Código promocional'))
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code)
    await this.visible(this.page.getByRole('button', { name: 'Aplicar' })).click()
  }

  summaryValue(label: string): Locator {
    return this.visible(
      this.page.getByRole('term').filter({ hasText: new RegExp(`^${label}$`) }),
    ).locator('xpath=following-sibling::dd[1]')
  }
}
