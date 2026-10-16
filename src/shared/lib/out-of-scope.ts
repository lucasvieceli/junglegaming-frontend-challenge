import { toast } from '@/shared/lib/toast'

export function notifyOutOfScope(label: string): void {
  toast.info(`${label} não está disponível nesta demonstração.`)
}
