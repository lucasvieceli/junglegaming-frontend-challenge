export function currentOwnerKey(): string | null {
  try {
    const session = window.localStorage.getItem('kurio.session')
    if (session) {
      const userId = (JSON.parse(session) as { user?: { id?: string } }).user?.id
      if (userId) return `user:${userId}`
    }
    const guestId = window.localStorage.getItem('kurio.guestId')
    return guestId ? `guest:${JSON.parse(guestId) as string}` : null
  } catch {
    return null
  }
}
