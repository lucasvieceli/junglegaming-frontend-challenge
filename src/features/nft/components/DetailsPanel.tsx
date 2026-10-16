import type { NftDetail } from '@/shared/contracts/nft'
import { NETWORK_LABELS } from '@/shared/lib/network-label'

export function DetailsPanel({ nft }: { nft: NftDetail }) {
  const rows = [
    {
      label: 'Rede:',
      value: `Cunhado na ${NETWORK_LABELS[nft.network]} com procedência imutável e metadados armazenados no IPFS.`,
    },
    { label: 'Contrato:', value: `${nft.contract} • Contrato inteligente ERC-721 verificado.` },
    {
      label: 'Direitos autorais:',
      value: `Direitos autorais do criador: ${nft.royaltiesPct}% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.`,
    },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="type-b-14-24 flex flex-col gap-6 text-text-secondary">
        {nft.description.split('\n\n').map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      <dl className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="type-b-14-bold-24 text-foreground">{row.label}</dt>
            <dd className="type-b-14-24 text-text-secondary">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
