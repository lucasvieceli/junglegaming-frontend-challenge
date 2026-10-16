let open: () => void = () => undefined

export const apiReady: Promise<void> = new Promise((resolve) => {
  open = resolve
})

export function openApiGate(): void {
  open()
}
