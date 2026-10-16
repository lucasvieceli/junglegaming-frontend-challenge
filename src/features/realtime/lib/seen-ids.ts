const LIMIT = 500

export class SeenIds {
  private readonly ids = new Set<string>()
  private readonly order: string[] = []

  add(id: string): boolean {
    if (this.ids.has(id)) return false
    this.ids.add(id)
    this.order.push(id)
    if (this.order.length > LIMIT) this.ids.delete(this.order.shift() as string)
    return true
  }
}
