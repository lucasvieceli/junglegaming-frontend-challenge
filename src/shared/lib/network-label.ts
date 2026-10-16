import type { Network } from '@/shared/contracts/common'

export const NETWORK_LABELS: Record<Network, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  solana: 'Solana',
}

export const NETWORK_EXPLORERS: Record<Network, { name: string; txUrl: string }> = {
  ethereum: { name: 'Etherscan', txUrl: 'https://etherscan.io/tx/' },
  polygon: { name: 'Polygonscan', txUrl: 'https://polygonscan.com/tx/' },
  solana: { name: 'Solscan', txUrl: 'https://solscan.io/tx/' },
}
