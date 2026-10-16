import type * as SonnerModule from 'sonner'
import type { ExternalToast } from 'sonner'

type Sonner = typeof SonnerModule

let sonner: Promise<Sonner> | null = null
const load = () => (sonner ??= import('sonner'))

export const toast = {
  success: (message: string, options?: ExternalToast) =>
    void load().then((module) => module.toast.success(message, options)),
  error: (message: string, options?: ExternalToast) =>
    void load().then((module) => module.toast.error(message, options)),
  info: (message: string, options?: ExternalToast) =>
    void load().then((module) => module.toast.info(message, options)),
}
