import Big from 'big.js'

import type { EthAmount } from '@/shared/contracts/common'

const MAX_DECIMALS = 6

export function eth(value: EthAmount | Big): Big {
  return value instanceof Big ? value : new Big(value)
}

export function addEth(...values: Array<EthAmount | Big>): Big {
  return values.reduce<Big>((sum, value) => sum.plus(eth(value)), new Big(0))
}

export function mulEth(value: EthAmount | Big, factor: number | string): Big {
  return eth(value).times(factor)
}

export function toEthString(value: Big): EthAmount {
  return value.round(MAX_DECIMALS, Big.roundDown).toString()
}

export function formatEth(
  value: EthAmount | Big,
  options: { minDecimals?: number; withUnit?: boolean } = {},
): string {
  const { minDecimals = 2, withUnit = true } = options
  const plain = toEthString(eth(value))
  const [integer, decimals = ''] = plain.split('.')
  const text = `${integer}.${decimals.padEnd(minDecimals, '0')}`
  return withUnit ? `${text} ETH` : text
}

export function formatEthRange(min: EthAmount, max: EthAmount): string {
  const toComma = (value: EthAmount) => formatEth(value, { withUnit: false }).replace('.', ',')
  return `${toComma(min)} - ${toComma(max)} ETH`
}

export function formatDiscount(value: EthAmount): string {
  return eth(value).eq(0) ? '(-) 0.00' : `(-) ${formatEth(value)}`
}

export function compareEth(a: EthAmount, b: EthAmount): number {
  return eth(a).cmp(eth(b))
}
