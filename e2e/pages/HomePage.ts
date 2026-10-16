import { expect, type Locator, type Page } from '@playwright/test'

const DESKTOP_MIN_WIDTH = 1024

export class HomePage {
  readonly page: Page
  readonly catalog: Locator

  constructor(page: Page) {
    this.page = page
    this.catalog = page.getByRole('region', { name: 'Catálogo de NFTs' })
  }

  get isDesktop(): boolean {
    return (this.page.viewportSize()?.width ?? 0) >= DESKTOP_MIN_WIDTH
  }

  async cardNames(): Promise<string[]> {
    await expect(this.catalog.getByRole('list').first()).not.toHaveAttribute('aria-busy', 'true')
    return this.catalog.getByRole('article').getByRole('heading').allInnerTexts()
  }

  async waitForResults() {
    await expect(this.catalog.getByRole('article').first()).toBeVisible()
  }

  async search(term: string) {
    if (this.isDesktop) {
      await this.page.getByRole('banner').getByRole('button', { name: 'Buscar NFTs' }).click()
      const dialog = this.page.getByRole('dialog', { name: 'Buscar NFTs' })
      await dialog.getByRole('searchbox').fill(term)
      await dialog.getByRole('searchbox').press('Enter')
    } else {
      await this.page.getByRole('searchbox', { name: 'Buscar NFTs' }).fill(term)
    }
  }

  async filters(): Promise<Locator> {
    if (this.isDesktop) return this.page.getByRole('complementary', { name: 'Filtros' })
    const dialog = this.page.getByRole('dialog', { name: 'Filtros' })
    if (!(await dialog.isVisible()))
      await this.page.getByRole('button', { name: /^Filtros/ }).click()
    return dialog
  }

  async closeFilters() {
    if (this.isDesktop) return
    const dialog = this.page.getByRole('dialog', { name: 'Filtros' })
    if (await dialog.isVisible()) await dialog.getByRole('button', { name: 'Fechar' }).click()
    await expect(dialog).toBeHidden()
  }

  async toggleFilter(name: string) {
    const panel = await this.filters()
    await panel.getByRole('button', { name: new RegExp(`^${name}`) }).click()
  }

  async sortBy(label: string) {
    const scope = this.isDesktop ? this.catalog : await this.filters()
    await scope.getByRole('combobox', { name: 'Ordenar por:' }).click()
    await this.page.getByRole('option', { name: label }).click()
  }

  async goToPage(n: number) {
    await this.page
      .getByRole('navigation', { name: 'Paginação' })
      .getByRole('link', { name: `Página ${n}` })
      .click()
  }
}
