import { NETWORK_LABELS } from '@/shared/lib/network-label'
import { WALLET_TYPE_LABELS } from '@/shared/lib/wallet-labels'

export const NETWORK_OPTIONS = Object.entries(NETWORK_LABELS).map(([value, label]) => ({
  value,
  label,
}))
export const WALLET_TYPE_OPTIONS = Object.entries(WALLET_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}))
