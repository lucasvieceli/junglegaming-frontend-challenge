export function shortAddress(address: string): string {
  if (!/^0x[a-fA-F0-9]{40,64}$/.test(address)) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
