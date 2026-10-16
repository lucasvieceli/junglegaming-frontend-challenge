let mark: () => void = () => undefined

export const firstScreen: Promise<void> = new Promise((resolve) => {
  mark = resolve
})

export function markFirstScreen(): void {
  mark()
}

// Without the timeout, guarded routes (waiting for the API) and the API (waiting for the first screen) deadlock.
export function firstScreenOrTimeout(ms: number): Promise<void> {
  return Promise.race([firstScreen, new Promise<void>((resolve) => window.setTimeout(resolve, ms))])
}
