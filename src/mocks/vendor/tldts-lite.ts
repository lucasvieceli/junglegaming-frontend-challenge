const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/

export function getDomain(hostname: string): string | null {
  if (!hostname) return null
  if (IPV4.test(hostname) || !hostname.includes('.')) return hostname
  return hostname.split('.').slice(-2).join('.')
}
