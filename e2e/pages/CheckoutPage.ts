import { expect, type Locator, type Page } from '@playwright/test'

export class CheckoutPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get isDesktop(): boolean {
    return (this.page.viewportSize()?.width ?? 0) >= 1024
  }

  field(label: string): Locator {
    return this.page.getByLabel(new RegExp(`^${label}\\*?$`))
  }

  async goToWalletStep() {
    if (!this.isDesktop) await this.page.getByRole('button', { name: 'Continuar' }).click()
  }

  get walletStatus(): Locator {
    return this.page.getByTestId('wallet-connection')
  }

  async connectWallet() {
    await this.page.getByRole('button', { name: /^(Conectar|Tentar de novo)$/ }).click()
    await expect(this.walletStatus).toHaveAttribute('data-state', 'connected')
  }

  async goToReviewStep() {
    if (!this.isDesktop) await this.confirmButton.click()
  }

  get confirmButton(): Locator {
    return this.page.getByRole('button', { name: /^(Confirmar compra|Confirmando…)$/ }).first()
  }

  get reviewDialog(): Locator {
    return this.page.getByRole('dialog', { name: 'Revise seu pedido' })
  }

  async confirm() {
    await this.confirmButton.click()
    if (this.isDesktop) {
      await expect(this.reviewDialog).toBeVisible()
      await this.reviewDialog.getByRole('button', { name: 'Confirmar compra' }).click()
    }
  }
}
