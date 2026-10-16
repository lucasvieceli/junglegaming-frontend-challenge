import type { Locator, Page } from '@playwright/test'

export class NftDetailPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  goto(id: string) {
    return this.page.goto(`/nfts/${id}`)
  }

  get title(): Locator {
    return this.page.getByRole('heading', { level: 1 }).filter({ visible: true })
  }

  editions(): Locator {
    return this.page
      .getByRole('radiogroup', { name: 'Edição:' })
      .filter({ visible: true })
      .getByRole('radio')
  }

  addToCart(): Locator {
    return this.page
      .getByRole('button', { name: /^(COMPRAR|Adicionar .+ ao carrinho)$/ })
      .filter({ visible: true })
      .first()
  }

  increase(name: string): Locator {
    return this.page
      .getByRole('button', { name: `Aumentar quantidade de ${name}` })
      .filter({ visible: true })
  }
}
