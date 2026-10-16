import { Fragment } from 'react'

import type { Order } from '@/shared/contracts/order'
import { formatReceiptDate } from '@/shared/lib/format-date'
import { formatEth } from '@/shared/lib/money'
import { shortAddress } from '@/shared/lib/short-address'
import { WALLET_TYPE_LABELS } from '@/shared/lib/wallet-labels'

import { CopyTransactionButton } from './CopyTransactionButton'

export function TransactionMeta({ order }: { order: Order }) {
  const ref = order.transaction?.ref ?? ''
  const columns = [
    {
      label: 'ID da transação',
      bold: true,
      value: shortAddress(ref),
      extra: ref ? <CopyTransactionButton value={ref} /> : null,
    },
    {
      label: 'Data',
      bold: false,
      value: order.confirmedAt ? formatReceiptDate(order.confirmedAt) : '—',
    },
    { label: 'Total', bold: false, value: formatEth(order.pricing.total) },
    { label: 'Carteira', bold: true, value: WALLET_TYPE_LABELS[order.wallet.type] },
  ]
  return (
    <dl className="grid grid-cols-2 gap-4 px-6 py-3 text-text-secondary sm:flex sm:min-h-[65px] sm:items-center sm:justify-between sm:gap-0 sm:px-9 sm:py-1">
      {columns.map((column, index) => (
        <Fragment key={column.label}>
          {index > 0 && (
            <span aria-hidden="true" className="hidden h-[31px] w-px bg-primary sm:block" />
          )}
          <div className="flex min-w-0 flex-col">
            <dt className={column.bold ? 'type-b-14-bold' : 'type-b-14'}>{column.label}</dt>
            <dd className="type-b-15 flex items-center gap-1">
              {column.value}
              {column.extra}
            </dd>
          </div>
        </Fragment>
      ))}
    </dl>
  )
}
