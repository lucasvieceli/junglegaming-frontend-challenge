export class VersionStore {
  private readonly versions = new Map<string, number>()

  accept(resourceKey: string, version: number, cachedVersion?: number): boolean {
    const known = Math.max(this.versions.get(resourceKey) ?? -1, cachedVersion ?? -1)
    if (version <= known) return false
    this.versions.set(resourceKey, version)
    return true
  }
}
