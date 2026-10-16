import { hashBody } from '@/shared/lib/hash'
import { newId } from '@/shared/lib/id'

export async function hashPassword(
  password: string,
  salt: string = newId(),
): Promise<{ salt: string; hash: string }> {
  return { salt, hash: await hashBody(`${salt}:${password}`) }
}

export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  const { hash } = await hashPassword(password, salt)
  return hash === expectedHash
}
