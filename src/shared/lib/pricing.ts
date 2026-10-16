import Big from 'big.js'

import type { CartPricing } from '@/shared/contracts/cart'
import type { EthAmount, Network } from '@/shared/contracts/common'

import { addEth, eth, mulEth, toEthString } from './money'

export const NETWORK_FEES: Record<Network, EthAmount> = {
  ethereum: '0.016',
  polygon: '0.002',
  solana: '0.001',
}

export interface PricingLine {
  unitPrice: EthAmount
  quantity: number
}

export function computePricing(
  lines: PricingLine[],
  options: { percentOff?: number; feeNetwork: Network },
): CartPricing {
  const subtotal = addEth(...lines.map((line) => mulEth(line.unitPrice, line.quantity)))
  const discount = subtotal
    .times(options.percentOff ?? 0)
    .div(100)
    .round(6, Big.roundDown)
  const networkFee = lines.length ? eth(NETWORK_FEES[options.feeNetwork]) : new Big(0)
  const total = subtotal.minus(discount).plus(networkFee)
  return {
    subtotal: toEthString(subtotal),
    discount: toEthString(discount),
    networkFee: toEthString(networkFee),
    total: toEthString(total),
    feeNetwork: options.feeNetwork,
  }
}

export function lineTotal(unitPrice: EthAmount, quantity: number): EthAmount {
  return toEthString(mulEth(unitPrice, quantity))
}
