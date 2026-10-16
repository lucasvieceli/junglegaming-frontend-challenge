import { ownerKeyOf } from './owner-key'
import { useSession } from './useSession'

export function useOwnerKey(): string {
  return ownerKeyOf(useSession())
}
