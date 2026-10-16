import type { SessionState } from './session-store'
import { getGuestId } from './guest-id'

export function ownerKeyOf(session: SessionState): string {
  return session.user ? `user:${session.user.id}` : `guest:${getGuestId()}`
}
