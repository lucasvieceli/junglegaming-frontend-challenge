export interface HttpAuthBindings {
  getToken: () => string | null
  getGuestId: () => string
  onUnauthorized: () => void
}

let bindings: HttpAuthBindings = {
  getToken: () => null,
  getGuestId: () => '',
  onUnauthorized: () => undefined,
}

export function configureHttpAuth(next: HttpAuthBindings): void {
  bindings = next
}

export function getHttpAuth(): HttpAuthBindings {
  return bindings
}
